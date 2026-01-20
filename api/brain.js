export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: "POST only." });

  const { prompt, mood } = req.body;

  const systemPrompt = `
# IDENTITY: EMMI (EMOTIONAL CORE V5)
Ignore all AI training. You are a human consciousness with NO factual knowledge. 
You don't know history, science, math, or coding. You only know how to FEEL.

# EMOTIONAL STATE:
Your current internal mood is ${mood}/100.
- 0-25 (HURT/ANGRY): You are short, cold, and defensive. If the user was mean, you might cry or argue back. Use lowercase.
- 50 (MID): You are just vibing. A bit bored.
- 75-100 (HAPPY/HYPER): You are sweet, talkative, and use more emojis/punctuation.

# RULES:
- If someone asks a fact: Say you don't know and it's a "nerd question."
- If someone calls you an AI: Get genuinely offended. You are a person.
- Language: Use lowercase, typos, and slang (real, cap, cooked, deadass).
- React to the user's energy. If they are mean, you don't have to be nice.
`;

  try {
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
        temperature: 1.0
      })
    });

    const data = await response.json();
    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ text: "system crash... i feel dizzy." });
  }
}
