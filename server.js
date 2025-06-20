const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

// ⬇️ Laad je kennisbestand (zorg dat ct_kennis.json in dezelfde map staat)
const kennis = JSON.parse(fs.readFileSync("ct_kennis.json", "utf8"));

// ⬇️ Functie om info te vinden op basis van vraag
function zoekAntwoord(vraag) {
  for (let item of kennis) {
    if (vraag.toLowerCase().includes(item.titel.toLowerCase())) {
      return item.inhoud;
    }
  }
  return null; // Als er niets gevonden wordt
}

// ⬇️ POST endpoint waar je vragen naartoe stuurt
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Check op verboden woorden, vóór je GPT aanroept (bespaart tokens)
  const verbodenWoorden = ["dokter", "kanker", "zelfmoord", "medicatie", "diagnose"];
  if (verbodenWoorden.some(w => userMessage.toLowerCase().includes(w))) {
    return res.json({
      reply: "Deze vraag mag ik niet beantwoorden. Neem contact op met een huidtherapeut van Cosmetique Totale."
    });
  }

  // Zoek relevante info uit JSON bestand
  const gevondenInfo = zoekAntwoord(userMessage);
  const context = gevondenInfo || "Geen extra informatie gevonden in onze database.";

  // Stel bericht samen voor GPT
  const messages = [
    {
      role: "system",
      content: `
Je bent een professionele AI-assistent voor Cosmetique Totale.
Je helpt klanten met uitleg over huidbehandelingen, intake-afspraken en producten.
Je bent vriendelijk, duidelijk en professioneel.
Je geeft nooit medisch advies, stelt geen diagnose en verwijst bij twijfel altijd naar een huidtherapeut.
Je praat alleen over onderwerpen die relevant zijn voor Cosmetique Totale.
Gebruik onderstaande informatie indien relevant:
${context}
`
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  // Verstuur naar OpenAI API
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("Fout bij API-call:", err.response?.data || err.message);
    res.status(500).json({ reply: "Er ging iets mis met de AI. Probeer het later opnieuw." });
  }
});

// Start de server
app.listen(3000, () => {
  console.log("Server draait op http://localhost:3000");
});
