package portfolio

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Config memuat seluruh setelan dari variabel lingkungan.
type Config struct {
	Port           int
	EmailUser      string
	EmailPassword  string
	EmailRecipient string
}

// LoadDotEnv membaca berkas KEY=VALUE dan menyetel variabel yang belum ada di
// proses. Berkas yang hilang diabaikan diam-diam — di Vercel nilainya datang
// dari Environment Variables dashboard, bukan dari berkas.
func LoadDotEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()

	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		line = strings.TrimPrefix(line, "export ")
		key, val, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}
		// Perilaku dotenv: variabel yang sudah diset di proses menang.
		if _, exists := os.LookupEnv(key); exists {
			continue
		}
		val = strings.TrimSpace(val)
		if len(val) >= 2 && ((val[0] == '"' && val[len(val)-1] == '"') || (val[0] == '\'' && val[len(val)-1] == '\'')) {
			val = val[1 : len(val)-1]
		}
		os.Setenv(key, val)
	}
}

// LoadConfig membaca konfigurasi dan langsung memvalidasinya. Kalau ada yang
// kurang, mengembalikan error dengan pesan yang jelas — bukan meledak saat
// request pertama masuk dan baru ketahuan dari log produksi.
func LoadConfig() (Config, error) {
	LoadDotEnv(".env")

	port := 3001
	if p, err := strconv.Atoi(strings.TrimSpace(os.Getenv("PORT"))); err == nil && p > 0 {
		port = p
	}

	var missing []string

	user := strings.TrimSpace(os.Getenv("EMAIL_USER"))
	if user == "" {
		missing = append(missing, "EMAIL_USER")
	}

	// App Password Gmail — jangan pernah dicetak ke log atau dikirim ke klien.
	password := os.Getenv("EMAIL_PASSWORD")
	if strings.TrimSpace(password) == "" {
		missing = append(missing, "EMAIL_PASSWORD")
		password = ""
	}

	recipient := strings.TrimSpace(os.Getenv("EMAIL_RECIPIENT"))
	if recipient == "" {
		recipient = user
	}

	if len(missing) > 0 {
		return Config{}, fmt.Errorf(
			"[config] Variabel lingkungan berikut belum diisi: %s.\n"+
				"[config] Salin .env.example menjadi .env lalu isi nilainya.\n"+
				"[config] EMAIL_PASSWORD untuk Gmail adalah App Password 16 karakter, bukan kata sandi akun.",
			strings.Join(missing, ", "),
		)
	}

	return Config{
		Port:           port,
		EmailUser:      user,
		EmailPassword:  password,
		EmailRecipient: recipient,
	}, nil
}
