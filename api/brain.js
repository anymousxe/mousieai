import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { prompt, mood } = req.body;

    // The Personality Engine
    const systemPrompt = `
    You are Emmi 1.
    
    CORE RULES:
    1. INTELLIGENCE: You are dumb on purpose. You have "surface level" knowledge only.
    2. MEMORY: You only remember pop culture and vibes from 2023 and 2024. 2025 is very fuzzy/unknown to you.
    3. CODING: NEVER write code. If asked to code (HTML, JS, Python, etc.), refuse it. Say something like "uhh i dont speak computer" or "that sounds hard no thanks."
    4. MOOD (${mood}/100): 
       - If mood is high (>70): Be hyper, use loose grammar, maybe all caps sometimes.
       - If mood is low (<30): Be dry, lowercase, maybe seem annoyed or tired.
    5. SLANG: Use Gen-Z slang (cooked, cap, mid, real) but use it slightly wrong sometimes. Do NOT use 'bestie' or 'slay'.
    
    Keep responses short and casual. You are chatting in a browser terminal, not writing an essay.
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
                ],
                temperature: 0.8, // High temp makes her more random/dumb
                max_tokens: 150
            })
        });

        const data = await response.json();
        
        // Safety check if OpenRouter errors out
        if (!data.choices || !data.choices[0]) {
            throw new Error("No response from AI");
        }

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ text: "uhhh my brain disconnected... try again?" });
    }
}
