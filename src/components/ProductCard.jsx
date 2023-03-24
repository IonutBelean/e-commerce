import { Card, Button } from "react-bootstrap";
import ProductCSS from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { addToCart } from "../store/Cart/actions";
import { CartContext } from "../store/Cart/context";
import { addToFavorites } from "../store/Favorites/action";
import { FavoritesContext } from "../store/Favorites/context";
import { Alert } from "react-bootstrap";
import StarRrating from "./StarRating";

const ProductCard = (props) => {
  const { id, image, title, rating } = props;

  const { cartDispatch } = useContext(CartContext);

  const { favoritesDispatch } = useContext(FavoritesContext);

  const [isFavAlertDisplayed, setIsFavAlertDisplayed] = useState(false);
  const [isCartAlertDisplayed, setIsCartAlertDisplayed] = useState(false);

  const handleAddToCart = () => {
    const cartToAdd = {
      id,
      image,
      title,
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
      image,
      title,
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
    <div className={ProductCSS.main}>
      {isFavAlertDisplayed && (
        <Alert variant="success" className={ProductCSS.alert}>
          Succes! Poți vedea produsul in Favorite.
        </Alert>
      )}
      {isCartAlertDisplayed && (
        <Alert variant="primary" className={ProductCSS.alert}>
          Produsul a fost adaugat cu succes in Cos!
        </Alert>
      )}
      <Card className={ProductCSS.card} key={id}>
        <div className={ProductCSS.sales}>90n%</div>
        <Link to={`/GamesDetails/${id}`}>
          <Card.Body className={ProductCSS.card_body}>
            <Card.Img variant="top" src={image} />
            <Card.Title className={ProductCSS.title}>{title}</Card.Title>
            <Card.Text className={ProductCSS.price}>
              {rating} <span>$</span>
            </Card.Text>
          </Card.Body>
        </Link>
        <StarRrating id={id} />
        <Button
          className={ProductCSS.button_cart}
          onClick={() => handleAddToCart()}
        >
          Add to chart
        </Button>
        <Button
          className={ProductCSS.button_fav}
          onClick={handleAddToFavorites}
        >
          Add to favorites
        </Button>
      </Card>
    </div>
  );
};

export default ProductCard;
