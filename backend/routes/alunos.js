const express = require('express');
const db = require('../database');
const router = express.Router();

function sendDbError(res, err) {
  console.error(err.message);
  res.status(500).json({ error: 'Erro interno no servidor.' });
}

router.get('/', (req, res) => {
  db.all('SELECT id, nome, email, telefone, nascimento, altura FROM alunos ORDER BY nome', [], (err, rows) => {
    if (err) return sendDbError(res, err);
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT id, nome, email, telefone, nascimento, altura FROM alunos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return sendDbError(res, err);
    if (!row) return res.status(404).json({ error: 'Aluno não encontrado.' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { nome, email, telefone, nascimento, senha, altura } = req.body;
  if (!nome || !senha) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
  }

  const sql = 'INSERT INTO alunos (nome, email, telefone, nascimento, senha, altura) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [nome, email || '', telefone || '', nascimento || '', senha || '', altura], function (err) {
    if (err) return sendDbError(res, err);
    res.status(201).json({ id: this.lastID, nome, email, telefone, nascimento, altura });
  });
});

router.put('/:id', (req, res) => {
  const { nome, email, telefone, nascimento, senha, altura } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'O nome é obrigatório.' });
  }

  const sql = `
    UPDATE alunos
    SET nome = ?, email = ?, telefone = ?, nascimento = ?, altura = ?, senha = CASE WHEN ? != '' THEN ? ELSE senha END
    WHERE id = ?
  `;

  db.run(sql, [nome, email || '', telefone || '', nascimento || '', altura || '', senha || '', senha || '', req.params.id], function (err) {
    if (err) return sendDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ error: 'Aluno não encontrado.' });
    res.json({ message: 'Aluno atualizado com sucesso.' });
  });
});

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM alunos WHERE id = ?';
  db.run(sql, [req.params.id], function (err) {
    if (err) return sendDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ error: 'Aluno não encontrado.' });
    res.json({ message: 'Aluno removido com sucesso.' });
  });
});

module.exports = router;
