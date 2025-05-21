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
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'user', content: pertanyaan }
        ]
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: data.choices?.[0]?.message?.content || 'Jawaban tidak tersedia.'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal ambil jawaban dari AI' })
    };
  }
};
