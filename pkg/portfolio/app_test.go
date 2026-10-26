package portfolio

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

const validContactJSON = `{"name":"  Aldi  ","email":" aldi@example.com ","subject":" Halo ","message":" Pesan yang cukup panjang untuk lolos. "}`

// newTestApp menyiapkan App dengan pengirim palsu, jadi pengujian tidak
// menyentuh SMTP. Setiap pemanggilan mendapat limiter baru.
func newTestApp(t *testing.T, sendErr error) (*App, *[]ContactInput) {
	t.Helper()

	app := New(Config{EmailUser: "pengirim@example.com", EmailRecipient: "penerima@example.com"})
	var calls []ContactInput
	app.send = func(in ContactInput) error {
		calls = append(calls, in)
		return sendErr
	}
	return app, &calls
}

// callContact memanggil handler persis seperti api/contact.go.
func callContact(t *testing.T, app *App, method, body string) *httptest.ResponseRecorder {
	t.Helper()

	req := httptest.NewRequest(method, "/api/contact", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	app.Contact(w, req)
	return w
}

func decodeCode(t *testing.T, body string) string {
	t.Helper()

	var resp struct {
		Success bool   `json:"success"`
		Code    string `json:"code"`
	}
	if err := json.Unmarshal([]byte(body), &resp); err != nil {
		t.Fatalf("respons bukan JSON: %v (body=%q)", err, body)
	}
	return resp.Code
}

func TestAppContactHoneypot(t *testing.T) {
	app, calls := newTestApp(t, nil)
	w := callContact(t, app, http.MethodPost, `{"honeypot":"bot"}`)

	if w.Code != http.StatusOK {
		t.Fatalf("status=%d, want 200 (body=%s)", w.Code, w.Body)
	}
	if got := strings.TrimSpace(w.Body.String()); got != `{"success":true}` {
		t.Errorf("body=%q, want {\"success\":true}", got)
	}
	if len(*calls) != 0 {
		t.Errorf("send dipanggil %d kali, padahal honeypot tidak boleh mengirim", len(*calls))
	}
}

func TestAppContactValid(t *testing.T) {
	app, calls := newTestApp(t, nil)
	w := callContact(t, app, http.MethodPost, validContactJSON)

	if w.Code != http.StatusOK {
		t.Fatalf("status=%d, want 200 (body=%s)", w.Code, w.Body)
	}
	if got := strings.TrimSpace(w.Body.String()); got != `{"success":true}` {
		t.Errorf("body=%q, want {\"success\":true}", got)
	}
	if ct := w.Header().Get("Content-Type"); !strings.HasPrefix(ct, "application/json") {
		t.Errorf("Content-Type=%q, want application/json", ct)
	}
	if got := w.Header().Get("X-Content-Type-Options"); got != "nosniff" {
		t.Errorf("X-Content-Type-Options=%q, want nosniff", got)
	}

	want := ContactInput{
		Name:    "Aldi",
		Email:   "aldi@example.com",
		Subject: "Halo",
		Message: "Pesan yang cukup panjang untuk lolos.",
	}
	if len(*calls) != 1 {
		t.Fatalf("send dipanggil %d kali, want 1", len(*calls))
	}
	if got := (*calls)[0]; got != want {
		t.Errorf("ContactInput=%+v, want %+v", got, want)
	}
}

func TestAppContactErrors(t *testing.T) {
	cases := []struct {
		name       string
		method     string
		body       string
		wantStatus int
		wantCode   string
	}{
		{"JSON rusak", http.MethodPost, "{", http.StatusBadRequest, codeInvalidJSON},
		{"body melebihi 16 KiB", http.MethodPost, strings.Repeat("a", 17*1024), http.StatusRequestEntityTooLarge, codeTooLarge},
		{"metode GET", http.MethodGet, "", http.StatusNotFound, codeNotFound},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			app, calls := newTestApp(t, nil)
			w := callContact(t, app, c.method, c.body)

			if w.Code != c.wantStatus {
				t.Fatalf("status=%d, want %d (body=%s)", w.Code, c.wantStatus, w.Body)
			}
			if got := decodeCode(t, w.Body.String()); got != c.wantCode {
				t.Errorf("code=%q, want %q", got, c.wantCode)
			}
			if len(*calls) != 0 {
				t.Errorf("send dipanggil %d kali pada respons gagal", len(*calls))
			}
		})
	}
}

func TestAppContactRateLimit(t *testing.T) {
	app, calls := newTestApp(t, nil)
	const body = `{"honeypot":"bot"}`

	for i := 0; i < rateMaxReq; i++ {
		if w := callContact(t, app, http.MethodPost, body); w.Code != http.StatusOK {
			t.Fatalf("request ke-%d: status=%d, want 200 (body=%s)", i+1, w.Code, w.Body)
		}
	}

	w := callContact(t, app, http.MethodPost, body)
	if w.Code != http.StatusTooManyRequests {
		t.Fatalf("request ke-%d: status=%d, want 429 (body=%s)", rateMaxReq+1, w.Code, w.Body)
	}
	if got := decodeCode(t, w.Body.String()); got != codeRateLimited {
		t.Errorf("code=%q, want %q", got, codeRateLimited)
	}
	if retry := w.Header().Get("Retry-After"); retry == "" {
		t.Errorf("header Retry-After kosong")
	}
	if len(*calls) != 0 {
		t.Errorf("send dipanggil %d kali, padahal semua request honeypot", len(*calls))
	}
}

func TestAppContactSendError(t *testing.T) {
	const sentinel = "kredensial SMTP ditolak"
	app, calls := newTestApp(t, errors.New(sentinel))
	w := callContact(t, app, http.MethodPost, validContactJSON)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status=%d, want 500 (body=%s)", w.Code, w.Body)
	}
	if got := decodeCode(t, w.Body.String()); got != codeServerError {
		t.Errorf("code=%q, want %q", got, codeServerError)
	}
	if strings.Contains(w.Body.String(), sentinel) {
		t.Errorf("body membocorkan galat asli: %s", w.Body)
	}
	if len(*calls) != 1 {
		t.Errorf("send dipanggil %d kali, want 1", len(*calls))
	}
}
