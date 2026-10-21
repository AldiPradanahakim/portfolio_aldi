package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"portofolio-aldi/pkg/portfolio"
)

// Hanya dipakai saat dijalankan lokal. Di Vercel, api/*.go yang memanggil
// paket ini — tidak ada port yang dibuka di sana.
func main() {
	cfg, err := portfolio.LoadConfig()
	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(1)
	}

	app := portfolio.New(cfg)

	log.Printf("Backend API berjalan di http://localhost:%d", cfg.Port)
	log.Printf("   GET  /health  (dan /api/health)")
	log.Printf("   POST /api/contact")

	srv := &http.Server{
		Addr:              ":" + strconv.Itoa(cfg.Port),
		Handler:           app,
		ReadHeaderTimeout: 10 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
