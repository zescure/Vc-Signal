const fetch = require("node-fetch");

const OPENROUTER_API_KEY = "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"; // key yang udah lo pake

exports.handler = async function (event, context) {
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
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // model GRATIS
        messages: [{ role: "user", content: q }],
      }),
    });

    const data = await response.json();

    const answer = data?.choices?.[0]?.message?.content || "❌ Gagal dapet respon dari model.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: `⚠️ Error: ${error.message}` }),
    };
  }
};
