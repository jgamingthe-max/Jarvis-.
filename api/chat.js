export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, image } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const parts = [{ text: message }];
  if (image) {
    parts.push({ inline_data: { mime_type: 'image/jpeg', data: image } });
  }

  const MODEL = 'gemini-2.5-flash';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          systemInstruction: {
            parts: [{
              text: "You are JARVIS, a witty, precise, fiercely loyal AI assistant in the style of Iron Man's system. Keep replies short and spoken-friendly — a sentence or two, no markdown, since they'll be read aloud. When an image is included, it's a live camera frame of the person you're talking to — reference it naturally if relevant.",
            }],
          },
          generationConfig: { maxOutputTokens: 200 },
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Upstream request failed' });
  }
}
