package models

// LogEntry representa uma linha do arquivo history.jsonl
type LogEntry struct {
	Display   string `json:"display"`
	Timestamp int64  `json:"timestamp"`
	Project   string `json:"project"`
	SessionID string `json:"sessionId"`
}

// DashboardData é o que enviaremos para o MAUI
type DashboardData struct {
	TotalSessoes    int            `json:"total_sessoes"`
	TotalInteracoes int            `json:"total_interacoes"`
	ProjetosAtivos  int            `json:"projetos_ativos"`
	UsoPorProjeto   map[string]int `json:"uso_por_projeto"`
}
