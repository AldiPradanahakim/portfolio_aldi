package portfolio

import (
	"math"
	"net"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"
)

// securityHeaders menulis header keamanan dasar ke setiap respons.
func securityHeaders(h http.Header) {
	h.Set("X-Content-Type-Options", "nosniff")
	h.Set("X-Frame-Options", "DENY")
	h.Set("Referrer-Policy", "no-referrer")
	h.Set("Cross-Origin-Opener-Policy", "same-origin")
}

// allowedOriginRe mengizinkan hanya asal lokal HTTP — produksi berbagi origin
// dengan frontend sehingga tidak butuh CORS sama sekali.
var allowedOriginRe = regexp.MustCompile(`^http://(localhost|127\.0\.0\.1)(:\d+)?$`)

// applyCORS menulis header CORS kalau Origin diizinkan. Vary selalu diset
// karena kebijakannya dinamis.
func applyCORS(h http.Header, r *http.Request) {
	origin := r.Header.Get("Origin")
	h.Add("Vary", "Origin")
	if origin != "" && allowedOriginRe.MatchString(origin) {
		h.Set("Access-Control-Allow-Origin", origin)
	}
}

// handlePreflight menjawab permintaan OPTIONS.
func handlePreflight(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
	if reqHeaders := r.Header.Get("Access-Control-Request-Headers"); reqHeaders != "" {
		w.Header().Set("Access-Control-Allow-Headers", reqHeaders)
	}
	w.WriteHeader(http.StatusNoContent)
}

// clientIP mengembalikan alamat pengunjung. Di belakang Vercel (VERCEL diset)
// tepat satu hop dipercaya, jadi alamat diambil dari entri paling kanan
// X-Forwarded-For; di luar itu header yang bisa dipalsukan klien tidak
// dipercaya.
func clientIP(r *http.Request) string {
	if os.Getenv("VERCEL") != "" {
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			parts := strings.Split(xff, ",")
			if ip := strings.TrimSpace(parts[len(parts)-1]); ip != "" {
				return ip
			}
		}
	}
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return host
	}
	return r.RemoteAddr
}

const (
	rateWindow   = 10 * time.Minute
	rateMaxReq   = 5
	rateMaxTrack = 5000
)

type ipHits struct {
	times []time.Time
	last  time.Time
}

// rateLimiter adalah pembatas laju per IP, disimpan di memori proses. Peta
// pelacakan berbatas keras, jadi tidak bisa dipakai menghabiskan memori.
type rateLimiter struct {
	mu   sync.Mutex
	hits map[string]*ipHits
}

func newRateLimiter() *rateLimiter {
	return &rateLimiter{hits: make(map[string]*ipHits)}
}

// allow mengembalikan true dan 0 kalau request boleh lanjut, atau false dan
// jumlah detik Retry-After kalau dibatasi.
func (l *rateLimiter) allow(ip string) (bool, int) {
	now := time.Now()
	l.mu.Lock()
	defer l.mu.Unlock()

	e := l.hits[ip]
	if e != nil {
		cutoff := now.Add(-rateWindow)
		i := 0
		for i < len(e.times) && !e.times[i].After(cutoff) {
			i++
		}
		e.times = e.times[i:]
	}

	if e != nil && len(e.times) >= rateMaxReq {
		retry := int(math.Ceil((rateWindow - now.Sub(e.times[0])).Seconds()))
		if retry < 1 {
			retry = 1
		}
		return false, retry
	}

	if e == nil {
		// Batas keras: buang entri paling lama tidak aktif dulu.
		if len(l.hits) >= rateMaxTrack {
			l.evictOldestLocked()
		}
		e = &ipHits{}
		l.hits[ip] = e
	}

	e.times = append(e.times, now)
	e.last = now
	return true, 0
}

func (l *rateLimiter) evictOldestLocked() {
	var oldestIP string
	var oldest time.Time
	for ip, e := range l.hits {
		if oldestIP == "" || e.last.Before(oldest) {
			oldestIP = ip
			oldest = e.last
		}
	}
	if oldestIP != "" {
		delete(l.hits, oldestIP)
	}
}
