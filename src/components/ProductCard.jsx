import { Card, Button } from "react-bootstrap";
import ProductCSS from "./ProductCard.module.css";
import { addToCart } from "../store/Cart/actions";
import { useContext } from "react";
import { CartContext } from "../store/Cart/context";
import { Link } from "react-router-dom";

const ProductCard = (props) => {
  const { id, image, title, rating } = props;

  const { cartDispatch } = useContext(CartContext);

  const handleAddToCart = () => {
    const cartToAdd = {
      id,
      image,
      title,
      rating,
    };
    console.log(cartToAdd);
    const actionResult = addToCart(cartToAdd);
    cartDispatch(actionResult);
  };

  return (
    <div className={ProductCSS.main}>
      <Link to={`/GamesDetails/${id}`}>
        <Card className={ProductCSS.card} key={id}>
          <Card.Img variant="top" src={image} />
          <Card.Body>
            <Card.Title className={ProductCSS.title}>{title} </Card.Title>
            <Card.Text>{rating} $</Card.Text>
            <Button
              className={ProductCSS.button}
              onClick={() => handleAddToCart()}
            >
              Add to chart
            </Button>
          </Card.Body>
        </Card>
      </Link>
    </div>
  );
};

export default ProductCard;
