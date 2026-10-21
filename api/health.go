package handler

import (
	"net/http"

	"portofolio-aldi/pkg/portfolio"
)

// Health adalah Vercel Function untuk /api/health. Rutenya tetap /api/health
// karena Vercel meneruskan path aslinya; handler-nya mengabaikan path supaya
// tetap berfungsi kalau path pernah di-strip.
func Health(w http.ResponseWriter, r *http.Request) {
	app, err := portfolio.Default()
	if err != nil {
		portfolio.WriteConfigError(w, err)
		return
	}
	app.Health(w, r)
}
