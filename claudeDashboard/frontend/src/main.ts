import './style.css';

import { GetClaudeStats, SelecionarArquivo } from '../wailsjs/go/main/App';
import { models } from '../wailsjs/go/models';

const totalInteracoesElem = document.getElementById('total-interacoes')!;
const totalSessoesElem = document.getElementById('total-sessoes')!;
const projetosAtivosElem = document.getElementById('repositorios-abertos')!;

const container = document.getElementById('repos-container')!;


const btnAtualizar = document.getElementById('btn-atualizar')!;
const btnSelecionar = document.getElementById('btn-selecionar')!;

const displayCaminho = document.getElementById('caminho-exibido')!;

let caminhoAtual = localStorage.getItem("ultimoCaminho") || "";

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

btnAtualizar.onclick = carregarDados;
btnSelecionar.onclick = escolherArquivo;

window.onload = () => {
    if (caminhoAtual != "") {
        displayCaminho.innerText = caminhoAtual;
        carregarDados();
    }
};