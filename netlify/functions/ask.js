// netlify/functions/ask.js
// Menangani mode & model dari queryStringParameters
const fetch = require("node-fetch");

const GROQ_API_KEY = "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";

exports.handler = async function (event, context) {
  const q = (event && event.queryStringParameters && event.queryStringParameters.q) || "";
  const mode = (event && event.queryStringParameters && event.queryStringParameters.mode) || "normal";
  const modelChoice = (event && event.queryStringParameters && event.queryStringParameters.model) || "llama-3.3-70b";

  if (!q) {
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: "❌ Pertanyaan kosong." }),
    };
  }

  // mapping modelChoice ke identifier yang dipakai di Groq (ubah mapping kalau perlu)
  const MODEL_MAP = {
    "llama-3.3-70b": "llama-3.3-70b-versatile",
    "llama-3-small": "llama-3-small",
    "whisper-large-v3-turbo": "gpt-4o-mini", // contoh mapping; sesuaikan kalau provider beda
  };

  const selectedModel = MODEL_MAP[modelChoice] || MODEL_MAP["llama-3.3-70b"];

  // mapping mode ke system prompt (sesuaikan tone dan instruksi)
  const MODE_PROMPTS = {
    normal: "Kamu adalah Lionor AI, asisten digital ramah dari Indonesia. Jawablah singkat tapi jelas dalam bahasa Indonesia. Gunakan nada santai dan membantu. Jangan menulis panjang kecuali diminta.",
    deep: "Kamu adalah Lionor AI versi Deep Research: berikan jawaban mendalam, terstruktur, beri referensi bila memungkinkan, analisis langkah demi langkah, dan sertakan ringkasan singkat di akhir. Gunakan bahasa Indonesia formal tapi tetap mudah dipahami.",
    analisis: "Kamu adalah Lionor AI versi Analisis: fokus pada analisis, jelaskan pro dan kontra, tunjukkan asumsi yang dibuat, dan beri rekomendasi berdasarkan data/rasional. Gunakan bahasa Indonesia.\nJangan bertele-tele.",
    tothepoint: "Kamu adalah Lionor AI versi ToThePoint: jawaban singkat, jelas, hanya inti (1-3 kalimat). Gunakan bahasa Indonesia.",
  };

  const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS["normal"];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: q,
          },
        ],
        // optional: atur temperature/other params sesuai mode jika mau
        ...(mode === "deep" ? { temperature: 0.2, max_tokens: 2000 } : {}),
        ...(mode === "analisis" ? { temperature: 0.25, max_tokens: 1500 } : {}),
        ...(mode === "tothepoint" ? { temperature: 0.0, max_tokens: 250 } : {}),
      }),
    });

    const rawText = await response.text().catch(() => null);
    let data = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      data = null;
    }

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
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: `⚠️ Terjadi kesalahan saat menghubungi API: ${error.message}` }),
    };
  }
};
