package parser

import (
	"bufio"
	"claudeDashboard/models"
	"claudeDashboard/troubleshooting"
	"encoding/json"
	"os"
	"sort"
	"time"
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

	stats.UsoPorHora = make(map[int]int)
	stats.UsoPorDiaSemana = make(map[string]int)
	stats.UsoMensal = make(map[string]int)

	diasSemana := []string{"Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"}

	var primeiroTS, ultimoTS int64

	scanner := bufio.NewScanner(arquivo)
	for scanner.Scan() {
		var entrada models.LogEntry
		// Transforma a linha JSON na nossa Struct
		if err := json.Unmarshal(scanner.Bytes(), &entrada); err != nil {
			continue // Pula linhas malformadas
		}

		if primeiroTS == 0 || entrada.Timestamp < primeiroTS {
			primeiroTS = entrada.Timestamp
		}

		if entrada.Timestamp > ultimoTS {
			ultimoTS = entrada.Timestamp
		}

		t := time.Unix(entrada.Timestamp/1000, 0)

		stats.UsoPorHora[t.Hour()]++

		nomeDia := diasSemana[t.Weekday()]
		stats.UsoPorDiaSemana[nomeDia]++

		mesChave := t.Format("2006-01")
		stats.UsoMensal[mesChave]++

		stats.TotalInteracoes++
		sessoesUnicas[entrada.SessionID] = true

		nomeRepo := entrada.Project
		if nomeRepo == "" {
			nomeRepo = "Chat Direto (Sem Projeto)"
		}
		stats.UsoPorProjeto[nomeRepo]++

		stats.PeriodoInicio = time.Unix(primeiroTS/1000, 0).Format("02/01/2006")
		stats.PeriodoFim = time.Unix(ultimoTS/1000, 0).Format("02/01/2006")
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
	stats.TopRepositorios = MontarRankingTop5Repos(stats.UsoPorProjeto)

	return stats, ""
}

func MontarRankingTop5Repos(usoPorProjeto map[string]int) []models.RepoRankingItem {
	var lista []models.RepoRankingItem

	for nome, qtd := range usoPorProjeto {
		lista = append(lista, models.RepoRankingItem{Nome: nome, Qtd: qtd})
	}

	sort.Slice(lista, func(i, j int) bool {
		return lista[i].Qtd > lista[j].Qtd
	})

	var top5 []models.RepoRankingItem
	for i := 0; i < len(lista) && i < 5; i++ {
		top5 = append(top5, lista[i])
	}
	return top5
}
