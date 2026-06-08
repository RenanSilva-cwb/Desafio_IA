import { initTabs } from './components/tabs.js';
import { initAuth, getCurrentUser } from './components/auth.js';
import { initAlunos, refreshAlunos } from './components/alunos.js';
import { initPlanos, refreshPlanos } from './components/planos.js';
import { initMatriculas, refreshMatriculas } from './components/matriculas.js';
import { initTreinos, refreshTreinos } from './components/treinos.js';
import { updateStats } from './ui.js';

window.addEventListener('DOMContentLoaded', async () => {
  const user = await initAuth();
  initTabs();
  if (user) await loadAppModules(user);
});

window.addEventListener('authchange', async (event) => {
  const user = event.detail;
  initTabs();
  if (user) {
    await loadAppModules(user);
  }
});

async function loadAppModules(user) {
  await initAlunos();
  await initPlanos();
  await initMatriculas();
  await initTreinos();
  await refreshDashboard(user);
}

async function refreshDashboard(user) {
  const [alunos, planos, matriculas, treinos] = await Promise.all([
    user?.role === 'admin' ? refreshAlunos() : Promise.resolve(0),
    user?.role === 'admin' ? refreshPlanos() : Promise.resolve(0),
    refreshMatriculas(user),
    refreshTreinos(user)
  ]);

  updateStats({
    total: alunos + planos + matriculas + treinos,
    alunos,
    planos,
    matriculas
  });
}
