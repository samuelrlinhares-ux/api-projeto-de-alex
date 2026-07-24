let veiculoEmEdicaoId = null;
let clientesCache = [];

document.addEventListener('DOMContentLoaded', async () => {
  carregarUsuario();
  await carregarClientesCache();
  carregarVeiculos();

  document.getElementById('btn-logout').addEventListener('click', fazerLogout);
  document.getElementById('btn-novo-veiculo').addEventListener('click', () => abrirModal());
  document.getElementById('filtro-cliente').addEventListener('change', (e) => carregarVeiculos(e.target.value));

  document.getElementById('form-veiculo').addEventListener('submit', salvarVeiculo);
  document.getElementById('btn-cancelar-modal').addEventListener('click', fecharModal);
});

async function carregarUsuario() {
  try {
    const usuario = await window.apiFetch('/api/auth/me');
    document.getElementById('nome-usuario').textContent = usuario.nome;
  } catch (erro) {}
}

async function carregarClientesCache() {
  try {
    clientesCache = await window.apiFetch('/api/clientes');
    const opcoesFiltro = clientesCache.map((c) => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join('');
    document.getElementById('filtro-cliente').innerHTML = '<option value="">Todos os clientes</option>' + opcoesFiltro;
    document.getElementById('campo-cliente-modal').innerHTML =
      '<option value="">Selecione...</option>' + opcoesFiltro;
  } catch (erro) {
    console.error(erro);
  }
}

async function carregarVeiculos(clienteId = '') {
  const corpo = document.getElementById('corpo-tabela-veiculos');
  try {
    const url = clienteId ? `/api/veiculos?cliente_id=${clienteId}` : '/api/veiculos';
    const veiculos = await window.apiFetch(url);

    if (veiculos.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="vazio">Nenhum veículo encontrado.</td></tr>';
      return;
    }

    corpo.innerHTML = veiculos.map((v) => `
      <tr>
        <td class="placa">${escapeHtml(v.placa)}</td>
        <td>${escapeHtml(v.marca || '—')}</td>
        <td>${escapeHtml(v.modelo || '—')}</td>
        <td>${v.ano || '—'}</td>
        <td>${escapeHtml(v.cliente_nome)}</td>
        <td class="acoes-linha">
          <button class="secundario" onclick="abrirModal(${v.id})">Editar</button>
          <button class="perigo" onclick="excluirVeiculo(${v.id})">Excluir</button>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="6" class="vazio">${escapeHtml(erro.message)}</td></tr>`;
  }
}

async function abrirModal(id = null) {
  veiculoEmEdicaoId = id;
  document.getElementById('erro-modal-veiculo').style.display = 'none';
  const form = document.getElementById('form-veiculo');
  form.reset();

  document.getElementById('titulo-modal-veiculo').textContent = id ? 'Editar veículo' : 'Novo veículo';

  if (id) {
    try {
      const veiculo = await window.apiFetch(`/api/veiculos/${id}`);
      form.cliente_id.value = veiculo.cliente_id;
      form.placa.value = veiculo.placa || '';
      form.marca.value = veiculo.marca || '';
      form.modelo.value = veiculo.modelo || '';
      form.ano.value = veiculo.ano || '';
      form.cor.value = veiculo.cor || '';
    } catch (erro) {
      alert(erro.message);
      return;
    }
  }

  document.getElementById('modal-veiculo').classList.add('aberto');
}

function fecharModal() {
  document.getElementById('modal-veiculo').classList.remove('aberto');
}

async function salvarVeiculo(evento) {
  evento.preventDefault();
  const form = evento.target;
  const caixaErro = document.getElementById('erro-modal-veiculo');
  caixaErro.style.display = 'none';

  const corpo = {
    cliente_id: Number(form.cliente_id.value),
    placa: form.placa.value.trim(),
    marca: form.marca.value.trim() || null,
    modelo: form.modelo.value.trim() || null,
    ano: form.ano.value ? Number(form.ano.value) : null,
    cor: form.cor.value.trim() || null,
  };

  try {
    if (veiculoEmEdicaoId) {
      await window.apiFetch(`/api/veiculos/${veiculoEmEdicaoId}`, { method: 'PUT', body: JSON.stringify(corpo) });
    } else {
      await window.apiFetch('/api/veiculos', { method: 'POST', body: JSON.stringify(corpo) });
    }
    fecharModal();
    carregarVeiculos(document.getElementById('filtro-cliente').value);
  } catch (erro) {
    caixaErro.textContent = erro.message;
    caixaErro.style.display = 'block';
  }
}

async function excluirVeiculo(id) {
  if (!confirm('Excluir este veículo? As ordens de serviço vinculadas também serão removidas.')) return;
  try {
    await window.apiFetch(`/api/veiculos/${id}`, { method: 'DELETE' });
    carregarVeiculos(document.getElementById('filtro-cliente').value);
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