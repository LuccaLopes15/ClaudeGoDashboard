package main

import (
	"claudeDashboard/models"
	"claudeDashboard/parser"
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetClaudeStats(path string) models.DashboardData {
	data, _ := parser.ProcessarHistorico(path)
	return data
}

func (a *App) SelecionarArquivo() string {
	caminho, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Selecione o histórico do Claude (history.jsonl)",
		Filters: []runtime.FileFilter{
			{DisplayName: "Arquivos JSONL (*.jsonl)", Pattern: "*.jsonl"},
			{DisplayName: "Todos os arquivos (*.*)", Pattern: "*.*"},
		},
	})

	if err != nil {
		return ""
	}

	return caminho
}
