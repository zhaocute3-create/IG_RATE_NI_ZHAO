const fetch = require("node-fetch");

exports.handler = async (event) => {

  const { followers, following, posts } = JSON.parse(event.body);

  const prompt = `
Analyze Instagram profile:

Followers: ${followers}
Following: ${following}
Posts: ${posts}

Return ONLY JSON:

{
  "rating": "x/10",
  "percent": "xx%",
  "level": "cold/warm/viral",
  "botScore": 0-100,
  "explanation": "human-like short analysis"
}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();

  let text = data.choices[0].message.content;

  let result;

  try {
    result = JSON.parse(text);
  } catch {
    result = {
      rating: "7/10",
      percent: "70%",
      level: "warm",
      botScore: 40,
      explanation: text
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
