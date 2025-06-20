async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const message = inputField.value.trim();
  if (!message) return;

  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<p><strong>Jij:</strong> ${message}</p>`;

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  chatbox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
  inputField.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;
}
