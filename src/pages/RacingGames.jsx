import Layout from "../components/Layout";
import { useFetch } from "../hooks/useFetch";
import { getGamesList } from "../api/adaptors";
import Pagination from "../components/Pagination";
import ProductCardList from "../components/ProductCardList";
import { useLocation } from "react-router-dom";
import { getGenresGamesEndpoint } from "../api/endpoints";
import React from "react";

const RacingGames = () => {
  const queryParams = new URLSearchParams(useLocation().search);

  let currentPage = queryParams.get("page");

  if (!currentPage) {
    currentPage = 1;
  }

  const racingGamesList = getGenresGamesEndpoint("racing", currentPage, 20);

  const data = useFetch(racingGamesList);

  const adaptedGamesList = getGamesList(data);

  return (
    <Layout>
      <h1 className="text-center">Racing Games</h1>
      <ProductCardList data={adaptedGamesList} />
      <Pagination currentPage={currentPage} baseUrl="/ActionGames/" />
    </Layout>
  );
};

export default RacingGames;
