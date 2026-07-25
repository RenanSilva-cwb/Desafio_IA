const express = require('express');
const Groq = require('groq-sdk');
const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/gerar-treino', async (req, res, next) => {
  const { objetivo, dias, aluno } = req.body;

  if (!objetivo || !dias || !aluno) {
    return res.status(400).json({ error: 'Objetivo, dias por semana e dados do aluno são obrigatórios.' });
  }

  const idade = aluno.nascimento ? new Date().getFullYear() - new Date(aluno.nascimento).getFullYear() : 'Não informada';
  const imc = aluno.peso && aluno.altura ? (aluno.peso / (aluno.altura * aluno.altura)).toFixed(2) : 'Não calculado';
  const hoje = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const prompt = `
    Aja como um personal trainer especialista e profissional para a "Academia Fitness".
    Crie um plano de treino personalizado e detalhado para o(a) aluno(a) ${aluno.nome}.
    
    Detalhes do Aluno:
    - Idade: ${idade}
    - Altura: ${aluno.altura ? aluno.altura + ' m' : 'Não informada'}
    - Peso: ${aluno.peso ? aluno.peso + ' kg' : 'Não informado'}
    - IMC: ${imc}
    - Nível de experiência: ${aluno.nivel || 'Não informado'}

    O aluno deseja um treino com o seguinte foco:
    - Objetivo principal: ${objetivo}
    - Dias disponíveis por semana: ${dias}

    Sua resposta DEVE ser um objeto JSON, sem nenhum texto ou formatação adicional antes ou depois.
    O JSON deve ter as seguintes chaves:
    - "nome": um nome técnico e profissional para o treino (ex: "Treino de Força com Foco em Peitorais").
    - "descricao": uma descrição motivacional e encorajadora sobre o treino, explicando brevemente como ele ajudará o aluno a atingir seus objetivos. Mantenha um tom profissional, mas inspirador.
    - "exercicios": um ARRAY de objetos. Cada objeto deve ter as chaves "nome_exercicio", "series_reps" (ex: "3x12"), e "link_youtube" (um link de um vídeo real do YouTube mostrando a execução correta do exercício).
    - "inicio": a data de início sugerida para o treino, no formato YYYY-MM-DD. Considere a data de hoje (${hoje}) como referência.
    - "termino": a data de término sugerida, aproximadamente 4 semanas após o início, no formato YYYY-MM-DD.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant', // Modelo recomendado e atualizado
      response_format: { type: 'json_object' },
    });

    const responseContent = JSON.parse(completion.choices[0].message.content);
    res.json(responseContent);
  } catch (error) {
    console.error('Erro ao chamar a API da Groq:', error);
    next(error); // Passa o erro para o middleware centralizado
  }
});

module.exports = router;