// const axios = require("axios");
// require("dotenv").config();

// const RAWG_API_KEY = "a6cc911b4877423191322ec9e1af7479";

// const normalize = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/gi, "");

// const getAllGames = async (page = 1, pageSize = 40) => {
//   const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page=${page}&page_size=${pageSize}`;
//   const response = await axios.get(url);
//   return response.data.results;
// };

// exports.handler = async function (event) {
//   try {
//     const { query, mood, time, genre, year } = JSON.parse(event.body);

//     if (!query && !genre && !year) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({
//           error: "Trebuie să furnizezi cel puțin query, gen sau an.",
//         }),
//       };
//     }

//     const allGames = await getAllGames();
//     const gameMap = new Map();
//     allGames.forEach((g) => gameMap.set(normalize(g.name), g));

//     // 1️⃣ Dacă query-ul exact există ca titlu
//     if (query && gameMap.has(normalize(query))) {
//       const g = gameMap.get(normalize(query));
//       return {
//         statusCode: 200,
//         body: JSON.stringify({
//           aiMessage: `Am găsit jocul "${g.name}"!`,
//           result: [
//             {
//               id: g.id,
//               title: g.name,
//               image: g.background_image,
//               rating: g.rating,
//               released: g.released,
//               genres: g.genres.map((gg) => gg.name),
//             },
//           ],
//         }),
//       };
//     }

//     // 2️⃣ Dacă nu există titlul exact, folosim AI pentru recomandări
//     const availableTitles = allGames.map((g) => g.name);
//     let aiPrompt = `Utilizatorul a întrebat: "${query || ""}".\n`;
//     aiPrompt += `Răspunde liber despre jocuri, dar folosește DOAR titlurile din această listă: ${availableTitles.join(
//       ", "
//     )}.\n`;
//     if (genre) aiPrompt += `Preferință gen: ${genre}.\n`;
//     if (year) aiPrompt += `Preferință an lansare: ${year}.\n`;
//     if (mood) aiPrompt += `Stare utilizator: ${mood}.\n`;
//     if (time) aiPrompt += `Timp disponibil: ${time}.\n`;

//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "Ești un asistent care răspunde la întrebări despre jocuri video. Folosește DOAR titlurile din lista primită.",
//           },
//           { role: "user", content: aiPrompt },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );

//     const aiText =
//       response?.data?.choices?.[0]?.message?.content ||
//       "AI nu a furnizat niciun răspuns.";

//     const mentionedGames = availableTitles.filter((title) =>
//       normalize(aiText).includes(normalize(title))
//     );

//     const matchedGames = mentionedGames
//       .map((title) => {
//         const g = gameMap.get(normalize(title));
//         if (!g) return null;
//         return {
//           id: g.id,
//           title: g.name,
//           image: g.background_image,
//           rating: g.rating,
//           released: g.released,
//           genres: g.genres.map((gg) => gg.name),
//         };
//       })
//       .filter(Boolean);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         aiMessage: aiText,
//         result: matchedGames,
//       }),
//     };
//   } catch (err) {
//     console.error("❌ Eroare funcție AI:", err.message);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: "Eroare la generare recomandări" }),
//     };
//   }
// };

const axios = require("axios");
require("dotenv").config();

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

    // 1️⃣ Preluăm toate jocurile (sau filtrăm pe gen dacă există)
    let allGames = [];
    if (genre) {
      allGames = await getGamesByGenre(genre.toLowerCase(), 1, 40);
    } else {
      allGames = await getAllGames(1, 40);
    }

    const gameMap = new Map();
    allGames.forEach((g) => gameMap.set(normalize(g.name), g));

    // 2️⃣ Dacă query-ul exact există
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

    // 3️⃣ AI fallback: trimitem prompt doar dacă avem query
    let aiText = "";
    if (query) {
      const availableTitles = allGames.map((g) => g.name);
      const prompt = `Utilizatorul a întrebat: "${query}". Folosește DOAR titlurile din lista: ${availableTitles.join(
        ", "
      )}.\n`;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Ești un asistent pentru jocuri video.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      aiText = response?.data?.choices?.[0]?.message?.content || "";
    }

    // 4️⃣ Extragem jocurile menționate de AI
    let mentionedGames = allGames.filter((g) =>
      aiText
        ? new RegExp(g.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(
            aiText
          )
        : false
    );

    // 5️⃣ Fallback: dacă nici AI nu menționează titluri, returnăm primele 5 jocuri din listă (filtrate pe an dacă e cazul)
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
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        aiMessage:
          result.length > 0
            ? aiText ||
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
