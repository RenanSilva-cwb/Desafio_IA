# Decisões Técnicas

Durante o desenvolvimento deste projeto, optamos por dar continuidade no projeto da matéria de Desenvolvimento Fullstack, que já possuía uma base sólida e stack simples e moderna.

No backend foi utilizado Node.js com Express, por oferecer facilidade na criação de APIs REST, organização por rotas e uma grande quantidade de bibliotecas disponíveis. A divisão das rotas em módulos separados (alunos, planos, matrículas, treinos, autenticação e IA) tornou o código mais organizado e facilitou o desenvolvimento em equipe.

Para o banco de dados escolhemos o SQLite por ser leve, dispensar a instalação de um servidor e permitir que toda a aplicação seja executada facilmente em qualquer computador apenas com o arquivo do banco. Essa decisão simplificou os testes e a demonstração do sistema.

Em um ambiente de produção, para aplicações com maior volume de dados ou necessidade de alta concorrência, seria considerada a migração para um banco de dados mais robusto como PostgreSQL ou MySQL. No entanto, para o escopo e a simplicidade deste projeto, o SQLite atende bem aos requisitos.

No frontend foi utilizada uma Single Page Application (SPA) desenvolvida com HTML, CSS e JavaScript puro. Essa implementação permitiu ter um melhor controle da manipulação do DOM e da organização do código em módulos, sem depender de frameworks como React ou Vue.

A integração com Inteligência Artificial foi realizada com a API da Groq. Foi incluída a funcionalidade no sistema de elaboração de ficha de treino, onde são fornecidas para a IA os dados físicos do aluno que foram cadastrados na sua matrícula, e também o objetivo desejado que é informado durante a solicitação do treino. Com essas informações, a IA gera uma sugestão personalizada de treino.

## Estratégia de Deploy e Produção

Para o deploy em produção, optamos por utilizar a plataforma Render. Essa escolha se deu pela sua facilidade de uso, suporte a Node.js e a capacidade de configurar variáveis de ambiente de forma segura, o que é crucial para gerenciar chaves de API (como a da Groq) e credenciais de administrador sem expô-las no código-fonte.

A aplicação utiliza um pipeline de Integração Contínua (CI) configurado via GitHub Actions (`ci.yml`). Este pipeline garante que o código do backend seja verificado quanto à sintaxe e dependências a cada push ou pull request na branch `main`, assegurando a qualidade e a estabilidade antes de qualquer deploy.

Em termos de segurança, além do controle de acesso baseado em roles (RBAC) e da criptografia de senhas com `bcrypt`, a aplicação implementa uma política de CORS restritiva, permitindo requisições apenas de origens conhecidas e seguras. As variáveis de ambiente sensíveis são carregadas via `.env` em desenvolvimento e gerenciadas diretamente pela plataforma de deploy em produção.

Para monitoramento e depuração em produção, o Express está configurado com um middleware centralizado de tratamento de erros, que registra detalhes no console do servidor. Em um cenário de maior escala, isso seria complementado por ferramentas de log e monitoramento de desempenho.

## Aprendizados e Desafios

Um dos principais aprendizados durante o desenvolvimento foi perceber que integrar uma IA vai muito além de realizar a chamada via API. Ter um prompt bem elaborado e direcionado é de extrema importância, pois no início tinhamos resultados diversos para o mesmo aluno e as vezes sugestões de treino incoerentes. Esta etapa de lapidação do prompt e definição da regra de negócio é fundamental para termos um retorno da IA com qualidade para um projeto em produção.

No geral, o projeto proporcionou uma experiência prática envolvendo desenvolvimento web, integração com IA, versionamento de código e boas práticas de engenharia de software.