import * as api from '../api.js';
import { formatDate, showNotification, clearElement } from '../ui.js';
import { getCurrentUser, isAdmin } from './auth.js';

const form = document.getElementById('form-treino');
const body = document.getElementById('treinos-body');
const btnNew = document.getElementById('novo-treino');
const btnReset = document.getElementById('reset-treino');
const btnGerarIA = document.getElementById('gerar-treino-ia'); // Novo botão
const matriculaSelect = document.getElementById('treino-matricula');

let editId = null;

export async function initTreinos() {
  btnNew?.addEventListener('click', resetTreinoForm);
  btnReset?.addEventListener('click', resetTreinoForm);
  form?.addEventListener('submit', handleTreinoSubmit);
  btnGerarIA?.addEventListener('click', handleGerarTreinoIA); // Evento para o novo botão
  body?.addEventListener('click', handleActions);
  await refreshTreinos();
}

export async function refreshTreinos(user = null) {
  try {
    user = user || getCurrentUser();
    await loadMatriculaOptions();
    const treinos = user?.role === 'aluno' ? await api.getTreinos(user.id) : await api.getTreinos();
    renderTreinos(treinos);
    return treinos.length;
  } catch (err) {
    showNotification(err.message);
    return 0;
  }
}

function renderTreinos(treinos) {
  clearElement(body);
  const isUserAdmin = isAdmin(); 

  treinos.forEach((treino) => {
    const row = document.createElement('tr');
    row.dataset.id = treino.id;

    const acoesHtml = isUserAdmin 
      ? `
        <div class="actions">
          <button class="action-button action-pdf" data-action="pdf">PDF</button>
          <button class="action-button action-edit" data-action="edit">Editar</button>
          <button class="action-button action-delete" data-action="delete">Excluir</button>
        </div>
      `
      : `<button class="action-button action-pdf" data-action="pdf">Baixar PDF</button>`; 

    row.innerHTML = `
      <td>${treino.nome}</td>
      <td>${treino.aluno_nome || 'Aluno removido'}</td>
      <td>${treino.plano_nome || 'Plano removido'}</td>
      <td>${formatDate(treino.inicio)}</td>
      <td>${formatDate(treino.termino)}</td>
      <td>${treino.exercicios || '-'}</td>
      <td>${treino.descricao || '-'}</td>
      <td>${acoesHtml}</td>
    `;
    body.appendChild(row);
  });
}

async function handleTreinoSubmit(event) {
  event.preventDefault();
  const treino = getFormTreinoData();

  if (!treino.matricula_id || !treino.nome || !treino.inicio || !treino.termino) {
    return showNotification('Preencha matrícula, nome, início e término do treino.');
  }

  try {
    if (editId) {
      await api.updateTreino(editId, treino);
      showNotification('Treino atualizado com sucesso.');
    } else {
      await api.createTreino(treino);
      showNotification('Treino cadastrado com sucesso.');
    }
    window.dispatchEvent(new CustomEvent('data-updated'));
  } catch (err) {
    showNotification(err.message);
  }
}

function getFormTreinoData() {
  return {
    matricula_id: Number(matriculaSelect.value),
    nome: document.getElementById('treino-nome').value.trim(),
    descricao: document.getElementById('treino-descricao').value.trim(),
    exercicios: document.getElementById('treino-exercicios').value.trim(),
    inicio: document.getElementById('treino-inicio').value,
    termino: document.getElementById('treino-termino').value
  };
}

function resetTreinoForm() {
  editId = null;
  form.reset();
  document.getElementById('treino-id').value = '';
}

function handleActions(event) {
  const action = event.target.dataset.action;
  if (!action) return;

  const row = event.target.closest('tr');
  const id = Number(row.dataset.id);

  if (action === 'edit') return editTreino(id);
  if (action === 'delete') return deleteTreino(id);
  if (action === 'pdf') return window.open(`/api/treinos/${id}/pdf`, '_blank');
}

