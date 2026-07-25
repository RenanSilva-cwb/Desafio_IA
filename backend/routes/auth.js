const express = require('express');
const db = require('../database');
const bcrypt = require('bcrypt');
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

  // O login do admin também deve ser seguro, mas por simplicidade, vamos mantê-lo por enquanto
  // e focar na segurança dos alunos. Em um projeto real, o admin seria um usuário no DB.
  if (email === 'admin@academia.com') {
    if (senha === 'admin123') {
      return res.json({ role: 'admin', name: 'Administrador' });
    } else {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  }

  db.get(
    'SELECT id, nome, senha FROM alunos WHERE email = ?',
    [email],
    (err, user) => {
      if (err) return sendDbError(res, err);
      if (!user) return res.status(401).json({ error: 'Email ou senha incorretos.' });

      bcrypt.compare(senha, user.senha, (err, result) => {
        if (err || !result) return res.status(401).json({ error: 'Email ou senha incorretos.' });
        res.json({ role: 'aluno', id: user.id, name: user.nome });
      });
    }
  );
});

module.exports = router;
