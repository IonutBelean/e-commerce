const axios = require("axios");

const API_KEY = "a6cc911b4877423191322ec9e1af7479";

const normalize = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/gi, "");

const getAllGames = async (page = 1, pageSize = 40) => {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`;
  const response = await axios.get(url);
  return response.data.results;
};

const getGamesByGenre = async (genre, page = 1, pageSize = 20) => {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=${pageSize}`;
  const response = await axios.get(url);
  return response.data.results;
};

const getGameDetails = async (id) => {
  const url = `https://api.rawg.io/api/games/${id}?key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

exports.handler = async function (event) {
  try {
    const { query, genre, year, mood, time } = JSON.parse(event.body);

    if (!query && !genre && !year) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Trebuie să furnizezi cel puțin query, gen sau an.",
        }),
      };
    }

    let allGames = [];
    if (genre) {
      allGames = await getGamesByGenre(genre.toLowerCase(), 1, 40);
    } else {
      allGames = await getAllGames(1, 40);
    }

    const gameMap = new Map();
    allGames.forEach((g) => gameMap.set(normalize(g.name), g));

    if (query && gameMap.has(normalize(query))) {
      const g = gameMap.get(normalize(query));
      return {
        statusCode: 200,
        body: JSON.stringify({
          aiMessage: `Am găsit jocul "${g.name}"!`,
          result: [
            {
              id: g.id,
              title: g.name,
              image: g.background_image,
              rating: g.rating,
              released: g.released,
              genres: g.genres.map((gg) => gg.name),
            },
          ],
        }),
      };
    }

    let aiMessage = "";
    let mentionedGames = [];

    if (query) {
      const availableTitles = allGames.map((g) => g.name);
      const prompt = `Utilizatorul a întrebat: "${query}".
Lista de titluri disponibile este: ${availableTitles.join(", ")}.

Selectează DOAR titluri care apar EXACT (caracter cu caracter) în lista de mai sus și care se potrivesc cerinței utilizatorului.
Răspunde STRICT cu un obiect JSON valid, fără text adițional, fără ghilimele de cod markdown, în formatul:
{"message": "un mesaj scurt, conversational, in limba romana", "titles": ["Titlu Exact 1", "Titlu Exact 2"]}
Dacă niciun titlu din listă nu se potrivește, returnează "titles": [].`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "Ești un asistent pentru jocuri video. Răspunzi mereu strict în formatul JSON cerut, fără text în afara obiectului JSON.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      const rawContent = response?.data?.choices?.[0]?.message?.content || "{}";

      let parsed;
      try {
        parsed = JSON.parse(rawContent);
      } catch (parseErr) {
        console.error("❌ AI nu a returnat JSON valid:", rawContent);
        parsed = { message: "", titles: [] };
      }

      aiMessage = parsed.message || "";

      const titlesFromAi = Array.isArray(parsed.titles) ? parsed.titles : [];
      const normalizedRequested = new Set(titlesFromAi.map(normalize));

      mentionedGames = allGames.filter((g) =>
        normalizedRequested.has(normalize(g.name)),
      );
    }

    if (mentionedGames.length === 0) {
      let filtered = allGames;
      if (year) {
        filtered = filtered.filter((g) => g.released?.startsWith(String(year)));
      }
      mentionedGames = filtered.slice(0, 5);
    }

    const result = await Promise.all(
      mentionedGames.map(async (g) => {
        const details = await getGameDetails(g.id);
        return {
          id: details.id,
          title: details.name,
          image: details.background_image,
          rating: details.rating,
          released: details.released,
          genres: details.genres.map((gg) => gg.name),
        };
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        aiMessage:
          result.length > 0
            ? aiMessage ||
              `Am selectat câteva jocuri pentru tine din genul "${
                genre || "aleator"
              }".`
            : "Nu am găsit titluri potrivite, dar poți încerca un alt gen sau an.",
        result,
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
