const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const question = event.queryStringParameters?.q;

  if (!question) {
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
        model: 'openrouter/mistral-7b',
        messages: [{ role: 'user', content: question }],
        temperature: 0.7
      })
    });

    const data = await response.json();

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
