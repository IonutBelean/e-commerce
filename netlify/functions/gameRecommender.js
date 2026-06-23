const axios = require("axios");

const API_KEY = "a6cc911b4877423191322ec9e1af7479";

const normalize = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/gi, "");

const GENRE_KEYWORDS = {
  racing: [
    "curse",
    "curs",
    "cursa",
    "viteza",
    "masini",
    "maşini",
    "racing",
    "race",
    "drift",
  ],
  action: ["actiune", "acțiune", "action"],
  rpg: ["rpg", "rol", "joc de rol"],
  shooter: ["shooter", "impuscaturi", "împuşcături", "fps", "tps"],
  sports: ["sport", "sportiv", "fotbal", "baschet"],
  strategy: ["strategie", "strategic", "strategy"],
  puzzle: ["puzzle", "logica", "logică"],
  adventure: ["aventura", "aventură", "adventure"],
  simulation: ["simulare", "simulator", "simulation"],
  indie: ["indie"],
  horror: ["horror", "groaza", "groază"],
  platformer: ["platforma", "platformă", "platformer"],
  fighting: ["lupta", "luptă", "fighting", "bataie", "bătaie"],
};

const detectGenreFromQuery = (query) => {
  if (!query) return null;
  const q = query.toLowerCase();
  for (const [genreSlug, keywords] of Object.entries(GENRE_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      return genreSlug;
    }
  }
  return null;
};

const getAllGames = async (page = 1, pageSize = 40) => {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}&ordering=-added`;
  const response = await axios.get(url);
  return response.data.results;
};

const getGamesByGenre = async (genre, page = 1, pageSize = 40) => {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=${pageSize}&ordering=-added`;
  const response = await axios.get(url);
  return response.data.results;
};

const searchGameByTitle = async (title) => {
  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(
    title,
  )}&page_size=5`;
  const response = await axios.get(url);
  const results = response.data.results || [];
  if (results.length === 0) return null;
  const normTitle = normalize(title);
  const exact = results.find((g) => normalize(g.name) === normTitle);
  return exact || results[0];
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

    const effectiveGenre = genre
      ? genre.toLowerCase()
      : detectGenreFromQuery(query);

    let allGames = [];
    if (effectiveGenre) {
      allGames = await getGamesByGenre(effectiveGenre, 1, 40);
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

Dacă vreun titlu din lista de mai sus se potrivește cerinței, selectează-l EXACT cum apare în listă.
Dacă niciun titlu din listă nu se potrivește, dar cunoști un alt joc real care răspunde mai bine la întrebare, poți pune titlul acelui joc (cu numele lui real, exact).
Răspunde STRICT cu un obiect JSON valid, fără text adițional, fără ghilimele de cod markdown, în formatul:
{"message": "un mesaj scurt, conversational, in limba romana", "titles": ["Titlu Exact 1", "Titlu Exact 2"]}
Dacă nu poți recomanda niciun joc relevant, returnează "titles": [].`;

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

      const foundGames = [];
      const seenIds = new Set();

      for (const titleFromAi of titlesFromAi) {
        const normTitle = normalize(titleFromAi);
        let game = gameMap.get(normTitle) || null;

        if (!game) {
          try {
            game = await searchGameByTitle(titleFromAi);
          } catch (lookupErr) {
            console.error("❌ Eroare la căutarea titlului:", lookupErr.message);
          }
        }

        if (game && !seenIds.has(game.id)) {
          seenIds.add(game.id);
          foundGames.push(game);
        }
      }

      mentionedGames = foundGames;
    }

    if (mentionedGames.length === 0 && !query && year) {
      mentionedGames = allGames
        .filter((g) => g.released?.startsWith(String(year)))
        .slice(0, 5);
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

    let finalMessage;
    if (result.length > 0) {
      finalMessage =
        aiMessage ||
        `Am selectat câteva jocuri pentru tine${
          effectiveGenre ? ` din genul "${effectiveGenre}"` : ""
        }.`;
    } else {
      finalMessage =
        aiMessage ||
        "Nu am găsit titluri potrivite, dar poți încerca un alt gen sau an.";
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        aiMessage: finalMessage,
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
