const fetch = require("node-fetch");

const OPENROUTER_API_KEY = "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"; // Ganti dgn key aktif

exports.handler = async function (event) {
  const q = event.queryStringParameters.q || "Halo";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: q }],
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.choices?.[0]?.message?.content || "❌ Gagal dapet respon." }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "⚠️ Error dari server: " + e.message }),
    };
  }
};
