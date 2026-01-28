// 💬 Receive & Auto Reply Logic
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

      // STEP 1
      if (userMsg === "hi" || userMsg === "hello") {
        replyText =
          "Hi 👋\nThanks for contacting us.\n\n1️⃣ Buy Property\n2️⃣ Rent Property\n\nReply with 1 or 2";
      }

      // STEP 2
      else if (userMsg === "1") {
        replyText =
          "Great! 🏡\n💰 What is your budget?";
      }

      else if (userMsg === "2") {
        replyText =
          "Nice 👍\n📍 Which location are you looking to rent in?";
      }

      // STEP 3 (Budget detected)
      else if (userMsg.match(/\d/)) {
        replyText =
          "Got it 👍\n📍 Which location do you prefer?";
      }

      // STEP 4 (Location detected)
      else if (
        userMsg.includes("pune") ||
        userMsg.includes("mumbai") ||
        userMsg.includes("delhi") ||
        userMsg.includes("bangalore")
      ) {
        replyText =
          "Perfect 📍\n🏠 What type of property?\n1️⃣ Flat\n\n2️⃣ Plot\n\n3️⃣ Villa";
      }

      // STEP 5 (Property type)
      else if (
        userMsg === "flat" ||
        userMsg === "plot" ||
        userMsg === "villa" ||
        userMsg === "1️⃣" ||
        userMsg === "2️⃣" ||
        userMsg === "3️⃣"
      ) {
        replyText =
          "Thanks for sharing details 🙌\nOur property expert will contact you shortly 📞";
      }

      else {
        replyText = "Please share the details so I can help you better 🏡";
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

