import * as api from '../api.js';
import { formatDate, showNotification, clearElement } from '../ui.js';

const form = document.getElementById('form-matricula');
const body = document.getElementById('matriculas-body');
const btnNew = document.getElementById('nova-matricula');
const btnReset = document.getElementById('reset-matricula');
const alunoSelect = document.getElementById('matricula-aluno');
const planoSelect = document.getElementById('matricula-plano');

let editId = null;

export async function initMatriculas() {
  btnNew?.addEventListener('click', resetMatriculaForm);
  btnReset?.addEventListener('click', resetMatriculaForm);
  form?.addEventListener('submit', handleMatriculaSubmit);
  body?.addEventListener('click', handleActions);
  await refreshMatriculas();
}

export async function refreshMatriculas(user = null) {
  try {
    await loadAlunoOptions();
    await loadPlanoOptions();
    const matriculas = user?.role === 'aluno' ? await api.getMatriculas(user.id) : await api.getMatriculas();
    renderMatriculas(matriculas);
    return matriculas.length;
  } catch (err) {
    showNotification(err.message);
    return 0;
  }
}

function renderMatriculas(matriculas) {
  clearElement(body);
  matriculas.forEach((matricula) => {
    const row = document.createElement('tr');
    row.dataset.id = matricula.id;
    row.innerHTML = `
      <td>${matricula.aluno_nome || 'Aluno removido'}</td>
      <td>${matricula.plano_nome || 'Plano removido'}</td>
      <td>${formatDate(matricula.inicio)}</td>
      <td>${formatDate(matricula.termino)}</td>
      <td>${matricula.status}</td>
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

async function loadAlunoOptions() {
  const alunos = await api.getAlunos();
  alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
  alunos.forEach((aluno) => {
    alunoSelect.innerHTML += `<option value="${aluno.id}">${aluno.nome}</option>`;
  });
}

async function loadPlanoOptions() {
  const planos = await api.getPlanos();
  planoSelect.innerHTML = '<option value="">Selecione um plano</option>';
  planos.forEach((plano) => {
    planoSelect.innerHTML += `<option value="${plano.id}">${plano.nome}</option>`;
  });
}

async function handleMatriculaSubmit(event) {
  event.preventDefault();
  const matricula = getFormMatriculaData();

  if (!matricula.aluno_id || !matricula.plano_id || !matricula.inicio || !matricula.termino) {
    return showNotification('Preencha todos os campos da matrícula.');
  }

  try {
    if (editId) {
      await api.updateMatricula(editId, matricula);
      showNotification('Matrícula atualizada com sucesso.');
    } else {
      await api.createMatricula(matricula);
      showNotification('Matrícula cadastrada com sucesso.');
    }
    resetMatriculaForm();
    await refreshMatriculas();
  } catch (err) {
    showNotification(err.message);
  }
}

function getFormMatriculaData() {
  return {
    aluno_id: Number(alunoSelect.value),
    plano_id: Number(planoSelect.value),
    inicio: document.getElementById('matricula-inicio').value,
    termino: document.getElementById('matricula-termino').value,
    status: document.getElementById('matricula-status').value
  };
}

function resetMatriculaForm() {
  editId = null;
  form.reset();
  document.getElementById('matricula-id').value = '';
}

function handleActions(event) {
  const action = event.target.dataset.action;
  if (!action) return;

  const row = event.target.closest('tr');
  const id = Number(row.dataset.id);

  if (action === 'edit') return editMatricula(id);
  if (action === 'delete') return deleteMatricula(id);
}

async function editMatricula(id) {
  try {
    const matriculas = await api.getMatriculas();
    const matricula = matriculas.find((item) => item.id === id);
    if (!matricula) return showNotification('Matrícula não encontrada.');

    editId = id;
    document.getElementById('matricula-id').value = matricula.id;
    alunoSelect.value = matricula.aluno_id;
    planoSelect.value = matricula.plano_id;
    document.getElementById('matricula-inicio').value = matricula.inicio;
    document.getElementById('matricula-termino').value = matricula.termino;
    document.getElementById('matricula-status').value = matricula.status;
    showNotification('Modo edição ativado. Atualize e salve.');
  } catch (err) {
    showNotification(err.message);
  }
}

async function deleteMatricula(id) {
  if (!confirm('Deseja realmente excluir esta matrícula?')) return;

  try {
    await api.deleteMatricula(id);
    await refreshMatriculas();
    showNotification('Matrícula excluída com sucesso.');
  } catch (err) {
    showNotification(err.message);
  }
}
