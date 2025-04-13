import Layout from "../components/Layout";
import { getGenresGamesEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import ProductCardList from "../components/ProductCardList";
import { getGamesList } from "../api/adaptors";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import React from "react";

import GameRecommender from "../components/GameRecommender";
import HomeCss from "./Home.module.css";

const Home = () => {
  const actionGamesList = getGenresGamesEndpoint("action", 1, 8);
  const shooterGamesList = getGenresGamesEndpoint("shooter", 1, 8);
  const racingGamesList = getGenresGamesEndpoint("racing", 1, 8);

  const actionData = useFetch(actionGamesList);
  const shooterdata = useFetch(shooterGamesList);
  const racingdata = useFetch(racingGamesList);

  const adaptedActionGamesList = getGamesList(actionData);
  const adaptedShooterGamesList = getGamesList(shooterdata);
  const adaptedRacingGamesList = getGamesList(racingdata);

  return (
    <Layout>
      <Container className={`mb-5 mt-4 ${HomeCss.recommenderHighlight}`}>
        <h1 className="text-center mb-4">
          <span role="img" aria-label="Video Game Controller">
            🎮
          </span>{" "}
          What games to buy?
        </h1>

        <GameRecommender />
      </Container>

      <Container className={`${HomeCss.container} mb-5`}>
        <h1 className="text-center">Action Games</h1>
        <ProductCardList data={adaptedActionGamesList} />
        <div className="text-center more">
          More{" "}
          <Link to="/ActionGames/" className="text-secondary">
            Action
          </Link>
        </div>
      </Container>

      <Container className="mb-5">
        <h1 className="text-center">Shooter Games</h1>
        <ProductCardList data={adaptedShooterGamesList} />
        <div className="text-center more">
          More{" "}
          <Link to="/ShooterGames/" className="text-secondary">
            Shooter
          </Link>
        </div>
      </Container>

      <Container className="mb-5">
        <h1 className="text-center">Racing Games</h1>
        <ProductCardList data={adaptedRacingGamesList} />
        <div className="text-center more">
          More{" "}
          <Link to="/RacingGames/" className="text-secondary">
            Racing
          </Link>
        </div>
      </Container>
    </Layout>
  );
};

export default Home;
