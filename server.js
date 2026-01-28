const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// 🔐 Webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "my_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 💬 Message handling
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const phone_number_id =
        body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = body.entry[0].changes[0].value.messages[0].from;
      const userMsg =
        body.entry[0].changes[0].value.messages[0].text.body.toLowerCase();

      let replyText = "";

      if (userMsg === "hi" || userMsg === "hello") {
        replyText =
          "Hi 👋\nThanks for contacting us.\n\n1️⃣ Buy Property\n2️⃣ Rent Property\n\nReply with 1 or 2";
      } else if (userMsg === "1") {
        replyText = "Great! 🏡\n💰 What is your budget?";
      } else if (userMsg === "2") {
        replyText = "Nice 👍\n📍 Which location are you looking to rent in?";
      } else if (userMsg.match(/\d/)) {
        replyText = "Got it 👍\n📍 Which location do you prefer?";
      } else if (
        userMsg.includes("pune") ||
        userMsg.includes("mumbai") ||
        userMsg.includes("delhi") ||
        userMsg.includes("bangalore")
      ) {
        replyText =
          "Perfect 📍\n🏠 What type of property?\n1️⃣ Flat\n2️⃣ Plot\n3️⃣ Villa";
      } else if (
        userMsg.includes("flat") ||
        userMsg.includes("plot") ||
        userMsg.includes("villa")
      ) {
        replyText =
          "Thanks for sharing details 🙌\nOur property expert will contact you shortly 📞";
      } else {
        replyText =
          "Please share the details so I can help you better 🏡";
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
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 🌐 Home
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
