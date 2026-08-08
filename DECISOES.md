# Decisões Técnicas

Durante o desenvolvimento deste projeto, optamos por dar continuidade no projeto da matéria de Desenvolvimento Fullstack, que já possuía uma base sólida e stack simples e moderna.

No backend foi utilizado Node.js com Express, por oferecer facilidade na criação de APIs REST, organização por rotas e uma grande quantidade de bibliotecas disponíveis. A divisão das rotas em módulos separados (alunos, planos, matrículas, treinos, autenticação e IA) tornou o código mais organizado e facilitou o desenvolvimento em equipe.

Para o banco de dados escolhemos o SQLite por ser leve, dispensar a instalação de um servidor e permitir que toda a aplicação seja executada facilmente em qualquer computador apenas com o arquivo do banco. Essa decisão simplificou os testes e a demonstração do sistema.

No frontend foi utilizada uma Single Page Application (SPA) desenvolvida com HTML, CSS e JavaScript puro. Essa implementação permitiu ter um melhor controle da manipulação do DOM e da organização do código em módulos, sem depender de frameworks como React ou Vue.

A integração com Inteligência Artificial foi realizada com a API da Groq. Foi incluída a funcionalidade no sistema de elaboração de ficha de treino, onde são fornecidas para a IA os dados físicos do aluno que foram cadastrados na sua matrícula, e também o objetivo desejado que é informado durante a solicitação do treino. Com essas informações, a IA gera uma sugestão personalizada de treino.

Um dos principais aprendizados durante o desenvolvimento foi perceber que integrar uma IA vai muito além de realizar a chamada via API. Ter um prompt bem elaborado e direcionado é de extrema importância, pois no início tinhamos resultados diversos para o mesmo aluno e as vezes sugestões de treino incoerentes. Esta etapa de lapidação do prompt e definição da regra de negócio é fundamental para termos um retorno da IA com qualidade para um projeto em produção.

No geral, o projeto proporcionou uma experiência prática envolvendo desenvolvimento web, integração com IA, versionamento de código e boas práticas de engenharia de software.