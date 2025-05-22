const fetch = require("node-fetch");

const OPENROUTER_API_KEY = "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"; // Ganti dengan API key lo

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
        "HTTP-Referer": "https://vc-signalforex.netlify.app/",
        "X-Title": "VC SignalForex Bot"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: q }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ answer: `⚠️ Error dari API:\n${JSON.stringify(data.error, null, 2)}` }),
      };
    }

    const answer = data?.choices?.[0]?.message?.content || "❌ Gagal dapet respon dari model.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: `⚠️ Gagal kirim ke model:\n${error.message}` }),
    };
  }
};
