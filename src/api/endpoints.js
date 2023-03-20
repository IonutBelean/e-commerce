const API_KEY = "a6cc911b4877423191322ec9e1af7479";

export const getAllGamesEndpoint = (page = 1) => {
  return `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`;
};

export const getGenresGamesEndpoint = (category, page = 1, pageSize = 20) => {
  return `https://api.rawg.io/api/games?key=${API_KEY}&genres=${category}&page=${page}&page_size=${pageSize}`;
};

export const getGamesDetailsEndpoint = (gameId) => {
  return `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`;
};

export const getSearchGamesEndpoint = (title) => {
  return `https://api.rawg.io/api/games?key=${API_KEY}&search=${title}`;
};
