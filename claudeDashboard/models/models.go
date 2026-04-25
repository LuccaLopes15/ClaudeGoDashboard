package models

// LogEntry representa uma linha do arquivo history.jsonl
type LogEntry struct {
	Display   string `json:"display"`
	Timestamp int64  `json:"timestamp"`
	Project   string `json:"project"`
	SessionID string `json:"sessionId"`
}

type RepoRankingItem struct {
	Nome string `json:"nome"`
	Qtd  int    `json:"qtd"`
}

// DashboardData é o que enviaremos para o MAUI
type DashboardData struct {
	TotalSessoes    int               `json:"total_sessoes"`
	TotalInteracoes int               `json:"total_interacoes"`
	ProjetosAtivos  int               `json:"projetos_ativos"`
	UsoPorProjeto   map[string]int    `json:"uso_por_projeto"`
	TopRepositorios []RepoRankingItem `json:"top_repositorios"`
	UsoPorHora      map[int]int       `json:"uso_por_hora"`       // Ex: {9: 50, 10: 120...}
	UsoPorDiaSemana map[string]int    `json:"uso_por_dia_semana"` // Ex: {"Segunda": 300...}
	UsoMensal       map[string]int    `json:"uso_mensal"`         // Ex: {"Jan": 1500...}
	PeriodoInicio   string            `json:"periodo_inicio"`
	PeriodoFim      string            `json:"periodo_fim"`
}
