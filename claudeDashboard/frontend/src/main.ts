import './style.css';

import { GetClaudeStats, SelecionarArquivo } from '../wailsjs/go/main/App';
import { models } from '../wailsjs/go/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const totalInteracoesElem = document.getElementById('total-interacoes')!;
const totalSessoesElem = document.getElementById('total-sessoes')!;
const projetosAtivosElem = document.getElementById('repositorios-abertos')!;

const container = document.getElementById('repos-container')!;
const periodoElem = document.getElementById('periodo-exibido')!;

const ctxHoras = (document.getElementById('chartHoras') as HTMLCanvasElement).getContext('2d')!;
const ctxSemana = (document.getElementById('chartSemana') as HTMLCanvasElement).getContext('2d')!;
const ctxMensal = (document.getElementById('chartMensal') as HTMLCanvasElement).getContext('2d')!;

const btnAtualizar = document.getElementById('btn-atualizar')!;
const btnSelecionar = document.getElementById('btn-selecionar')!;

const displayCaminho = document.getElementById('caminho-exibido')!;

let caminhoAtual = localStorage.getItem("ultimoCaminho") || "";

let chartHoras: Chart | null = null;
let chartSemana: Chart | null = null;
let chartMensal: Chart | null = null;

async function escolherArquivo() {
    const caminho = await SelecionarArquivo();
    if (caminho) {
        caminhoAtual = caminho;
        displayCaminho.innerText = caminho;
        localStorage.setItem("ultimoCaminho", caminho);
        carregarDados(); 
    }
}

async function carregarDados() {
    if(!caminhoAtual)
    {
        escolherArquivo();
    }
    
    try {
        const stats: models.DashboardData = await GetClaudeStats(caminhoAtual);
        
        totalInteracoesElem.innerText = stats.total_interacoes.toString();
        totalSessoesElem.innerText = stats.total_sessoes.toString();
        projetosAtivosElem.innerText = stats.projetos_ativos.toString();

        renderizarTopRepositorios(stats.top_repositorios);
        renderizarGraficos(stats)

        periodoElem.innerText = `Análise de ${stats.periodo_inicio} até ${stats.periodo_fim}`;
    } catch (err) {
        console.error("Erro ao chamar o backend:", err);
    }
}

function renderizarTopRepositorios(topRepos: models.RepoRankingItem[]) {
    container.innerHTML = ""; // Limpa a lista atual

    if (!topRepos || topRepos.length === 0) return;
    
    const maiorValor = topRepos[0].qtd;

    topRepos.forEach((item) => {
        const percentual = (item.qtd / maiorValor) * 100;
        
        const itemHtml = `
            <div class="repo-item" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.85rem;">
                    <span style="color: var(--text-main); font-weight: bold;">${item.nome}</span>
                    <span style="color: var(--accent-color);">${item.qtd} interações</span>
                </div>
                <div style="background: #373a40; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: var(--accent-color); width: ${percentual}%; height: 100%; transition: width 0.5s ease-out;"></div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });
} 

function renderizarGraficos(stats: models.DashboardData) {
    renderizarGraficoDiario(stats.uso_por_hora || {});    

    renderizarGraficoSemana(stats.uso_por_dia_semana || {});

    renderizarGraficoMensal(stats.uso_mensal || {});
}

function renderizarGraficoDiario(usoPorHora: { [key: number]: number }) {
    
    // Preenche as 24 horas (mesmo as que estão zeradas no map)
    const labelsHoras = Array.from({ length: 24 }, (_, i) => `${i}h`);
    const dadosHoras = Array.from({ length: 24 }, (_, i) => usoPorHora[i] || 0);

    if (chartHoras) chartHoras.destroy(); // Destrói o anterior se houver
    chartHoras = new Chart(ctxHoras, {
        type: 'line',
        data: {
            labels: labelsHoras,
            datasets: [{
                label: 'Interações',
                data: dadosHoras,
                borderColor: '#748ffc',
                backgroundColor: 'rgba(116, 143, 252, 0.2)',
                fill: true,
                tension: 0.4 // Deixa a linha curvada (suave)
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderizarGraficoSemana(usoPorDiaSemana: { [key: string]: number } ) {
    
    // Definimos a ordem para garantir que comece na Segunda
    const ordemDias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    const dadosSemana = ordemDias.map(dia => usoPorDiaSemana[dia] || 0);

    if (chartSemana) chartSemana.destroy();
    chartSemana = new Chart(ctxSemana, {
        type: 'bar', // Barras funcionam bem aqui para comparar os dias
        data: {
            labels: ordemDias,
            datasets: [{
                label: 'Interações',
                data: dadosSemana,
                backgroundColor: 'rgba(116, 143, 252, 0.7)',
                borderColor: '#748ffc',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Total: ${context.parsed.y} interações`;
                        }
                    }
                }
            }
        }
    });
}

function renderizarGraficoMensal(usoPorMes: { [key: string]: number } ) {
    // Ordena as chaves do mês (2024-01, 2024-02...)
    const mesesOrdenados = Object.keys(usoPorMes).sort();
    const dadosMensais = mesesOrdenados.map(mes => usoPorMes[mes]);

    if (chartMensal) chartMensal.destroy();
    chartMensal = new Chart(ctxMensal, {
        type: 'bar',
        data: {
            labels: mesesOrdenados,
            datasets: [{
                label: 'Interações por Mês',
                data: dadosMensais,
                backgroundColor: '#748ffc',
                borderRadius: 5
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

btnAtualizar.onclick = carregarDados;
btnSelecionar.onclick = escolherArquivo;

window.onload = () => {
    if (caminhoAtual != "") {
        displayCaminho.innerText = caminhoAtual;
        carregarDados();
    }
};