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
        <h2>My Favorites Games</h2>
        <Row>
          {favoritesState.products.length > 0 ? (
            favoritesState.products.map((product) => {
              return (
                <Col lg={3} md={4} className="mb-4">
                  <Card key={product.id}>
                    <Link to={`/GamesDetails/${product.id}`}>
                      <Card.Body>
                        <Card.Img variant="top" src={product.image} />
                        <Card.Title>{product.title} </Card.Title>
                        <Card.Text>{product.rating} $</Card.Text>
                      </Card.Body>
                    </Link>
                  </Card>
                  <Button onClick={() => handleDelete(product.id)}>
                    Delete from favorites
                  </Button>
                  <Button onClick={() => handleAddToCart(product)}>
                    Add to chart
                  </Button>
                </Col>
              );
            })
          ) : show ? (
            <p className={FavoriteCSS.empty}>
              <FontAwesomeIcon icon={faFaceFrown} className="fa-xl me-2" />
              Your shopping cart contains no products. To add products to the
              basket, please return to the <a href="/">store</a>.
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