async function editTreino(id) {
  try {
    const treinos = await api.getTreinos();
    const treino = treinos.find((item) => item.id === id);
    if (!treino) return showNotification('Treino não encontrado.');

    editId = id;
    document.getElementById('treino-id').value = treino.id;
    matriculaSelect.value = treino.matricula_id;
    document.getElementById('treino-nome').value = treino.nome;
    document.getElementById('treino-descricao').value = treino.descricao || '';
    document.getElementById('treino-exercicios').value = treino.exercicios || '';
    document.getElementById('treino-inicio').value = treino.inicio;
    document.getElementById('treino-termino').value = treino.termino;
    showNotification('Modo edição ativado. Atualize e salve.');
  } catch (err) {
    showNotification(err.message);
  }
}

async function deleteTreino(id) {
  if (!confirm('Deseja realmente excluir este treino?')) return;

  try {
    await api.deleteTreino(id);
    window.dispatchEvent(new CustomEvent('data-updated'));
    showNotification('Treino excluído com sucesso.');
  } catch (err) {
    showNotification(err.message);
  }
}

async function handleGerarTreinoIA() {
  const matriculaId = matriculaSelect.value;
  if (!matriculaId) {
    return showNotification('Selecione uma matrícula primeiro para gerar um treino com IA.');
  }

  const objetivo = prompt('Qual o objetivo do treino? (Ex: Hipertrofia, Perda de Peso, Resistência)');
  if (!objetivo) return;

  const dias = prompt('Quantos dias por semana? (Ex: 3)');
  if (!dias) return;

  try {
    // Busca os dados completos do aluno associado à matrícula
    const matriculas = await api.getMatriculas();
    const matricula = matriculas.find(m => m.id === Number(matriculaId));
    if (!matricula || !matricula.aluno_id) {
      throw new Error('Matrícula ou aluno associado não encontrado.');
    }

    // Agora os dados do aluno já vêm na matrícula
    const alunoInfo = {
      nome: matricula.aluno_nome,
      peso: matricula.aluno_peso,
      nivel: matricula.aluno_nivel,
      nascimento: matricula.aluno_nascimento,
      altura: matricula.aluno_altura,
    };

    await gerarTreino(objetivo, dias, alunoInfo);
  } catch (err) {
    showNotification(`Erro ao buscar dados para IA: ${err.message}`);
  }
}

async function gerarTreino(objetivo, dias, aluno) {
  try {
    // Pega o nome do aluno selecionado na matrícula, se houver
    const selectedOption = matriculaSelect.options[matriculaSelect.selectedIndex];
    const nomeAluno = selectedOption ? selectedOption.text.split('—')[0].trim() : 'Aluno(a)';

    btnGerarIA.disabled = true;
    btnGerarIA.textContent = 'Gerando...';

    const treinoSugerido = await api.gerarTreinoIA({ objetivo, dias, aluno });

    // Formata a lista de exercícios com os links do YouTube
    const exerciciosFormatados = treinoSugerido.exercicios.map(ex => 
      `- ${ex.nome_exercicio} (${ex.series_reps})\n  Link: ${ex.link_youtube}`
    ).join('\n\n');

    document.getElementById('treino-nome').value = treinoSugerido.nome;
    document.getElementById('treino-descricao').value = treinoSugerido.descricao;
    document.getElementById('treino-exercicios').value = exerciciosFormatados;
    document.getElementById('treino-inicio').value = treinoSugerido.inicio;
    document.getElementById('treino-termino').value = treinoSugerido.termino;

    showNotification('Sugestão de treino gerada! Revise e salve.');
  } catch (err) {
    showNotification(`Erro ao gerar treino: ${err.message}`);
  } finally {
    btnGerarIA.disabled = false;
    btnGerarIA.textContent = 'Gerar com IA';
  }
}


async function loadMatriculaOptions() {
  const matriculas = await api.getMatriculas();
  matriculaSelect.innerHTML = '<option value="">Selecione uma matrícula</option>';
  matriculas.forEach((matricula) => {
    matriculaSelect.innerHTML += `
      <option value="${matricula.id}">
        ${matricula.aluno_nome || 'Aluno removido'} — ${matricula.plano_nome || 'Plano removido'}
      </option>`;
  });
}
