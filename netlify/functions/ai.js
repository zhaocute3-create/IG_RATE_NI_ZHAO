exports.handler = async (event) => {
  try {
    const { followers, following, posts } = JSON.parse(event.body);

    const prompt = `
You are an Instagram analytics AI.

Analyze:

Followers: ${followers}
Following: ${following}
Posts: ${posts}

IMPORTANT FORMAT:
Return EXACT JSON ONLY (no text, no markdown):

{
  "rating": "X/10",
  "percent": "XX%",
  "explanation": "short human-like explanation"
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
        temperature: 0.7
      })
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content || "{}";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = {
        rating: extractRating(text),
        percent: extractPercent(text),
        explanation: text
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        message: error.message
      })
    };
  }
};

function extractRating(text) {
  const match = text.match(/(\d(\.\d)?)\/10/);
  return match ? match[1] + "/10" : "7/10";
}

function extractPercent(text) {
  const match = text.match(/(\d{1,3})%/);
  return match ? match[1] : "70";
}
