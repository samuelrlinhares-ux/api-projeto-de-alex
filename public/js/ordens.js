document.addEventListener('DOMContentLoaded', async () => {
    await carregarUsuario();
    await carregarEstatisticas();
  
    document.getElementById('btn-logout').addEventListener('click', fazerLogout);
  });
  
  async function carregarUsuario() {
    try {
      const usuario = await window.apiFetch('/api/auth/me');
      document.getElementById('nome-usuario').textContent = usuario.nome;
    } catch (erro) {
      // apiFetch já redireciona para o login em caso de 401
    }
  }
  
  async function carregarEstatisticas() {
    try {
      const stats = await window.apiFetch('/api/ordens/stats');
  
      document.getElementById('valor-aberta').textContent = stats.porStatus.aberta;
      document.getElementById('valor-em-andamento').textContent = stats.porStatus.em_andamento;
      document.getElementById('valor-concluida').textContent = stats.porStatus.concluida;
      document.getElementById('valor-cancelada').textContent = stats.porStatus.cancelada;
  
      document.getElementById('valor-clientes').textContent = stats.totalClientes;
      document.getElementById('valor-veiculos').textContent = stats.totalVeiculos;
      document.getElementById('valor-faturamento').textContent = formatarMoeda(stats.faturamentoConcluidas);
    } catch (erro) {
      console.error(erro);
    }
  }
  
  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  async function fazerLogout() {
    try {
      await window.apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login.html';
    }
  }