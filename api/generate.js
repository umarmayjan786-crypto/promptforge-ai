export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { platform,category, topic } = req.body;

    const prompt = `
You are an expert AI Prompt Engineer.

Create one professional English prompt for ${platform}.
Category:
${category}

User Idea:
${topic}

If the user writes in Urdu or Roman Urdu, first understand it and then convert it into a detailed professional English AI prompt.

Return ONLY the final prompt.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}