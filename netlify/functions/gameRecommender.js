const axios = require("axios");
require("dotenv").config(); // 🟢 ADĂUGAT pentru a încărca .env

exports.handler = async function (event) {
  try {
    const { mood, time, genre } = JSON.parse(event.body);

    const userPrompt = `Recomandă-mi 3 jocuri video care sunt ${
      genre || "de orice gen"
    }, potrivite pentru o stare de ${mood}, și pot fi jucate cam în ${time}. Dă-mi titlurile și o scurtă descriere pentru fiecare.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Ești un asistent care recomandă jocuri video din diferite genuri, în funcție de starea utilizatorului și timpul disponibil.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: response.data.choices[0].message.content,
      }),
    };
  } catch (err) {
    console.error("Eroare funcție AI:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Eroare la generare recomandări" }),
    };
  }
};
