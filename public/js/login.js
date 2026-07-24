document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');
    const caixaErro = document.getElementById('erro-login');
  
    // Se já existe uma sessão válida, pula direto pro dashboard
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => { if (res.ok) window.location.href = '/dashboard.html'; })
      .catch(() => {});
  
    form.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      caixaErro.style.display = 'none';
  
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value;
  
      try {
        await window.apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha }),
        });
        window.location.href = '/dashboard.html';
      } catch (erro) {
        caixaErro.textContent = erro.message;
        caixaErro.style.display = 'block';
      }
    });
  });