package portfolio

import (
	"bytes"
	"crypto/tls"
	"mime"
	"net"
	"net/smtp"
	"strings"
	"time"
)

// sendContactEmail mengirim notifikasi kontak lewat Gmail SMTP (implicit TLS
// di port 465, sama seperti `service: 'gmail'` pada Nodemailer). Body sengaja
// teks polos: nilai datang dari luar, dan HTML yang menyisipkan nilai mentah
// adalah jalur masuk yang tidak perlu dibuka.
func sendContactEmail(cfg Config, in ContactInput) error {
	const host = "smtp.gmail.com"
	addr := host + ":465"

	conn, err := tls.DialWithDialer(
		&net.Dialer{Timeout: 15 * time.Second},
		"tcp",
		addr,
		&tls.Config{ServerName: host, MinVersion: tls.VersionTLS12},
	)
	if err != nil {
		return err
	}
	defer conn.Close()
	conn.SetDeadline(time.Now().Add(45 * time.Second))

	client, err := smtp.NewClient(conn, host)
	if err != nil {
		return err
	}
	defer client.Close()

	if err := client.Auth(smtp.PlainAuth("", cfg.EmailUser, cfg.EmailPassword, host)); err != nil {
		return err
	}
	if err := client.Mail(cfg.EmailUser); err != nil {
		return err
	}
	if err := client.Rcpt(cfg.EmailRecipient); err != nil {
		return err
	}

	w, err := client.Data()
	if err != nil {
		return err
	}
	if _, err := w.Write(buildMessage(cfg, in)); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}

	return client.Quit()
}

// buildMessage menyusun pesan SMTP. Nama/email/subjek sudah lolos validasi
// domain (tanpa CR/LF/NUL), jadi tidak ada header yang bisa disisipkan.
func buildMessage(cfg Config, in ContactInput) []byte {
	text := strings.Join([]string{
		"Pesan baru dari formulir kontak portofolio.",
		"",
		"Nama    : " + in.Name,
		"Email   : " + in.Email,
		"Subjek  : " + in.Subject,
		"",
		"Pesan:",
		in.Message,
	}, "\n")
	text = toCRLF(text)

	var b bytes.Buffer
	b.WriteString("From: " + cfg.EmailUser + "\r\n")
	b.WriteString("To: " + cfg.EmailRecipient + "\r\n")
	b.WriteString("Reply-To: " + in.Email + "\r\n")
	b.WriteString("Subject: " + mime.QEncoding.Encode("UTF-8", "[Portofolio] "+in.Subject) + "\r\n")
	b.WriteString("MIME-Version: 1.0\r\n")
	b.WriteString("Content-Type: text/plain; charset=UTF-8\r\n")
	b.WriteString("Content-Transfer-Encoding: 8bit\r\n")
	b.WriteString("\r\n")
	b.WriteString(text)
	return b.Bytes()
}

// toCRLF menormalkan semua gaya baris baru (LF, CRLF, CR) menjadi CRLF, karena
// itu yang diminta format pesan SMTP.
func toCRLF(s string) string {
	s = strings.ReplaceAll(s, "\r\n", "\n")
	s = strings.ReplaceAll(s, "\r", "\n")
	return strings.ReplaceAll(s, "\n", "\r\n")
}
