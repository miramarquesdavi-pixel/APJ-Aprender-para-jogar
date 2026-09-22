APRENDER PARA JOGAR — versão com IA

O que mudou:
- As atividades agora pedem 3 questões novas à IA ao iniciar um nível.
- A IA recebe matéria, tema, nível e um histórico recente para reduzir repetições.
- Cada questão tem 4 alternativas, uma resposta correta e uma explicação.
- O XP continua sendo contabilizado no navegador.
- Se a IA estiver indisponível, o jogo usa as perguntas locais como fallback.
- A chave da OpenAI NÃO fica no JavaScript do navegador.

Estrutura:
- index.html
- style.css
- script.js
- api/generate-question.js

Configuração na Vercel:
1. Crie a variável de ambiente OPENAI_API_KEY.
2. Depois de salvar/alterar uma variável de ambiente, faça um novo deploy para que a função receba a configuração.
3. Não publique a chave em index.html, script.js, GitHub ou README.

O endpoint usa a Responses API e Structured Outputs para pedir à IA uma estrutura JSON previsível.

Teste local:
- A função /api/generate-question precisa ser executada por um ambiente compatível com Vercel Functions.
- Ao abrir apenas index.html via file://, a chamada /api não funcionará; isso é esperado.
