import * as api from '../api.js';
import { formatDate, showNotification, clearElement } from '../ui.js';

const form = document.getElementById('form-aluno');
const body = document.getElementById('alunos-body');
const btnNew = document.getElementById('novo-aluno');
const btnReset = document.getElementById('reset-aluno');

let editId = null;

export async function initAlunos() {
  btnNew?.addEventListener('click', resetAlunoForm);
  btnReset?.addEventListener('click', resetAlunoForm);
  form?.addEventListener('submit', handleAlunoSubmit);
  body?.addEventListener('click', handleActions);
  await refreshAlunos();
}

export async function refreshAlunos() {
  try {
    const alunos = await api.getAlunos();
    renderAlunos(alunos);
    return alunos.length;
  } catch (err) {
    showNotification(err.message);
    return 0;
  }
}

function renderAlunos(alunos) {
  clearElement(body);
  alunos.forEach((aluno) => {
    const row = document.createElement('tr');
    row.dataset.id = aluno.id;
    row.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.email || '-'}</td>
      <td>${aluno.telefone || '-'}</td>
      <td>${formatDate(aluno.nascimento)}</td>
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

async function handleAlunoSubmit(event) {
  event.preventDefault();
  const aluno = getFormAlunoData();

  if (!aluno.nome || !aluno.senha) {
    return showNotification('Nome e senha do aluno são obrigatórios.');
  }

  try {
    if (editId) {
      await api.updateAluno(editId, aluno);
      showNotification('Aluno atualizado com sucesso.');
    } else {
      await api.createAluno(aluno);
      showNotification('Aluno cadastrado com sucesso.');
    }

    window.dispatchEvent(new CustomEvent('data-updated'));
  } catch (err) {
    showNotification(err.message);
  }
}

function getFormAlunoData() {
  return {
    nome: document.getElementById('aluno-nome').value.trim(),
    email: document.getElementById('aluno-email').value.trim(),
    telefone: document.getElementById('aluno-telefone').value.trim(),
    nascimento: document.getElementById('aluno-nascimento').value,
    senha: document.getElementById('aluno-senha').value.trim()
  };
}

function resetAlunoForm() {
  editId = null;
  form.reset();
  document.getElementById('aluno-id').value = '';
}

function handleActions(event) {
  const action = event.target.dataset.action;
  if (!action) return;

  const row = event.target.closest('tr');
  const id = Number(row.dataset.id);

  if (action === 'edit') {
    return editAluno(id);
  }
  if (action === 'delete') {
    return deleteAluno(id);
  }
}

async function editAluno(id) {
  try {
    const alunos = await api.getAlunos();
    const aluno = alunos.find((item) => item.id === id);
    if (!aluno) return showNotification('Aluno não encontrado.');

    editId = id;
    document.getElementById('aluno-id').value = aluno.id;
    document.getElementById('aluno-nome').value = aluno.nome;
    document.getElementById('aluno-email').value = aluno.email || '';
    document.getElementById('aluno-telefone').value = aluno.telefone || '';
    document.getElementById('aluno-nascimento').value = aluno.nascimento || '';
    document.getElementById('aluno-senha').value = '';
    showNotification('Modo edição ativado. Atualize e salve.');
  } catch (err) {
    showNotification(err.message);
  }
}

async function deleteAluno(id) {
  if (!confirm('Deseja realmente excluir este aluno?')) return;

  try {
    await api.deleteAluno(id);
    window.dispatchEvent(new CustomEvent('data-updated'));
    showNotification('Aluno excluído com sucesso.');
  } catch (err) {
    showNotification(err.message);
  }
}
