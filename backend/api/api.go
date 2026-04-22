package api

import (
	"claudeDashboard/parser"
	"encoding/json"
	"net/http"
)

func GetStatsHandler(w http.ResponseWriter, r *http.Request) {
	caminho := r.URL.Query().Get("path")

	if caminho == "" {
		http.Error(w, "O parâmetro 'path' é obrigatório", http.StatusBadRequest)
		return
	}

	data, msgErro := parser.ProcessarHistorico(caminho)

	if msgErro != "" {
		http.Error(w, msgErro, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(data)
}
