const fetch = require("node-fetch");

const GROQ_API_KEY = "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";

exports.handler = async function (event, context) {
  const q = event.queryStringParameters.q || "";

  if (!q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ answer: "❌ Pertanyaan kosong." }),
    };
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
  model: "model":"llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content:
        "Kamu adalah Lionor AI, asisten digital yang ramah dan pintar dari Indonesia. Jawablah semua pertanyaan dalam bahasa Indonesia yang jelas, sopan, dan mudah dipahami. Jangan gunakan bahasa Inggris kecuali diminta oleh user.",
    },
    {
      role: "user",
      content: q,
    },
  ],
}),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        statusCode: 500,
        body: JSON.stringify({ answer: "⚠️ Gagal dapet respon dari model." }),
      };
    }

    const answer = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: `⚠️ Terjadi kesalahan saat menghubungi API: ${error.message}` }),
    };
  }
};
