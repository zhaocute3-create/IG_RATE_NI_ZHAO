async function rateAccount() {
  const followers = Number(document.getElementById("followers").value) || 0;
  const following = Number(document.getElementById("following").value) || 0;
  const posts = Number(document.getElementById("posts").value) || 0;

  const resultBox = document.getElementById("result");

  resultBox.innerHTML = "⏳ AI analyzing...";

  try {
    const res = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followers, following, posts })
    });

    const data = await res.json();

    resultBox.innerHTML = `
      ⭐ Rating: ${data.rating}/10 <br>
      📊 ${data.percent}% <br><br>
      🧠 ${data.explanation}
    `;

  } catch (err) {
    resultBox.innerHTML = "❌ Error AI";
    console.log(err);
  }
}
