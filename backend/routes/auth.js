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

  // Em produção, as credenciais do admin DEVEM vir de variáveis de ambiente.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@academia.com';
  const adminSenha = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === adminEmail) {
    if (senha === adminSenha) {
      return res.json({ role: 'admin', name: 'Administrador' });
    } else {
      return res.status(401).json({ error: 'Credenciais de administrador inválidas.' });
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
