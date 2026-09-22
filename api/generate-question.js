// Vercel Function: gera 3 perguntas novas para o quiz.
// A chave OPENAI_API_KEY fica somente nas Environment Variables da Vercel.

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY não configurada na Vercel." });
  }

  try {
    const body = req.body || {};
    const subject = String(body.subject || "").slice(0, 80);
    const topic = String(body.topic || "").slice(0, 120);
    const level = Number(body.level || 1);
    const previousQuestions = Array.isArray(body.previousQuestions)
      ? body.previousQuestions.map(String).slice(-15)
      : [];

    if (!subject || !topic) {
      return res.status(400).json({ error: "Matéria e tema são obrigatórios." });
    }

    const difficulty =
      level <= 3 ? "fácil" :
      level <= 6 ? "média" : "difícil";

    const previousBlock = previousQuestions.length
      ? `\nNão repita estas perguntas já usadas recentemente:\n- ${previousQuestions.join("\n- ")}`
      : "";

    const prompt = `
Você é o gerador de questões do projeto educacional infantil "Aprender para Jogar".
Crie exatamente 3 questões de múltipla escolha em português do Brasil.

Matéria: ${subject}
Tema: ${topic}
Nível: ${level} de 10
Dificuldade desejada: ${difficulty}

Regras:
- Adeque o conteúdo a crianças/adolescentes em idade escolar.
- Seja educativo, claro e interessante.
- Evite perguntas bobas, genéricas ou repetitivas.
- Use situações, exemplos e raciocínio quando fizer sentido.
- Cada questão deve ter exatamente 4 alternativas.
- Apenas uma alternativa pode ser correta.
- A posição da resposta correta deve variar entre as questões.
- Não revele a resposta dentro do enunciado.
- Inclua uma explicação curta e didática para a resposta correta.
- Não invente fatos específicos quando a questão depender de conhecimento factual.
- Não use conteúdo impróprio para menores.
${previousBlock}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        store: false,
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "quiz_questions",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                questions: {
                  type: "array",
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      question: { type: "string" },
                      options: {
                        type: "array",
                        minItems: 4,
                        maxItems: 4,
                        items: { type: "string" }
                      },
                      correctAnswer: {
                        type: "integer",
                        minimum: 0,
                        maximum: 3
                      },
                      explanation: { type: "string" }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  }
                }
              },
              required: ["questions"]
            }
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(502).json({
        error: "A IA não conseguiu gerar as perguntas agora.",
        details: data?.error?.message || "Erro da API."
      });
    }

    const outputText = (data.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("");

    if (!outputText) {
      return res.status(502).json({ error: "A IA retornou uma resposta vazia." });
    }

    const parsed = JSON.parse(outputText);

    if (!parsed.questions || parsed.questions.length !== 3) {
      return res.status(502).json({ error: "A IA não retornou três questões válidas." });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Não foi possível gerar as perguntas.",
      details: error.message
    });
  }
};
