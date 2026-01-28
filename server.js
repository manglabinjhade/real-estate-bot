let replyText = "";

const userMsg = body.entry[0].changes[0].value.messages[0].text.body.toLowerCase();

if (userMsg.includes("hi") || userMsg.includes("hello")) {
  replyText = "Welcome to Real Estate Agent 🏡\n\nSabse pehle bataye:\n💰 Aapka budget kya hai?";
} else if (userMsg.match(/\d/)) {
  replyText = "Great 👍\n📍 Kaunsi location me property chahiye?";
} else if (userMsg.includes("pune") || userMsg.includes("mumbai") || userMsg.includes("delhi")) {
  replyText = "Perfect 📍\n🏠 Aapko kya chahiye?\n1️⃣ Flat\n2️⃣ Plot\n3️⃣ Villa";
} else {
  replyText = "Thanks for the details! 🙌\nHamari team aapse jaldi contact karegi.";
}

await axios.post(
  `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
  {
    messaging_product: "whatsapp",
    to: from,
    text: { body: replyText }
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    }
  }
);
