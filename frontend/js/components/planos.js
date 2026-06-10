import * as api from '../api.js';
import { showNotification, clearElement } from '../ui.js';

const form = document.getElementById('form-plano');
const body = document.getElementById('planos-body');
const btnNew = document.getElementById('novo-plano');
const btnReset = document.getElementById('reset-plano');

let editId = null;

export async function initPlanos() {
  btnNew?.addEventListener('click', resetPlanoForm);
  btnReset?.addEventListener('click', resetPlanoForm);
  form?.addEventListener('submit', handlePlanoSubmit);
  body?.addEventListener('click', handleActions);
  await refreshPlanos();
}

export async function refreshPlanos() {
  try {
    const planos = await api.getPlanos();
    renderPlanos(planos);
    return planos.length;
  } catch (err) {
    showNotification(err.message);
    return 0;
  }
}

function renderPlanos(planos) {
  clearElement(body);
  planos.forEach((plano) => {
    const row = document.createElement('tr');
    row.dataset.id = plano.id;
    row.innerHTML = `
      <td>${plano.nome}</td>
      <td>${plano.duracao} meses</td>
      <td>R$ ${Number(plano.valor).toFixed(2)}</td>
      <td>${plano.descricao || '-'}</td>
      <td>
        <div class="actions">
          <button class="action-button action-edit admin-only" data-action="edit">Editar</button>
          <button class="action-button action-delete admin-only" data-action="delete">Excluir</button>
        </div>
      </td>
    `;
    body.appendChild(row);
  });
}

async function handlePlanoSubmit(event) {
  event.preventDefault();
  const plano = getFormPlanoData();

  if (!plano.nome || !plano.duracao || !plano.valor) {
    return showNotification('Nome, duração e valor são obrigatórios.');
  }

  try {
    if (editId) {
      await api.updatePlano(editId, plano);
      showNotification('Plano atualizado com sucesso.');
    } else {
      await api.createPlano(plano);
      showNotification('Plano cadastrado com sucesso.');
    }
    window.dispatchEvent(new CustomEvent('data-updated'));
  } catch (err) {
    showNotification(err.message);
  }
}

function getFormPlanoData() {
  return {
    nome: document.getElementById('plano-nome').value.trim(),
    duracao: Number(document.getElementById('plano-duracao').value),
    valor: Number(document.getElementById('plano-valor').value),
    descricao: document.getElementById('plano-descricao').value.trim()
  };
}

function resetPlanoForm() {
  editId = null;
  form.reset();
  document.getElementById('plano-id').value = '';
}

function handleActions(event) {
  const action = event.target.dataset.action;
  if (!action) return;

  const row = event.target.closest('tr');
  const id = Number(row.dataset.id);

  if (action === 'edit') return editPlano(id);
  if (action === 'delete') return deletePlano(id);
}

async function editPlano(id) {
  try {
    const planos = await api.getPlanos();
    const plano = planos.find((item) => item.id === id);
    if (!plano) return showNotification('Plano não encontrado.');

    editId = id;
    document.getElementById('plano-id').value = plano.id;
    document.getElementById('plano-nome').value = plano.nome;
    document.getElementById('plano-duracao').value = plano.duracao;
    document.getElementById('plano-valor').value = plano.valor;
    document.getElementById('plano-descricao').value = plano.descricao || '';
    showNotification('Modo edição ativado. Atualize e salve.');
  } catch (err) {
    showNotification(err.message);
  }
}

async function deletePlano(id) {
  if (!confirm('Deseja realmente excluir este plano?')) return;

  try {
    await api.deletePlano(id);
    window.dispatchEvent(new CustomEvent('data-updated'));
    showNotification('Plano excluído com sucesso.');
  } catch (err) {
    showNotification(err.message);
  }
}
