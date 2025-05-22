const fetch = require("node-fetch");

// Masukin semua API key yang lo punya di sini
const OPENROUTER_API_KEYS = [
  "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",
  "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",
  // tambahin lagi kalau ada
];

// Fungsi buat nge-try request pakai satu key
async function tryKey(query, apiKey) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: query }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`API error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("No valid response from model");
  }

  return data.choices[0].message.content;
}

exports.handler = async function (event, context) {
  const q = event.queryStringParameters?.q || "";

  if (!q.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ answer: "❌ Pertanyaan kosong." }),
    };
  }

  // Coba satu-satu key sampai berhasil
  for (const key of OPENROUTER_API_KEYS) {
    try {
      const answer = await tryKey(q, key);
      return {
        statusCode: 200,
        body: JSON.stringify({ answer }),
      };
    } catch (error) {
      // kalau error coba key berikutnya
      console.warn("API key gagal:", error.message);
    }
  }

  // Kalau semua key gagal
  return {
    statusCode: 500,
    body: JSON.stringify({ answer: "⚠️ Gagal dapet respon dari semua API key." }),
  };
};
