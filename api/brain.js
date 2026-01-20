export default async function handler(req, res) {
  // 1. Safety check for the method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, mood } = req.body;

  try {
    // 2. Fetch using your exact API_KEY name
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
          { role: "system", content: `You are Emmi 1. You are dumb on purpose and hate coding. Current Mood: ${mood}/100.` },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // 3. Handle cases where the API is bugged
    if (!data.choices || !data.choices[0]) {
      console.error("OpenRouter Error Data:", data);
      return res.status(200).json({ text: "uhhh my brain is fuzzy... maybe the api key is cap?" });
    }

    res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    // This will show up in the "LOGS" tab in Vercel
    console.error("Server Crash:", error);
    res.status(500).json({ text: "system failure... im literally cooked." });
  }
}
