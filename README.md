# Academia CRUD

Projeto de faculdade com três CRUDs:
- `Alunos`
- `Planos`
- `Matrículas`

## Estrutura

- `backend/`
  - `server.js` - servidor Express
  - `database.js` - inicialização do SQLite
  - `routes/` - rotas separadas para cada CRUD
- `frontend/`
  - `index.html` - interface principal com abas e dashboard
  - `css/style.css` - estilos modernos e responsivos
  - `js/` - lógica do frontend modular
  - `js/components/` - componentes separados para cada CRUD

## Como executar

1. Abra o terminal em `Desenvolvimento-Full-Stack/backend`.
2. Execute `npm install`.
3. Execute `npm start`.
4. Abra `http://localhost:3000` no navegador.

## Funcionalidades

- CRUD de alunos com nome, email, telefone, nascimento e senha
- CRUD de planos com duração e valor
- CRUD de matrículas com relacionamento entre alunos e planos
- CRUD de treinos vinculados à matrícula e ao aluno
- Área de login para aluno e administrador
- Frontend organizado em abas, componentes separados e painel administrativo
- Banco SQLite persistente
