package portfolio

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"mime"
	"net/http"
	"runtime/debug"
	"strconv"
	"strings"
	"sync"
	"time"
)

// App adalah satu implementasi yang dipakai bersama server lokal dan Vercel
// Function. `send` bisa ditukar saat pengujian supaya tidak menyentuh SMTP.
type App struct {
	cfg     Config
	send    func(ContactInput) error
	limiter *rateLimiter
}

func New(cfg Config) *App {
	return &App{
		cfg:     cfg,
		send:    func(in ContactInput) error { return sendContactEmail(cfg, in) },
		limiter: newRateLimiter(),
	}
}

var (
	defaultOnce sync.Once
	defaultApp  *App
	defaultErr  error
)

// Default mengembalikan aplikasi tunggal yang dikonfigurasi sekali, untuk
// dipakai api/*.go. Konfigurasi dimuat malas supaya fungsi Vercel tidak gagal
// saat inisialisasi paket.
func Default() (*App, error) {
	defaultOnce.Do(func() {
		cfg, err := LoadConfig()
		if err != nil {
			defaultErr = err
			return
		}
		defaultApp = New(cfg)
	})
	return defaultApp, defaultErr
}

type successResponse struct {
	Success bool `json:"success"`
}

type errorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
	Code    string `json:"code"`
}

type healthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	b, err := json.Marshal(v)
	if err != nil {
		writeAPIError(w, newAPIError(http.StatusInternalServerError, codeServerError))
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	w.Write(b)
}

func writeAPIError(w http.ResponseWriter, e *apiError) {
	writeJSON(w, e.status, errorResponse{Success: false, Error: contactErrors[e.code], Code: e.code})
}

// withMiddleware memasang urutan yang sama dengan Express: pemulihan panic
// paling luar, lalu header keamanan, CORS, dan jawaban preflight.
func (a *App) withMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if v := recover(); v != nil {
				log.Printf("[error] panic: %v\n%s", v, debug.Stack())
				writeAPIError(w, newAPIError(http.StatusInternalServerError, codeServerError))
			}
		}()

		securityHeaders(w.Header())
		applyCORS(w.Header(), r)
		if r.Method == http.MethodOptions {
			handlePreflight(w, r)
			return
		}
		next(w, r)
	}
}

// ServeHTTP merutekan jalur persis — bukan prefix — untuk server lokal.
func (a *App) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	a.withMiddleware(a.route)(w, r)
}

// Health adalah handler penuh untuk api/health.go; mengabaikan jalur supaya
// berfungsi baik Vercel meneruskan /api/health maupun /.
func (a *App) Health(w http.ResponseWriter, r *http.Request) {
	a.withMiddleware(a.health)(w, r)
}

// Contact adalah handler penuh untuk api/contact.go; mengabaikan jalur.
func (a *App) Contact(w http.ResponseWriter, r *http.Request) {
	a.withMiddleware(a.contact)(w, r)
}

func (a *App) route(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/api/health", "/health":
		a.health(w, r)
	case "/api/contact":
		a.contact(w, r)
	default:
		writeAPIError(w, newAPIError(http.StatusNotFound, codeNotFound))
	}
}

func (a *App) health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		writeAPIError(w, newAPIError(http.StatusNotFound, codeNotFound))
		return
	}
	writeJSON(w, http.StatusOK, healthResponse{
		Status:    "ok",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	})
}

func (a *App) contact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeAPIError(w, newAPIError(http.StatusNotFound, codeNotFound))
		return
	}

	// Pembatas laju melindungi endpoint sebelum isi body diperiksa sama sekali,
	// supaya request tidak bisa membakar CPU mengurai JSON tanpa di-throttle.
	if ok, retry := a.limiter.allow(clientIP(r)); !ok {
		w.Header().Set("Retry-After", strconv.Itoa(retry))
		writeAPIError(w, newAPIError(http.StatusTooManyRequests, codeRateLimited))
		return
	}

	body, apiErr := readContactBody(w, r)
	if apiErr != nil {
		writeAPIError(w, apiErr)
		return
	}

	// Honeypot: hanya bot yang mengisinya. Dibalas sukses supaya bot tidak
	// tahu dirinya ketahuan, tapi email tidak pernah dikirim. Sengaja
	// diperiksa SETELAH rateLimit dan SEBELUM validasi.
	if obj, ok := body.(map[string]any); ok {
		if honeypot, ok := obj["honeypot"].(string); ok && jsTrim(honeypot) != "" {
			writeJSON(w, http.StatusOK, successResponse{Success: true})
			return
		}
	}

	msg, apiErr := validateContact(body)
	if apiErr != nil {
		writeAPIError(w, apiErr)
		return
	}

	if err := a.send(msg); err != nil {
		// Detail asli hanya masuk ke log server; klien selalu dapat kode tetap.
		log.Printf("[error] send contact: %v", err)
		writeAPIError(w, newAPIError(http.StatusInternalServerError, codeServerError))
		return
	}

	writeJSON(w, http.StatusOK, successResponse{Success: true})
}

const maxBodyBytes = 16 * 1024

// readContactBody membaca dan mengurai body JSON dengan batas 16 KiB. Body
// kosong atau tanpa Content-Type JSON dibiarkan menjadi objek kosong, persis
// perilaku body-parser Express 4 yang menginisialisasi req.body = {}.
func readContactBody(w http.ResponseWriter, r *http.Request) (any, *apiError) {
	if !isJSONContentType(r.Header.Get("Content-Type")) {
		return map[string]any{}, nil
	}

	data, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxBodyBytes))
	if err != nil {
		var mbe *http.MaxBytesError
		if errors.As(err, &mbe) {
			return nil, newAPIError(http.StatusRequestEntityTooLarge, codeTooLarge)
		}
		return nil, newAPIError(http.StatusInternalServerError, codeServerError)
	}

	if len(data) == 0 {
		return map[string]any{}, nil
	}

	var v any
	if err := json.Unmarshal(data, &v); err != nil {
		return nil, newAPIError(http.StatusBadRequest, codeInvalidJSON)
	}
	return v, nil
}

func isJSONContentType(ct string) bool {
	mediaType, _, err := mime.ParseMediaType(ct)
	if err != nil {
		mediaType = strings.ToLower(strings.TrimSpace(strings.SplitN(ct, ";", 2)[0]))
	}
	return mediaType == "application/json" || strings.HasSuffix(mediaType, "+json")
}

// WriteConfigError dipakai api/*.go saat konfigurasi gagal dimuat. Pesan
// aslinya (nama variabel yang kurang) hanya ke log; klien dapat kode tetap.
func WriteConfigError(w http.ResponseWriter, err error) {
	log.Printf("%v", err)
	securityHeaders(w.Header())
	writeAPIError(w, newAPIError(http.StatusInternalServerError, codeServerError))
}
