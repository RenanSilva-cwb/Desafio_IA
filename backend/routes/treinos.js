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
    SELECT t.id,
      t.matricula_id,
      t.nome,
      t.descricao,
      t.exercicios,
      t.inicio,
      t.termino,
      m.aluno_id,
      a.nome AS aluno_nome,
      p.nome AS plano_nome
    FROM treinos t
    JOIN matriculas m ON t.matricula_id = m.id
    LEFT JOIN alunos a ON m.aluno_id = a.id
    LEFT JOIN planos p ON m.plano_id = p.id
    ${filter}
    ORDER BY t.inicio DESC
  `;

  db.all(sql, params, (err, rows) => {
    if (err) return sendDbError(res, err);
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { matricula_id, nome, descricao, exercicios, inicio, termino } = req.body;
  if (!matricula_id || !nome || !inicio || !termino) {
    return res.status(400).json({ error: 'Matricula, nome, início e término são obrigatórios.' });
  }

  db.run(
    'INSERT INTO treinos (matricula_id, nome, descricao, exercicios, inicio, termino) VALUES (?, ?, ?, ?, ?, ?)',
    [matricula_id, nome, descricao || '', exercicios || '', inicio, termino],
    function (err) {
      if (err) return sendDbError(res, err);
      res.status(201).json({ id: this.lastID, matricula_id, nome, descricao, exercicios, inicio, termino });
    }
  );
});

router.put('/:id', (req, res) => {
  const { matricula_id, nome, descricao, exercicios, inicio, termino } = req.body;
  if (!matricula_id || !nome || !inicio || !termino) {
    return res.status(400).json({ error: 'Matricula, nome, início e término são obrigatórios.' });
  }

  db.run(
    'UPDATE treinos SET matricula_id = ?, nome = ?, descricao = ?, exercicios = ?, inicio = ?, termino = ? WHERE id = ?',
    [matricula_id, nome, descricao || '', exercicios || '', inicio, termino, req.params.id],
    function (err) {
      if (err) return sendDbError(res, err);
      if (this.changes === 0) return res.status(404).json({ error: 'Treino não encontrado.' });
      res.json({ message: 'Treino atualizado com sucesso.' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM treinos WHERE id = ?', [req.params.id], function (err) {
    if (err) return sendDbError(res, err);
    if (this.changes === 0) return res.status(404).json({ error: 'Treino não encontrado.' });
    res.json({ message: 'Treino removido com sucesso.' });
  });
});

module.exports = router;
