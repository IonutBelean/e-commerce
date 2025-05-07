const axios = require("axios");
require("dotenv").config();

const RAWG_API_KEY = "a6cc911b4877423191322ec9e1af7479";

// ✅ Obține 40 de jocuri din RAWG (poți crește limita dacă e nevoie)
const getAllGames = async (page = 10, pageSize = 40) => {
  const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page=${page}&page_size=${pageSize}`;
  const response = await axios.get(url);
  return response.data.results;
};

// ✅ Obține detalii complete despre un joc (pentru descriere, rating etc.)
const getGameDetails = async (id) => {
  const url = `https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

// 🔤 Normalizează un titlu pentru comparare
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/gi, "");

exports.handler = async function (event) {
  try {
    const { mood, time, genre } = JSON.parse(event.body);

    // 1. ✅ Obține lista de jocuri disponibile
    const allGames = await getAllGames();
    const availableTitles = allGames.map((g) => g.name);

    // 2. 🧠 Creează prompt pentru AI
    const userPrompt = `
Utilizatorul caută sugestii legate de jocuri video. Îi poți răspunde liber, dar dacă menționezi jocuri, folosește DOAR din această listă: ${availableTitles.join(
      ", "
    )}.
`;

    // 3. 📡 Apelează OpenAI pentru a obține recomandări
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Ești un asistent care răspunde liber la întrebări despre jocuri video. Dacă menționezi jocuri, folosește DOAR titluri din lista primită.",
          },
          {
            role: "user",
            content: `${userPrompt}\n\nContext: Stare: ${mood}, Timp disponibil: ${time}, Gen preferat: ${genre}`,
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

    const aiText = response.data.choices[0].message.content;
    console.log("🔍 AI a răspuns:", aiText);

    // 4. 🎯 Extrage titlurile de jocuri menționate de AI
    const mentionedGames = availableTitles.filter((title) => {
      const normalizedTitle = normalize(title);
      const normalizedText = normalize(aiText);
      return normalizedText.includes(normalizedTitle);
    });

    // 5. 🔍 Obține detalii complete pentru fiecare joc găsit
    const matchedGames = [];

    for (const title of mentionedGames) {
      const match = allGames.find(
        (g) => normalize(g.name) === normalize(title)
      );
      if (match) {
        const details = await getGameDetails(match.id);
        matchedGames.push({
          id: details.id,
          title: details.name,
          image: details.background_image,
          rating: details.rating,
          // description: details.description_raw,
        });
      }
    }

    // 6. 📦 Răspunsul trimis către frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        aiMessage: aiText,
        result: matchedGames,
      }),
    };
  } catch (err) {
    console.error("❌ Eroare funcție AI:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Eroare la generare recomandări" }),
    };
  }
};
