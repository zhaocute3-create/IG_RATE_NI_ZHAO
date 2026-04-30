exports.handler = async (event) => {
  try {
    const { followers, following, posts } = JSON.parse(event.body);

    const prompt = `
You are an Instagram analytics AI.

Followers: ${followers}
Following: ${following}
Posts: ${posts}

Return ONLY valid JSON:
{
  "rating": "X/10",
  "percent": "XX%",
  "explanation": "short explanation"
}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      })
    });

    const data = await response.json();

    let text = data.choices?.[0]?.message?.content || "";

    // SAFE PARSE (no crash)
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      result = {
        rating: "7/10",
        percent: "70%",
        explanation: text || "Unable to parse AI response"
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        message: err.message
      })
    };
  }
};
