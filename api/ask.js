export default async function handler(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Pertanyaan kosong!' });
  }

  try {
    const duckURL = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(duckURL);
    const data = await response.json();

    res.status(200).json({
      answer: data.AbstractText || 'Tidak ditemukan jawaban pasti.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal ambil data DuckDuckGo' });
  }
}
