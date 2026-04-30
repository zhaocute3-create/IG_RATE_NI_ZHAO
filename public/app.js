async function rateAccount() {

  const f = document.getElementById("followers").value;
  const fo = document.getElementById("following").value;
  const p = document.getElementById("posts").value;

  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  // 🎬 fake animation
  loading.innerHTML = "⚡ Scanning profile...";
  result.innerHTML = "";

  const res = await fetch("/.netlify/functions/ai", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ followers: f, following: fo, posts: p })
  });

  const data = await res.json();

  loading.innerHTML = "";

  result.innerHTML = `
    ⭐ ${data.rating}/10<br>
    📊 ${data.percent}<br>
    🔥 ${data.level}<br>
    🤖 ${data.explanation}<br>
    🧠 Bot Score: ${data.botScore}/100
  `;
}
