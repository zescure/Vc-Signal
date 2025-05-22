const fetch = require("node-fetch");

const OPENROUTER_API_KEY = "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";

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
        "HTTP-Referer": "https://vc-signalforex.netlify.app/",
        "X-Title": "LionorAI",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:free",
        messages: [
          {
            role: "system",
            content: "Kamu adalah Lionor AI, asisten pribadi yang ramah dan informatif untuk King Zezy."
          },
          { role: "user", content: q }
        ],
      }),
    });

    const data = await response.json();
console.log("RESPON OPENROUTER:", JSON.stringify(data));

    // Cek isi respon model
    const jawaban =
      data?.choices?.[0]?.message?.content ||
      data?.message ||
      "⚠️ Gagal dapet respon dari model.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: jawaban }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: `⚠️ Error backend: ${error.message}` }),
    };
  }
};
