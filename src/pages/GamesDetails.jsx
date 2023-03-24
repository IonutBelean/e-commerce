import { Row, Col, Container, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getGamesDetailsEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { useContext, useState } from "react";
import { CartContext } from "../store/Cart/context";
import { addToCart } from "../store/Cart/actions";
import { FavoritesContext } from "../store/Favorites/context";
import { addToFavorites } from "../store/Favorites/action";
import GamesDetailsCSS from "./GamesDetails.module.css";

const GamesDetails = () => {
  const { cartDispatch } = useContext(CartContext);
  const { favoritesDispatch } = useContext(FavoritesContext);

  const [isFavAlertDisplayed, setIsFavAlertDisplayed] = useState(false);
  const [isCartAlertDisplayed, setIsCartAlertDisplayed] = useState(false);

  const { gameId } = useParams();

  const gamesDetails = getGamesDetailsEndpoint(gameId);

  const data = useFetch(gamesDetails);

  const {
    id,
    name,
    description,
    released,
    playtime,
    background_image_additional,
    website,
    rating,
  } = data || {};

  const handleAddToCart = () => {
    const cartToAdd = {
      id: id,
      image: background_image_additional,
      title: name,
      rating,
    };
    const actionResult = addToCart(cartToAdd);
    cartDispatch(actionResult);

    setIsCartAlertDisplayed(true);
    setTimeout(() => {
      setIsCartAlertDisplayed(false);
    }, 2500);
  };

  const handleAddToFavorites = () => {
    const favoritesToAdd = {
      id,
      image: background_image_additional,
      title: name,
      rating,
    };
    const actionResult = addToFavorites(favoritesToAdd);
    favoritesDispatch(actionResult);

    setIsFavAlertDisplayed(true);
    setTimeout(() => {
      setIsFavAlertDisplayed(false);
    }, 2500);
  };

  return (
    <Layout>
      {isFavAlertDisplayed && (
        <Alert variant="success" className={GamesDetailsCSS.alert}>
          Succes! Poți vedea produsul in Favorite.
        </Alert>
      )}
      {isCartAlertDisplayed && (
        <Alert variant="primary" className={GamesDetailsCSS.alert}>
          Produsul a fost adaugat cu succes in Cos!
        </Alert>
      )}
      <Container>
        <Row>
          <Col xs={12} lg={8} key={id}>
            <h1>{name}</h1>
            <h6>{released}</h6>
            <img src={background_image_additional} alt="game" />
            <p>{description}</p>
            <h5>Hours to play: {playtime}</h5>
            <h5>
              Official website:{" "}
              <a href={website} target="_blank" rel="noreferrer">
                {website}
              </a>
            </h5>
            <Button onClick={handleAddToCart}>Add to cart</Button>
            <Button onClick={handleAddToFavorites}>Add to Favorites</Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default GamesDetails;
