package main

import (
	"claudeDashboard/api"
	"claudeDashboard/troubleshooting"
	"log"
	"net/http"
)

func main() {
	err := troubleshooting.InitLogger()

	if err != nil {
		log.Fatalf("Erro crítico: não foi possível iniciar o arquivo de log: %v", err)
	}

	http.HandleFunc("/api/stats", api.GetStatsHandler)

	log.Println("Servidor iniciado na porta :8080...")

	err = http.ListenAndServe(":8080", nil)

	troubleshooting.GerouErro(err, "Falha ao iniciar o servidor HTTP")
}
