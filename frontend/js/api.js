const BASE_URL = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Erro inesperado na API.');
  }

  return response.status === 204 ? null : response.json();
}

export async function login(credentials) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function getAlunos() {
  return request('/alunos');
}

export async function getAluno(id) {
  return request(`/alunos/${id}`);
}

export async function createAluno(aluno) {
  return request('/alunos', { method: 'POST', body: JSON.stringify(aluno) });
}

export async function updateAluno(id, aluno) {
  return request(`/alunos/${id}`, { method: 'PUT', body: JSON.stringify(aluno) });
}

export async function deleteAluno(id) {
  return request(`/alunos/${id}`, { method: 'DELETE' });
}

export async function getPlanos() {
  return request('/planos');
}

export async function createPlano(plano) {
  return request('/planos', { method: 'POST', body: JSON.stringify(plano) });
}

export async function updatePlano(id, plano) {
  return request(`/planos/${id}`, { method: 'PUT', body: JSON.stringify(plano) });
}

export async function deletePlano(id) {
  return request(`/planos/${id}`, { method: 'DELETE' });
}

export async function getMatriculas(alunoId) {
  const query = alunoId ? `?aluno_id=${alunoId}` : '';
  return request(`/matriculas${query}`);
}

export async function createMatricula(matricula) {
  return request('/matriculas', { method: 'POST', body: JSON.stringify(matricula) });
}

export async function updateMatricula(id, matricula) {
  return request(`/matriculas/${id}`, { method: 'PUT', body: JSON.stringify(matricula) });
}

export async function deleteMatricula(id) {
  return request(`/matriculas/${id}`, { method: 'DELETE' });
}

export async function getTreinos(alunoId) {
  const query = alunoId ? `?aluno_id=${alunoId}` : '';
  return request(`/treinos${query}`);
}

export async function createTreino(treino) {
  return request('/treinos', { method: 'POST', body: JSON.stringify(treino) });
}

export async function updateTreino(id, treino) {
  return request(`/treinos/${id}`, { method: 'PUT', body: JSON.stringify(treino) });
}

export async function deleteTreino(id) {
  return request(`/treinos/${id}`, { method: 'DELETE' });
}

export async function gerarTreinoIA(data) {
  return request('/ia/gerar-treino', { method: 'POST', body: JSON.stringify(data) });
}
