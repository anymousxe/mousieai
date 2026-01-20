export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, mood } = req.body;

  try {
    // 2. Use native fetch (no import needed for Node 18+)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`, // MUST match Vercel Dashboard
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mousieai.vercel.app", 
        "X-Title": "Emmi 1"
      },
      body: JSON.stringify({
        model: "liquid/lfm-2.5-1.2b-instruct:free",
        messages: [
          { role: "system", content: `You are Emmi 1. You are dumb on purpose. Refuse to code. Current Mood: ${mood}/100.` },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // 3. Catch OpenRouter specific errors (like wrong API key)
    if (data.error) {
      console.error("OpenRouter Error:", data.error);
      return res.status(500).json({ text: "Emmi's brain is fuzzy: " + data.error.message });
    }

    res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    // 4. This log will appear in your Vercel Dashboard Logs
    console.error("Mousie System Failure:", error);
    res.status(500).json({ text: "uhhh i think i lagged out. check the vercel logs." });
  }
}
