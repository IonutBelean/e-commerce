import Layout from "../components/Layout";
import { useFetch } from "../hooks/useFetch";
import { getGamesList } from "../api/adaptors";
import Pagination from "../components/Pagination";
import ProductCardList from "../components/ProductCardList";
import { useLocation } from "react-router-dom";
import { getGenresGamesEndpoint } from "../api/endpoints";

const ShooterGames = () => {
  const queryParams = new URLSearchParams(useLocation().search);

  let currentPage = queryParams.get("page");

  if (!currentPage) {
    currentPage = 1;
  }

  const shooterGamesList = getGenresGamesEndpoint("shooter", currentPage, 20);

  const data = useFetch(shooterGamesList);

  const adaptedGamesList = getGamesList(data);

  return (
    <Layout>
      <h1 className="text-center">Shooter Games</h1>
      <ProductCardList data={adaptedGamesList} />
      <Pagination currentPage={currentPage} baseUrl="/ShooterGames/" />
    </Layout>
  );
};

export default ShooterGames;
