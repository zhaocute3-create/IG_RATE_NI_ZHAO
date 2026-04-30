export async function handler(event) {

  const { followers, following, posts } = JSON.parse(event.body);

  const prompt = `
You are an AI Instagram account analyzer.

Analyze this account:

Followers: ${followers}
Following: ${following}
Posts: ${posts}

Rules:
- Allow zero values
- Give rating out of 10
- Give percentage score
- Give fake/real account likelihood
- Give short human explanation (friendly tone)
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENAI_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5.3",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      reply: data.choices[0].message.content
    })
  };
}
