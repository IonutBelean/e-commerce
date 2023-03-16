import Layout from "../components/Layout";
import { getAllGamesEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { getGamesList } from "../api/adaptors";
import { useLocation } from "react-router-dom";
import ProductCardList from "../components/ProductCardList";
import Pagination from "../components/Pagination";

const AllGames = () => {
  const queryParams = new URLSearchParams(useLocation().search);

  let currentPage = queryParams.get("page");

  if (!currentPage) {
    currentPage = 1;
  }

  const gamesList = getAllGamesEndpoint(currentPage);

  const data = useFetch(gamesList);

  const adaptedGamesList = getGamesList(data);

  return (
    <Layout>
      <h1>All Games</h1>
      <ProductCardList data={adaptedGamesList} />
      <Pagination currentPage={currentPage} baseUrl="/AllGames/" />
    </Layout>
  );
};

export default AllGames;
