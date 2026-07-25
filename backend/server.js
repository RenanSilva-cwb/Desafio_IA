const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const apiRoutes = require('./routes'); // Importa o roteador principal da API

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Centraliza todas as rotas da API sob o prefixo /api
app.use('/api', apiRoutes);

// Rota "catch-all" para servir o index.html para a SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Middleware de tratamento de erros centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Algo deu errado no servidor!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
