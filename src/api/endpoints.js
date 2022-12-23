const API_KEY = "a6cc911b4877423191322ec9e1af7479";

export const getGamesEndpoint = () => {
  return `https://api.rawg.io/api/games?key=${API_KEY}`;
};
