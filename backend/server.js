const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const apiRoutes = require('./routes'); // Importa o roteador principal da API

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS mais flexível para o ambiente da Render
const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (ex: Postman, server-to-server) 
    // e de qualquer subdomínio '.onrender.com'.
    if (!origin || (origin && new URL(origin).hostname.endsWith('.onrender.com'))) {
      callback(null, true);
    } else {
      callback(new Error('Requisição não permitida pelo CORS'));
    }
  },
  optionsSuccessStatus: 200 // para compatibilidade com navegadores mais antigos
};

app.use(cors(corsOptions));
app.use(express.json());

// Centraliza todas as rotas da API sob o prefixo /api
app.use('/api', apiRoutes);

// Middleware de tratamento de erros centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Algo deu errado no servidor!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
