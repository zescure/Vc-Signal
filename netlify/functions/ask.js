export async function handler(event) {
  try {
    const question = event.queryStringParameters?.q || "";

    if (!question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ answer: "Pertanyaan kosong!" })
      };
    }

    const part1 = "sk-or-v1-78bf96bede";
    const part2 = "eb5d66bcf2a86dae26";
    const part3 = "90e812c24d93c6ef75b97ffb03423da31933";
    const apiKey = part1 + part2 + part3;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/cinematika-7b",
        messages: [{ role: "user", content: question }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        answer: data.choices?.[0]?.message?.content || "Gagal dapetin jawaban dari AI."
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        answer: "Error: " + err.message
      })
    };
  }
}
