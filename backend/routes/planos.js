const express = require('express');
const db = require('../database');
const router = express.Router();

function sendDbError(res, err) {
  console.error(err.message);
  res.status(500).json({ error: 'Erro interno no servidor.' });
}

router.get('/', (req, res) => {
  db.all('SELECT * FROM planos ORDER BY nome', [], (err, rows) => {
    if (err) return sendDbError(res, err);
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM planos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return sendDbError(res, err);
    if (!row) return res.status(404).json({ error: 'Plano não encontrado.' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { nome, duracao, valor, descricao } = req.body;
  if (!nome || !duracao || !valor) {
    return res.status(400).json({ error: 'Nome, duração e valor são obrigatórios.' });
  }

  db.run(
    'INSERT INTO planos (nome, duracao, valor, descricao) VALUES (?, ?, ?, ?)',
    [nome, duracao, valor, descricao || ''],
    function (err) {
      if (err) return sendDbError(res, err);
      res.status(201).json({ id: this.lastID, nome, duracao, valor, descricao });
    }
  );
});

router.put('/:id', (req, res) => {
  const { nome, duracao, valor, descricao } = req.body;
  if (!nome || !duracao || !valor) {
    return res.status(400).json({ error: 'Nome, duração e valor são obrigatórios.' });
  }

  db.run(
    'UPDATE planos SET nome = ?, duracao = ?, valor = ?, descricao = ? WHERE id = ?',
    [nome, duracao, valor, descricao || '', req.params.id],
    function (err) {
      if (err) return sendDbError(res, err);
      if (this.changes === 0) return res.status(404).json({ error: 'Plano não encontrado.' });
      res.json({ message: 'Plano atualizado com sucesso.' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM planos WHERE id = ?', [req.params.id], function (err) {
    if (err) return sendDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ error: 'Plano não encontrado.' });
    res.json({ message: 'Plano removido com sucesso.' });
  });
});

module.exports = router;
