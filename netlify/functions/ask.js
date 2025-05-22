const fetch = require('node-fetch');

exports.handler = async (event) => {
  const params = new URLSearchParams(event.queryStringParameters);
  const pertanyaan = params.get('q');

  if (!pertanyaan) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Pertanyaan kosong!' }),
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: pertanyaan }],
      })
    });

    const text = await response.text();
    console.log("API Response Raw:", text); // log ke Netlify
    const data = JSON.parse(text);

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: data.choices?.[0]?.message?.content || 'Jawaban tidak tersedia.'
      }),
    };
  } catch (error) {
    console.log("Fetch error:", error); // log error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal ambil jawaban dari AI' }),
    };
  }
};
