const fetch = require("node-fetch");

const API_KEY = "aph0_CkgwRgIhAODq57ckcQu2omaNY6bLqQ2jo3p3rBD3mppXJ4_LtAUjAiEAhGd3XlOOBOCkJL5Qi4daB7voPIkE8Hn6uKWtm5rnJWsSYxIgEnVpXp1GkCXEAx1FeZvUWxQdHBaA979aufpvo-dlBs4YASIedXNyX3dxeWJ5cnE0NmNla3R6YzFiemt0eW5wN3hmOgwIh42coRIQoIqRxwNCDAjbzrvBBhCgipHHA_IBAA";

exports.handler = async function (event, context) {
  const q = event.queryStringParameters.q || "";

  if (!q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ answer: "❌ Pertanyaan kosong." }),
    };
  }

  try {
    const response = await fetch("https://api.endpoints.anyscale.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // ganti sesuai model kamu
        messages: [
          {
            role: "user",
            content: q,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        statusCode: 500,
        body: JSON.stringify({ answer: "⚠️ Gagal dapet respon dari model." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.choices[0].message.content }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "⚠️ Terjadi kesalahan saat menghubungi API: " + error.message }),
    };
  }
};
