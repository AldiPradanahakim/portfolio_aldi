package handler

import (
	"net/http"

	"portofolio-aldi/pkg/portfolio"
)

// Contact adalah Vercel Function untuk /api/contact.
func Contact(w http.ResponseWriter, r *http.Request) {
	app, err := portfolio.Default()
	if err != nil {
		portfolio.WriteConfigError(w, err)
		return
	}
	app.Contact(w, r)
}
