package portfolio

import (
	"regexp"
	"strings"
	"unicode"
	"unicode/utf16"
)

// ContactInput adalah pesan yang sudah lolos validasi dan siap dikirim.
type ContactInput struct {
	Name    string
	Email   string
	Subject string
	Message string
}

const (
	codeInvalidJSON     = "INVALID_JSON"
	codeTooLarge        = "TOO_LARGE"
	codeNotFound        = "NOT_FOUND"
	codeRateLimited     = "RATE_LIMITED"
	codeServerError     = "SERVER_ERROR"
	codeInvalidBody     = "INVALID_BODY"
	codeMissingFields   = "MISSING_FIELDS"
	codeNewlineInHeader = "NEWLINE_IN_HEADER"
	codeNameLength      = "NAME_LENGTH"
	codeEmailInvalid    = "EMAIL_INVALID"
	codeSubjectLength   = "SUBJECT_LENGTH"
	codeMessageLength   = "MESSAGE_LENGTH"
)

// contactErrors adalah satu-satunya tempat kode dan pesan manusianya
// dideklarasikan berdampingan. Kode stabil dipakai frontend; pesan berbahasa
// Indonesia hanya untuk curl/log/developer dan tidak pernah memuat masukan
// pengguna.
var contactErrors = map[string]string{
	codeInvalidJSON:     "Isi permintaan bukan JSON yang valid.",
	codeTooLarge:        "Isi permintaan terlalu besar.",
	codeNotFound:        "Endpoint tidak ditemukan.",
	codeRateLimited:     "Terlalu banyak pesan dari koneksi ini. Coba lagi beberapa menit lagi.",
	codeServerError:     "Terjadi kesalahan di server. Coba lagi sebentar lagi.",
	codeInvalidBody:     "Format permintaan tidak dikenali.",
	codeMissingFields:   "Nama, email, subjek, dan pesan wajib diisi.",
	codeNewlineInHeader: "Nama, email, dan subjek tidak boleh memuat baris baru.",
	codeNameLength:      "Nama harus 2-80 karakter.",
	codeEmailInvalid:    "Alamat email tidak valid.",
	codeSubjectLength:   "Subjek harus 3-120 karakter.",
	codeMessageLength:   "Pesan harus 10-2000 karakter.",
}

// apiError membawa status HTTP dan kode API untuk sebuah respons gagal.
type apiError struct {
	status int
	code   string
}

func (e *apiError) Error() string { return e.code }

func newAPIError(status int, code string) *apiError {
	return &apiError{status: status, code: code}
}

const (
	nameMin    = 2
	nameMax    = 80
	emailMax   = 254
	subjectMin = 3
	subjectMax = 120
	messageMin = 10
	messageMax = 2000
)

// Format email yang cukup ketat untuk formulir kontak, tanpa menolak alamat
// sah. \s di RE2 hanya ASCII, jadi ruang unicode ditambahkan lewat \p{Z} dan
// \v, dan FEFF disertakan agar sejajar dengan \s JavaScript.
var emailPattern = regexp.MustCompile(`^[^\s\v\p{Z}\x{FEFF}@,;:<>()\[\]\\]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$`)

// jsLen menghitung panjang seperti JavaScript `.length`: UTF-16 code unit,
// bukan byte dan bukan rune.
func jsLen(s string) int {
	return len(utf16.Encode([]rune(s)))
}

// jsTrim memangkas whitespace seperti JavaScript `String.prototype.trim`,
// termasuk U+FEFF yang tidak dihapus strings.TrimSpace.
func jsTrim(s string) string {
	return strings.TrimFunc(s, func(r rune) bool {
		return unicode.IsSpace(r) || r == '\uFEFF'
	})
}

// validateContact menjalankan aturan panjang dan pembersihan karakter di satu
// tempat, persis seperti versi TypeScript-nya. `v` adalah hasil
// json.Unmarshal.
func validateContact(v any) (ContactInput, *apiError) {
	obj, ok := v.(map[string]any)
	if !ok {
		return ContactInput{}, newAPIError(400, codeInvalidBody)
	}

	name, ok1 := obj["name"].(string)
	email, ok2 := obj["email"].(string)
	subject, ok3 := obj["subject"].(string)
	message, ok4 := obj["message"].(string)
	if !ok1 || !ok2 || !ok3 || !ok4 {
		return ContactInput{}, newAPIError(400, codeMissingFields)
	}

	name = jsTrim(name)
	email = jsTrim(email)
	subject = jsTrim(subject)
	message = jsTrim(message)

	// Header injection: nilai ini ikut menyusun header email.
	if strings.ContainsAny(name, "\r\n\x00") ||
		strings.ContainsAny(email, "\r\n\x00") ||
		strings.ContainsAny(subject, "\r\n\x00") {
		return ContactInput{}, newAPIError(400, codeNewlineInHeader)
	}

	if jsLen(name) < nameMin || jsLen(name) > nameMax {
		return ContactInput{}, newAPIError(400, codeNameLength)
	}

	if jsLen(email) > emailMax || !emailPattern.MatchString(email) {
		return ContactInput{}, newAPIError(400, codeEmailInvalid)
	}

	if jsLen(subject) < subjectMin || jsLen(subject) > subjectMax {
		return ContactInput{}, newAPIError(400, codeSubjectLength)
	}

	cleanMessage := stripOtherControlChars(message)

	if jsLen(cleanMessage) < messageMin || jsLen(cleanMessage) > messageMax {
		return ContactInput{}, newAPIError(400, codeMessageLength)
	}

	return ContactInput{Name: name, Email: email, Subject: subject, Message: cleanMessage}, nil
}

// stripOtherControlChars membuang karakter kontrol selain TAB/LF/CR, persis
// `OTHER_CONTROL_CHARS` versi TypeScript.
func stripOtherControlChars(s string) string {
	return strings.Map(func(r rune) rune {
		switch {
		case r == 0x09 || r == 0x0A || r == 0x0D:
			return r
		case r >= 0x00 && r <= 0x08, r == 0x0B, r == 0x0C, r >= 0x0E && r <= 0x1F, r == 0x7F:
			return -1
		default:
			return r
		}
	}, s)
}
