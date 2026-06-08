const express = require('express');
const db = require('../database');
const router = express.Router();

function sendDbError(res, err) {
  console.error(err.message);
  res.status(500).json({ error: 'Erro interno no servidor.' });
}

router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  if (email === 'admin@academia.com' && senha === 'admin123') {
    return res.json({ role: 'admin', name: 'Administrador' });
  }

  db.get(
    'SELECT id, nome FROM alunos WHERE email = ? AND senha = ?',
    [email, senha],
    (err, row) => {
      if (err) return sendDbError(res, err);
      if (!row) return res.status(401).json({ error: 'Email ou senha incorretos.' });
      res.json({ role: 'aluno', id: row.id, name: row.nome });
    }
  );
});

module.exports = router;
