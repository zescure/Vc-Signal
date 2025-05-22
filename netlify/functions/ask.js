const fetch = require("node-fetch");

const OPENROUTER_API_KEY = "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"; // ganti dengan key kamu yang aktif

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
        "HTTP-Referer": "https://vc-signalforex.netlify.app/", // wajib buat openrouter
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
