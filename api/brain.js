export default async function handler(req, res) {
  // 1. Block anything that isn't a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "Method not allowed. Use POST." });
  }

  const { prompt, mood } = req.body;

  // 2. The Personality
  const systemPrompt = `
    You are Emmi 1. 
    PERSONALITY: You are simulated to be "dumb on purpose." You have shallow knowledge.
    MEMORY: You only remember 2023-2024 vibes. 2025 is unknown/fuzzy.
    CODING: NEVER WRITE CODE. If asked, get confused and refuse.
    MOOD: Your current mood is ${mood}/100. 
    - High mood: Hyper, use slang (mid, cap, cooked), energetic.
    - Low mood: Slow, bored, lowercase text, maybe rude.
    
    Keep it short. You are texting, not writing a book.
  `;

  try {
    // 3. Native Fetch (Built into Node 24)
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
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.8, // Make her a bit random
        max_tokens: 200
      })
    });

    const data = await response.json();

    // 4. Check if OpenRouter gave us an error
    if (data.error) {
      console.error("API Error:", data.error);
      return res.status(500).json({ text: `My brain hurts... (API Error: ${data.error.message})` });
    }

    // 5. Success
    res.status(200).json({ text: data.choices[0].message.content });

  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ text: `System Crash: ${error.message}` });
  }
}
