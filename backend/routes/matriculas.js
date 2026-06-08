const express = require('express');
const db = require('../database');
const router = express.Router();

function sendDbError(res, err) {
  console.error(err.message);
  res.status(500).json({ error: 'Erro interno no servidor.' });
}

router.get('/', (req, res) => {
  const alunoId = req.query.aluno_id;
  const filter = alunoId ? 'WHERE m.aluno_id = ?' : '';
  const params = alunoId ? [alunoId] : [];

  const sql = `
    SELECT m.id,
      m.aluno_id,
      a.nome AS aluno_nome,
      m.plano_id,
      p.nome AS plano_nome,
      m.inicio,
      m.termino,
      m.status
    FROM matriculas m
    LEFT JOIN alunos a ON m.aluno_id = a.id
    LEFT JOIN planos p ON m.plano_id = p.id
    ${filter}
    ORDER BY m.inicio DESC
  `;

  db.all(sql, params, (err, rows) => {
    if (err) return sendDbError(res, err);
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM matriculas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return sendDbError(res, err);
    if (!row) return res.status(404).json({ error: 'Matrícula não encontrada.' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { aluno_id, plano_id, inicio, termino, status } = req.body;
  if (!aluno_id || !plano_id || !inicio || !termino || !status) {
    return res.status(400).json({ error: 'Todos os campos da matrícula são obrigatórios.' });
  }

  db.run(
    'INSERT INTO matriculas (aluno_id, plano_id, inicio, termino, status) VALUES (?, ?, ?, ?, ?)',
    [aluno_id, plano_id, inicio, termino, status],
    function (err) {
      if (err) return sendDbError(res, err);
      res.status(201).json({ id: this.lastID, aluno_id, plano_id, inicio, termino, status });
    }
  );
});

router.put('/:id', (req, res) => {
  const { aluno_id, plano_id, inicio, termino, status } = req.body;
  if (!aluno_id || !plano_id || !inicio || !termino || !status) {
    return res.status(400).json({ error: 'Todos os campos da matrícula são obrigatórios.' });
  }

  db.run(
    'UPDATE matriculas SET aluno_id = ?, plano_id = ?, inicio = ?, termino = ?, status = ? WHERE id = ?',
    [aluno_id, plano_id, inicio, termino, status, req.params.id],
    function (err) {
      if (err) return sendDbError(res, err);
      if (this.changes === 0) return res.status(404).json({ error: 'Matrícula não encontrada.' });
      res.json({ message: 'Matrícula atualizada com sucesso.' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM matriculas WHERE id = ?', [req.params.id], function (err) {
    if (err) return sendDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ error: 'Matrícula não encontrada.' });
    res.json({ message: 'Matrícula removida com sucesso.' });
  });
});

module.exports = router;
