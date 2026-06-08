export function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
}

export function clearElement(element) {
  if (element) element.innerHTML = '';
}

export function showNotification(message) {
  const notification = document.getElementById('notification');
  if (!notification) return;
  notification.textContent = message;
  notification.classList.add('show');
  clearTimeout(window.notificationTimeout);
  window.notificationTimeout = setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

export function updateStats({ total = 0, alunos = 0, planos = 0, matriculas = 0 }) {
  const statTotal = document.getElementById('stat-total');
  const statAlunos = document.getElementById('stat-alunos');
  const statPlanos = document.getElementById('stat-planos');
  const statMatriculas = document.getElementById('stat-matriculas');

  if (statTotal) statTotal.textContent = total;
  if (statAlunos) statAlunos.textContent = alunos;
  if (statPlanos) statPlanos.textContent = planos;
  if (statMatriculas) statMatriculas.textContent = matriculas;
}
