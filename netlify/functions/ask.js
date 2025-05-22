fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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", // ganti sama key lo
  },
  body: JSON.stringify({
    model: "openai/gpt-3.5-turbo",
    messages: [{ role: "user", content: "Apa itu sejarah?" }],
  }),
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
