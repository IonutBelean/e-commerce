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
        <Alert variant="danger" className="alert">
          Product successfully added to Favorites!
        </Alert>
      )}
      {isCartAlertDisplayed && (
        <Alert variant="primary" className="alert">
          Product successfully added to Cart!
        </Alert>
      )}
      <Card key={id}>
        <div className={ProductCSS.sales}>90%</div>
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
        <Button className="button_cart" onClick={() => handleAddToCart()}>
          Add to chart
        </Button>
        <Button className="button_fav" onClick={handleAddToFavorites}>
          Add to favorites
        </Button>
      </Card>
    </div>
  );
};

export default ProductCard;
