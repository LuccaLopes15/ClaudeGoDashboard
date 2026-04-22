package parser

import (
	"bufio"
	"claudeDashboard/models"
	"claudeDashboard/troubleshooting"
	"encoding/json"
	"os"
)

func ProcessarHistorico(caminho string) (historicoProcessado models.DashboardData, mensagemErro string) {
	arquivo, err := os.Open(caminho)

	deuErro, mensagemErro := troubleshooting.GerouErro(err, "Ocorreu um erro ao abrir arquivo de histórico")

	if deuErro {
		return models.DashboardData{}, mensagemErro
	}

	defer arquivo.Close()

	var stats models.DashboardData
	stats.UsoPorProjeto = make(map[string]int)
	sessoesUnicas := make(map[string]bool)

	scanner := bufio.NewScanner(arquivo)
	for scanner.Scan() {
		var entrada models.LogEntry
		// Transforma a linha JSON na nossa Struct
		if err := json.Unmarshal(scanner.Bytes(), &entrada); err != nil {
			continue // Pula linhas malformadas
		}

		// Lógica de contagem
		stats.TotalInteracoes++
		sessoesUnicas[entrada.SessionID] = true
		stats.UsoPorProjeto[entrada.Project]++
	}

	// Verifique erros do scanner após o loop
	if err := scanner.Err(); err != nil {
		deuErro, msg := troubleshooting.GerouErro(err, "Erro durante a leitura das linhas do histórico")
		if deuErro {
			return models.DashboardData{}, msg
		}
	}

	stats.TotalSessoes = len(sessoesUnicas)
	stats.ProjetosAtivos = len(stats.UsoPorProjeto)

	return stats, ""
}
