exports.handler = async (event) => {
  const { followers, following, posts } = JSON.parse(event.body);

  const prompt = `
You are an Instagram analytics AI.

Analyze:

Followers: ${followers}
Following: ${following}
Posts: ${posts}

IMPORTANT FORMAT:
Return EXACT JSON ONLY (no text outside):

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
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();

  const text = data.choices?.[0]?.message?.content || "";

  return {
    statusCode: 200,
    body: JSON.stringify({
      rating: extractRating(text),
      percent: extractPercent(text),
      explanation: text
    })
  };
};

function extractRating(text) {
  const match = text.match(/(\d(\.\d)?)\/10/);
  return match ? match[1] : 7;
}

function extractPercent(text) {
  const match = text.match(/(\d{1,3})%/);
  return match ? match[1] : 70;
}
