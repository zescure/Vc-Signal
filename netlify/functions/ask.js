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
        'Authorization': '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',
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
