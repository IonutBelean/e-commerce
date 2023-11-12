import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Row, Container } from "react-bootstrap";
import { removeFromFavorites } from "../store/Favorites/action";
import { FavoritesContext } from "../store/Favorites/context";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CartContext } from "../store/Cart/context";
import { addToCart } from "../store/Cart/actions";
import FavoriteCSS from "./Favorites.module.css";
import { faFaceFrown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LayoutSecond from "../components/LayoutSecond";

const Favorites = () => {
  const { favoritesState, favoritesDispatch } = useContext(FavoritesContext);
  const { cartDispatch } = useContext(CartContext);

  const handleAddToCart = (product) => {
    const cartToAdd = {
      id: product.id,
      image: product.image,
      title: product.title,
      rating: product.rating,
    };
    const actionResult = addToCart(cartToAdd);
    cartDispatch(actionResult);
  };

  const [_, setLocalStorageState] = useLocalStorage(
    "favorites",
    favoritesState
  );

  useEffect(() => {
    setLocalStorageState(favoritesState);
  }, [favoritesState, setLocalStorageState]);

  const handleDelete = (id) => {
    const actionResult = removeFromFavorites(id);
    favoritesDispatch(actionResult);
  };

  const [show, setShow] = useState(true);

  const handleXmarkClick = () => {
    setShow(false);
  };

  return (
    <LayoutSecond>
      <Container className={`${FavoriteCSS.container}`}>
        <h2>My Favorite Games</h2>
        {/* {isCartAlertDisplayed && (
          <Alert variant="primary" className={FavoriteCSS.alert}>
            Produsul a fost adaugat cu succes in Cos!
          </Alert>
        )} */}
        <Row>
          {favoritesState.products.length > 0 ? (
            favoritesState.products.map((product) => {
              return (
                <Col lg={3} md={4} className="mb-4" key={product.id}>
                  <Card key={product.id}>
                    <div className={FavoriteCSS.sales}>90%</div>
                    <Link to={`/GamesDetails/${product.id}`}>
                      <Card.Body className={FavoriteCSS.card_body}>
                        <Card.Img variant="top" src={product.image} />
                        <Card.Title className={FavoriteCSS.title}>
                          {product.title}{" "}
                        </Card.Title>
                        <Card.Text className={FavoriteCSS.price}>
                          {product.rating} $
                        </Card.Text>
                      </Card.Body>
                    </Link>
                    <Button
                      className="button_cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to cart
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      className="button_fav"
                    >
                      Remove from favorites
                    </Button>
                  </Card>
                </Col>
              );
            })
          ) : show ? (
            <p className={FavoriteCSS.empty}>
              <FontAwesomeIcon icon={faFaceFrown} className="fa-xl me-2" />
              Your favorite games list is empty. To add products please return
              to the <a href="/">store</a>.
              <FontAwesomeIcon
                icon={faXmark}
                size="xl"
                className={`${FavoriteCSS.xmark} `}
                onClick={handleXmarkClick}
              />
            </p>
          ) : null}
        </Row>
      </Container>
    </LayoutSecond>
  );
};

export default Favorites;
