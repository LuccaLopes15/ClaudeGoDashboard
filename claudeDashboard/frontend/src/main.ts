import './style.css';

import { GetClaudeStats, SelecionarArquivo } from '../wailsjs/go/main/App';
import { models } from '../wailsjs/go/models';

const totalInteracoesElem = document.getElementById('total-interacoes')!;
const totalSessoesElem = document.getElementById('total-sessoes')!;
const projetosAtivosElem = document.getElementById('repositorios-abertos')!;
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
        
    } catch (err) {
        console.error("Erro ao chamar o backend:", err);
    }
}

btnAtualizar.onclick = carregarDados;
btnSelecionar.onclick = escolherArquivo;

window.onload = () => {
    if (caminhoAtual != "") {
        displayCaminho.innerText = caminhoAtual;
        carregarDados();
    }
};