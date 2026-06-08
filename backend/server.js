const express = require('express');
const cors = require('cors');
const path = require('path');
const alunosRoutes = require('./routes/alunos');
const planosRoutes = require('./routes/planos');
const matriculasRoutes = require('./routes/matriculas');
const treinosRoutes = require('./routes/treinos');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/planos', planosRoutes);
app.use('/api/matriculas', matriculasRoutes);
app.use('/api/treinos', treinosRoutes);
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
