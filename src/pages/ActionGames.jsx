import Layout from "../components/Layout";
import { getActionGamesEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { getGamesList } from "../api/adaptors";
import Pagination from "../components/Pagination";
import ProductCardList from "../components/ProductCardList";
import { useLocation } from "react-router-dom";

const ActionGames = () => {
  const queryParams = new URLSearchParams(useLocation().search);

  let currentPage = queryParams.get("page");

  if (!currentPage) {
    currentPage = 1;
  }

  const gamesList = getActionGamesEndpoint(currentPage);

  const data = useFetch(gamesList);

  const adaptedGamesList = getGamesList(data);

  return (
    <Layout>
      <h1>Action Games</h1>
      <ProductCardList data={adaptedGamesList} />
      <Pagination currentPage={currentPage} baseUrl="/ActionGames/" />
    </Layout>
  );
};

export default ActionGames;
