import { Card, Button } from "react-bootstrap";
import ProductCSS from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { addToCart } from "../store/Cart/actions";
import { CartContext } from "../store/Cart/context";
import { addToFavorites } from "../store/Favorites/action";
import { FavoritesContext } from "../store/Favorites/context";

const ProductCard = (props) => {
  const { id, image, title, rating } = props;

  const { cartDispatch } = useContext(CartContext);

  const { favoritesDispatch } = useContext(FavoritesContext);

  const handleAddToCart = () => {
    const cartToAdd = {
      id,
      image,
      title,
      rating,
    };
    const actionResult = addToCart(cartToAdd);
    cartDispatch(actionResult);
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
  };

  return (
    <div className={ProductCSS.main}>
      <Card className={ProductCSS.card} key={id}>
        <Link to={`/GamesDetails/${id}`}>
          <Card.Body>
            <Card.Img variant="top" src={image} />
            <Card.Title className={ProductCSS.title}>{title} </Card.Title>
            <Card.Text>{rating} $</Card.Text>
          </Card.Body>
        </Link>
        <Button className={ProductCSS.button} onClick={() => handleAddToCart()}>
          Add to chart
        </Button>
        <Button variant="danger" onClick={handleAddToFavorites}>
          Add to favorites
        </Button>
      </Card>
    </div>
  );
};

export default ProductCard;
