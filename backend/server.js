const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const apiRoutes = require('./routes'); // Importa o roteador principal da API

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS mais segura para o ambiente da Render
const allowedOrigins = [ // 1. Lista de origens permitidas
  'https://frontend-academia-1fjh.onrender.com', // Frontend atual no Render
  'https://frontend-academia.onrender.com', // Nome alternativo do serviço no Render
  'http://127.0.0.1:5500', // Servidor de desenvolvimento local (se usar Live Server)
  'http://localhost:5500'
];

const corsOptions = {
  origin: function (origin, callback) {
    // 2. Permite requisições sem 'origin' (ex: Postman) ou da lista.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: A origem '${origin}' foi bloqueada.`); // Log para depuração
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 3. Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // 4. Cabeçalhos permitidos
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRoutes);

// Middleware de tratamento de erros centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  // 5. Resposta específica para erros de CORS
  if (err.message === 'Origem não permitida pelo CORS') {
    return res.status(403).json({ error: 'Acesso negado pela política de CORS.' });
  }
  res.status(500).json({ error: 'Algo deu errado no servidor!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
