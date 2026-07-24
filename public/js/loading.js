/**
 * Utilitário de loading compartilhado por todas as páginas do painel.
 * Cria (se ainda não existir) um overlay fixo com spinner e expõe
 * window.Loading.show()/hide() e window.apiFetch() para chamadas à API
 * já tratando o overlay e erros de sessão.
 */
(function () {
    function garantirOverlay() {
      let overlay = document.getElementById('loading-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner"></div><span>Carregando...</span>';
        document.body.appendChild(overlay);
      }
      return overlay;
    }
  
    let contador = 0;
  
    function show() {
      contador += 1;
      garantirOverlay().classList.add('ativo');
    }
  
    function hide() {
      contador = Math.max(0, contador - 1);
      if (contador === 0) {
        garantirOverlay().classList.remove('ativo');
      }
    }
  
    /**
     * Wrapper de fetch para a API interna: mostra o loading, envia cookies de
     * sessão, converte a resposta em JSON e redireciona para o login em 401.
     */
    async function apiFetch(url, opcoes = {}) {
      show();
      try {
        const resposta = await fetch(url, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) },
          ...opcoes,
        });
  
        if (resposta.status === 401) {
          window.location.href = '/login.html';
          return Promise.reject(new Error('Sessão expirada.'));
        }
  
        const dados = await resposta.json().catch(() => ({}));
  
        if (!resposta.ok) {
          throw new Error(dados.erro || 'Ocorreu um erro ao falar com o servidor.');
        }
  
        return dados;
      } finally {
        hide();
      }
    }
  
    window.Loading = { show, hide };
    window.apiFetch = apiFetch;
  })();