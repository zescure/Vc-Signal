// netlify/functions/ask.js
// Versi perbaikan — menampung berbagai jenis error dan selalu mengembalikan field { answer: "..." }
// NOTE: lo minta tetap pake hardcoded key, jadi gue pertahankan. Nanti kalau mau, kita pindahin ke env var.

const fetch = require("node-fetch");

const GROQ_API_KEY = "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";

exports.handler = async function (event, context) {
  const q = (event && event.queryStringParameters && event.queryStringParameters.q) || "";

  if (!q) {
    return {
      statusCode: 200,
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
        model: "llama-3.3-70b-versatile",
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

    // baca sebagai text dulu (aman kalau response bukan JSON)
    const rawText = await response.text().catch(() => null);
    let data = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      data = null;
    }

    // jika response non-OK -> kembalikan pesan error yang jelas ke UI
    if (!response.ok) {
      const apiMsg =
        (data && (data.error?.message || data.message)) ||
        rawText ||
        response.statusText ||
        `HTTP ${response.status}`;
      return {
        statusCode: 200,
        body: JSON.stringify({ answer: `⚠️ API error (${response.status}): ${apiMsg}` }),
      };
    }

    // sukses -> ambil jawaban
    const answer =
      (data && data.choices && data.choices[0] && (data.choices[0].message?.content || data.choices[0].text)) ||
      null;

    if (!answer) {
      const summary = data ? JSON.stringify(data).slice(0, 800) : (rawText || "Empty response");
      return {
        statusCode: 200,
        body: JSON.stringify({
          answer: `⚠️ Gagal dapet respon dari model (format tak terduga). Response: ${summary}`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    // network / runtime error
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: `⚠️ Terjadi kesalahan saat menghubungi API: ${error.message}` }),
    };
  }
};
