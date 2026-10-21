package portfolio

import (
	"strings"
	"testing"
)

func TestValidateContact(t *testing.T) {
	valid := map[string]any{
		"name":    "Aldi",
		"email":   "aldi@example.com",
		"subject": "Halo",
		"message": "Pesan yang cukup panjang untuk lolos.",
	}

	got, err := validateContact(valid)
	if err != nil {
		t.Fatalf("valid body ditolak: %v", err)
	}
	if got.Name != "Aldi" || got.Message != "Pesan yang cukup panjang untuk lolos." {
		t.Fatalf("nilai tidak ternormalisasi: %+v", got)
	}

	// Kontrol karakter (selain TAB/LF/CR) dibuang dari pesan.
	stripped, err := validateContact(map[string]any{
		"name":    "Aldi",
		"email":   "aldi@example.com",
		"subject": "Halo",
		"message": "Pesan\x01 dengan kontrol\u0007 cukup panjang",
	})
	if err != nil || strings.ContainsAny(stripped.Message, "\x01\u0007") {
		t.Fatalf("kontrol karakter tidak dibuang: %+v err=%v", stripped, err)
	}

	cases := []struct {
		name string
		body any
		code string
	}{
		{"non-object", []any{}, codeInvalidBody},
		{"missing fields", map[string]any{}, codeMissingFields},
		{"wrong type", map[string]any{"name": 1, "email": "a@b.co", "subject": "x", "message": "xxxxxxxxxx"}, codeMissingFields},
		{"newline in name", map[string]any{"name": "A\nB", "email": "a@b.co", "subject": "x", "message": "xxxxxxxxxx"}, codeNewlineInHeader},
		{"name too short", map[string]any{"name": "A", "email": "a@b.co", "subject": "x", "message": "xxxxxxxxxx"}, codeNameLength},
		{"bad email", map[string]any{"name": "Aldi", "email": "not-an-email", "subject": "x", "message": "xxxxxxxxxx"}, codeEmailInvalid},
		{"subject too short", map[string]any{"name": "Aldi", "email": "a@b.co", "subject": "x", "message": "xxxxxxxxxx"}, codeSubjectLength},
		{"message too short", map[string]any{"name": "Aldi", "email": "a@b.co", "subject": "xyz", "message": "pendek"}, codeMessageLength},
	}

	for _, c := range cases {
		_, err := validateContact(c.body)
		if err == nil || err.code != c.code {
			t.Errorf("%s: kode=%v (want %s)", c.name, err, c.code)
		}
	}
}

func TestBuildMessage(t *testing.T) {
	cfg := Config{
		EmailUser:      "pengirim@example.com",
		EmailRecipient: "penerima@example.com",
	}
	msg := string(buildMessage(cfg, ContactInput{
		Name:    "Aldi",
		Email:   "aldi@example.com",
		Subject: "Halo ✓",
		Message: "baris satu\nbaris dua",
	}))

	for _, want := range []string{
		"From: pengirim@example.com\r\n",
		"To: penerima@example.com\r\n",
		"Reply-To: aldi@example.com\r\n",
		"Subject: =?UTF-8?q?",
		"Content-Type: text/plain; charset=UTF-8\r\n",
		"Content-Transfer-Encoding: 8bit\r\n",
		"\r\n\r\nPesan baru dari formulir kontak portofolio.\r\n",
		"Nama    : Aldi\r\n",
		"baris satu\r\nbaris dua",
	} {
		if !strings.Contains(msg, want) {
			t.Errorf("pesan tidak memuat %q\n---\n%s", want, msg)
		}
	}

	if strings.Contains(strings.ToLower(msg), "<html") {
		t.Errorf("pesan memuat HTML, padahal harus teks polos")
	}
}
