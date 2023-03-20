import Layout from "../components/Layout";
import { getGenresGamesEndpoint } from "../api/endpoints";
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

  const actionGamesList = getGenresGamesEndpoint("action", currentPage, 20);

  const data = useFetch(actionGamesList);

  const adaptedGamesList = getGamesList(data);

  return (
    <Layout>
      <h1 className="text-center">Action Games</h1>
      <ProductCardList data={adaptedGamesList} />
      <Pagination currentPage={currentPage} baseUrl="/ActionGames/" />
    </Layout>
  );
};

export default ActionGames;
