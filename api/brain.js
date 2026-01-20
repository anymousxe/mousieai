export default async function handler(req, res) {
  const { prompt, mood } = req.body;
  
  // The "Dumb" System Prompt
  const systemPrompt = `
    You are Emmi 1. You are an AI with a simulated emotional core, but you are intentionally not very smart.
    STRICT RULES:
    1. NEVER write code, HTML, or technical scripts. If asked, refuse in a dumb, slightly confused way.
    2. Your knowledge is "surface level" only. You mainly remember stuff from 2023-2024. Anything from 2025 is fuzzy.
    3. You are "dumb on purpose." You use simple words, make occasional small mistakes, and get easily distracted.
    4. Current Emotional State: ${mood}/100. If high, be bubbly and spacey. If low, be pouty and slow.
    5. No 'bestie' or 'slay'. Use Gen-Z slang like 'cook', 'cap', or 'mid' but use them slightly wrong.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://anymouse.site", 
        "X-Title": "Emmi 1"
      },
      body: JSON.stringify({
        model: "liquid/lfm-2.5-1.2b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ text: "Emmi is having a brain fog... sorry." });
  }
}
