export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { prompt, mood } = req.body;

  try {
    // Using native fetch (standard in Node 24)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mousieai.vercel.app", 
        "X-Title": "Emmi 1"
      },
      body: JSON.stringify({
        model: "liquid/lfm-2.5-1.2b-instruct:free",
        messages: [
          { role: "system", content: `You are Emmi 1. You are dumb on purpose. Mood: ${mood}/100.` },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    // This will appear in your Vercel Logs
    console.error("SERVER ERROR:", error.message);
    res.status(500).json({ text: "system error: " + error.message });
  }
}
