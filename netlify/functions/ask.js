export async function handler(event, context) {
  const body = JSON.parse(event.body);
  const question = body.question;

  // 🔒 API key disembunyiin dikit
  const part1 = "sk-or-v1-78bf96bede";
  const part2 = "eb5d66bcf2a86dae26";  // ganti bagian tengah key lo
  const part3 = "90e812c24d93c6ef75b97ffb03423da31933";  // ganti bagian akhir key lo
  const apiKey = part1 + part2 + part3;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions"), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://lionor.netlify.app",
      "X-Title": "Lionor AI"
    },
    body: JSON.stringify({
      model: "openrouter/cinematika-7b", // atau model gratis lain
      messages: [{ role: "user", content: question }],
      temperature: 0.7
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      answer: data.choices?.[0]?.message?.content || "Gagal dapetin jawaban dari AI."
    })
  };
}
