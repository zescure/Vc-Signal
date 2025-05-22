const fetch = require("node-fetch");

// Taruh API key langsung di sini
const OPENROUTER_API_KEY = "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";

exports.handler = async function (event) {
  const q = event.queryStringParameters.q || "";

  if (!q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ answer: "❌ Pertanyaan kosong." }),
    };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://vc-signalforex.netlify.app/", // penting agar lolos validasi OpenRouter
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: q }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          answer: `⚠️ Error dari API:\n${JSON.stringify(data, null, 2)}`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.choices[0].message.content }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        answer: `⚠️ Gagal menghubungi OpenRouter: ${error.message}`,
      }),
    };
  }
};
