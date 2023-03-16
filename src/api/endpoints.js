const API_KEY = "a6cc911b4877423191322ec9e1af7479";

export const getAllGamesEndpoint = (page = 1) => {
  return `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`;
};

export const getActionGamesEndpoint = (page = 1) => {
  return `https://api.rawg.io/api/games?key=${API_KEY}&genres=action&page=${page}`;
};

export const getRacingGamesEndpoint = (page = 1) => {
  return `https://api.rawg.io/api/games?key=${API_KEY}&genres=racing&page=${page}`;
};
