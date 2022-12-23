export const getMGamesList = (apiResponse) => {
  if (!apiResponse || !apiResponse.results) {
    return [];
  }

  const rawGamesList = apiResponse.results;

  const adaptedGamesList = rawGamesList.map((game) => {
    return {
      id: game.id,
      title: game.name,
      image: game.background_image,
      rating: game.rating,
      released: game.released,
    };
  });

  return adaptedGamesList;
};
