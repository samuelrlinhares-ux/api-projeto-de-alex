let clienteEmEdicaoId = null;

document.addEventListener('DOMContentLoaded', () => {
  carregarUsuario();
  carregarClientes();

  document.getElementById('btn-logout').addEventListener('click', fazerLogout);
  document.getElementById('btn-novo-cliente').addEventListener('click', () => abrirModal());
  document.getElementById('busca-cliente').addEventListener('input', debounce((e) => carregarClientes(e.target.value), 300));

  document.getElementById('form-cliente').addEventListener('submit', salvarCliente);
  document.getElementById('btn-cancelar-modal').addEventListener('click', fecharModal);
});

async function carregarUsuario() {
  try {
    const usuario = await window.apiFetch('/api/auth/me');
    document.getElementById('nome-usuario').textContent = usuario.nome;
  } catch (erro) {}
}

async function carregarClientes(busca = '') {
  const corpo = document.getElementById('corpo-tabela-clientes');
  try {
    const url = busca ? `/api/clientes?busca=${encodeURIComponent(busca)}` : '/api/clientes';
    const clientes = await window.apiFetch(url);

    if (clientes.length === 0) {
      corpo.innerHTML = '<tr><td colspan="5" class="vazio">Nenhum cliente encontrado.</td></tr>';
      return;
    }

    corpo.innerHTML = clientes.map((c) => `
      <tr>
        <td>${escapeHtml(c.nome)}</td>
        <td class="mono">${escapeHtml(c.cpf || '—')}</td>
        <td>${escapeHtml(c.telefone || '—')}</td>
        <td>${escapeHtml(c.email || '—')}</td>
        <td class="acoes-linha">
          <button class="secundario" onclick="abrirModal(${c.id})">Editar</button>
          <button class="perigo" onclick="excluirCliente(${c.id})">Excluir</button>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="5" class="vazio">${escapeHtml(erro.message)}</td></tr>`;
  }
}

async function abrirModal(id = null) {
  clienteEmEdicaoId = id;
  document.getElementById('erro-modal-cliente').style.display = 'none';
  const form = document.getElementById('form-cliente');
  form.reset();

  document.getElementById('titulo-modal-cliente').textContent = id ? 'Editar cliente' : 'Novo cliente';

  if (id) {
    try {
      const cliente = await window.apiFetch(`/api/clientes/${id}`);
      form.nome.value = cliente.nome || '';
      form.cpf.value = cliente.cpf || '';
      form.telefone.value = cliente.telefone || '';
      form.email.value = cliente.email || '';
      form.endereco.value = cliente.endereco || '';
    } catch (erro) {
      alert(erro.message);
      return;
    }
  }

  document.getElementById('modal-cliente').classList.add('aberto');
}

function fecharModal() {
  document.getElementById('modal-cliente').classList.remove('aberto');
}

async function salvarCliente(evento) {
  evento.preventDefault();
  const form = evento.target;
  const caixaErro = document.getElementById('erro-modal-cliente');
  caixaErro.style.display = 'none';

  const corpo = {
    nome: form.nome.value.trim(),
    cpf: form.cpf.value.trim() || null,
    telefone: form.telefone.value.trim() || null,
    email: form.email.value.trim() || null,
    endereco: form.endereco.value.trim() || null,
  };

  try {
    if (clienteEmEdicaoId) {
      await window.apiFetch(`/api/clientes/${clienteEmEdicaoId}`, { method: 'PUT', body: JSON.stringify(corpo) });
    } else {
      await window.apiFetch('/api/clientes', { method: 'POST', body: JSON.stringify(corpo) });
    }
    fecharModal();
    carregarClientes(document.getElementById('busca-cliente').value);
  } catch (erro) {
    caixaErro.textContent = erro.message;
    caixaErro.style.display = 'block';
  }
}

async function excluirCliente(id) {
  if (!confirm('Excluir este cliente? Os veículos e ordens de serviço vinculados também serão removidos.')) return;
  try {
    await window.apiFetch(`/api/clientes/${id}`, { method: 'DELETE' });
    carregarClientes(document.getElementById('busca-cliente').value);
  } catch (erro) {
    alert(erro.message);
  }
}

async function fazerLogout() {
  try {
    await window.apiFetch('/api/auth/logout', { method: 'POST' });
  } finally {
    window.location.href = '/login.html';
  }
}

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function debounce(fn, atraso) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), atraso);
  };
}