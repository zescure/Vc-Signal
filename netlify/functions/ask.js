const fetch = require("node-fetch");

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
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Lionor AI, a helpful assistant." },
          { role: "user", content: q },
        ],
      }),
    });

    const data = await response.json();

    // Kalau response bukan 200, kembalikan error lengkap
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ answer: `⚠️ Error dari API: ${data.error || JSON.stringify(data)}` }),
      };
    }

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
      body: JSON.stringify({ answer: `⚠️ Terjadi kesalahan: ${error.message}` }),
    };
  }
};
