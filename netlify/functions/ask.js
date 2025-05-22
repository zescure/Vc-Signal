const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const params = new URLSearchParams(event.queryStringParameters);
  const pertanyaan = params.get('q');

  if (!pertanyaan) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Pertanyaan kosong!' })
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-or-v1-REPLACE-DENGAN-KEY-BARU', // Ganti dengan key yang baru dan aman
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openrouter/mistral-7b', // Model stabil dan umum
        messages: [
          { role: 'user', content: pertanyaan }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2)); // Untuk debug log di Netlify

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer: data.choices?.[0]?.message?.content || 'Jawaban tidak tersedia.'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Gagal ambil jawaban dari AI' })
    };
  }
};
