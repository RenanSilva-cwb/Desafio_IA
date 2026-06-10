# Academia CRUD

Projeto desenvolvido para a disciplina de Engenharia de Software. Consiste em uma aplicação Single Page Application (SPA) reativa com controle de acesso e quatro CRUDs interligados:
- `Alunos`
- `Planos`
- `Matrículas`
- `Treinos`

## Estrutura do Projeto

- `backend/`
  - `server.js`: Servidor Node.js com Express
  - `database.js`: Inicialização e conexão com o SQLite
  - `routes/`: Rotas da API RESTful modularizadas por domínio
  - `academia.db`: Banco de dados pré-populado para testes e avaliação
- `frontend/`
  - `index.html`: Interface principal estruturada em abas e painéis
  - `css/style.css`: Estilização moderna, responsiva e baseada em variáveis CSS
  - `js/app.js`: Arquitetura orientada a eventos (`CustomEvent`) para reatividade
  - `js/components/`: Módulos independentes para cada domínio (alunos, planos, treinos, matriculas)
  - `js/auth.js`: Gerenciamento de sessão (Admin vs Aluno)

## Como executar

1. Abra o terminal na pasta `backend` (`Desenvolvimento-Full-Stack/backend`).
2. Execute o comando `npm install` para instalar as dependências.
3. Execute `npm start` para rodar o servidor.
4. Abra `http://localhost:3000` no seu navegador.

## Funcionalidades e Arquitetura

- **Controle de Acesso (RBAC):** Visões distintas e renderização condicional baseada na role do usuário (Administrador possui acesso total, Aluno possui acesso apenas à visualização de seus treinos).
- **Interface Reativa:** Uso de eventos globais para atualizar o dashboard e as listagens simultaneamente após qualquer ação de inserção, edição ou exclusão.
- **Gestão de Alunos:** Cadastro contendo nome, email, telefone, data de nascimento e senha de acesso.
- **Gestão de Planos:** Definição de pacotes com duração em meses e valor.
- **Gestão de Matrículas:** Relacionamento ativo entre alunos cadastrados e planos disponíveis.
- **Gestão de Treinos:** Criação de fichas de exercícios vinculadas à matrícula e acessíveis para visualização pelo aluno.
- **Armazenamento:** Persistência de dados utilizando SQLite.