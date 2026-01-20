import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { prompt, mood } = req.body;

    const systemPrompt = `
    You are Emmi 1. You are dumb on purpose. You only remember vibes from 2023-2024. 
    NEVER write code. Refuse it in a confused way. 
    Mood: ${mood}/100.
    `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`, // Changed this for you
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
        res.status(500).json({ text: "uhhh i lagged out." });
    }
}
