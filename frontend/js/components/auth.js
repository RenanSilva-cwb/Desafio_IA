import * as api from '../api.js';
import { showNotification } from '../ui.js';

const loginShell = document.getElementById('login-shell');
const appShell = document.getElementById('main-app');
const userBar = document.getElementById('user-bar');
const userWelcome = document.getElementById('user-welcome');
const logoutButton = document.getElementById('logout-button');
const loginForm = document.getElementById('form-login');
const loginEmail = document.getElementById('login-email');
const loginSenha = document.getElementById('login-senha');
const loginError = document.getElementById('login-error');

let currentUser = null;

export async function initAuth() {
  currentUser = JSON.parse(localStorage.getItem('academiaUser')) || null;
  loginForm?.addEventListener('submit', handleLogin);
  logoutButton?.addEventListener('click', handleLogout);
  renderAuthState();
  return currentUser;
}

export function getCurrentUser() {
  return currentUser;
}

export function isAdmin() {
  return currentUser?.role === 'admin';
}

export function isAluno() {
  return currentUser?.role === 'aluno';
}

async function handleLogin(event) {
  event.preventDefault();
  const email = loginEmail.value.trim();
  const senha = loginSenha.value.trim();

  if (!email || !senha) {
    return showNotification('Email e senha são obrigatórios.');
  }

  try {
    const user = await api.login({ email, senha });
    currentUser = user;
    localStorage.setItem('academiaUser', JSON.stringify(user));
    loginForm.reset();
    renderAuthState();
    showNotification(`Bem-vindo ${user.role === 'admin' ? 'Administrador' : 'Aluno'}!`);
  } catch (err) {
    showNotification(err.message);
    loginError.textContent = err.message;
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('academiaUser');
  renderAuthState();
  showNotification('Sessão encerrada. Faça login novamente para acessar.');
}

function renderAuthState() {
  const logged = Boolean(currentUser);
  loginShell?.classList.toggle('hidden', logged);
  appShell?.classList.toggle('hidden', !logged);
  userBar?.classList.toggle('hidden', !logged);

  if (logged) {
    userWelcome.textContent = `${currentUser.role === 'admin' ? 'Administrador' : 'Aluno'}: ${currentUser.name}`;
    loginError.textContent = '';
  }

  updatePermissions();
  window.dispatchEvent(new CustomEvent('authchange', { detail: currentUser }));
}

function updatePermissions() {
  document.querySelectorAll('[data-role]').forEach((element) => {
    const roles = element.dataset.role ? element.dataset.role.split(',').map((role) => role.trim()) : [];
    const visible = roles.length === 0 || (currentUser && roles.includes(currentUser.role));
    element.classList.toggle('hidden', !visible);
  });

  document.querySelectorAll('.admin-only').forEach((element) => {
    element.classList.toggle('hidden', !isAdmin());
  });

  document.querySelectorAll('.aluno-only').forEach((element) => {
    element.classList.toggle('hidden', !isAluno());
  });

  const visibleTabs = Array.from(document.querySelectorAll('.tab-button:not(.hidden)'));
  visibleTabs.forEach((button) => button.classList.remove('active'));
  const visiblePanels = Array.from(document.querySelectorAll('.panel:not(.hidden)'));
  visiblePanels.forEach((panel) => panel.classList.remove('active'));

  if (visibleTabs.length > 0) {
    const firstTab = visibleTabs[0];
    firstTab.classList.add('active');
    const panel = document.getElementById(firstTab.dataset.panel);
    if (panel) panel.classList.add('active');
  }
}
