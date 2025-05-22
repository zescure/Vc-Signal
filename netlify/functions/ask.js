const fetch = require("node-fetch");

const OPENROUTER_API_KEY = "sk-or-xxxxxxx"; // Ganti dengan key lo

exports.handler = async function (event, context) {
  const q = event.queryStringParameters.q;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: q }],
      }),
    });

    const json = await res.json();
    const answer = json.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "⚠️ Gagal ambil jawaban dari OpenRouter." }),
    };
  }
};
