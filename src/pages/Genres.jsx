import Layout from "../components/Layout";
import { Card, Button, Row, Col } from "react-bootstrap";
import { getGenresGamesEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { getGamesList } from "../api/adaptors";
import ProducsCSS from "./Products.module.css";
import { addToCart } from "../store/Cart/actions";
import { useContext } from "react";
import { CartContext } from "../store/Cart/context";

const Genres = () => {
  const { cartDispatch } = useContext(CartContext);

  const gamesList = getGenresGamesEndpoint();

  const data = useFetch(gamesList);

  const adaptedGamesList = getGamesList(data);

  // console.log(adaptedGamesList);

  const handleAddToCart = (product) => {
    const cartToAdd = {
      id: product.id,
      image: product.image,
      title: product.title,
      price: product.rating,
    };
    console.log(cartToAdd);
    const actionResult = addToCart(cartToAdd);
    cartDispatch(actionResult);
  };

  return (
    <Layout>
      <div className={ProducsCSS.main}>
        <Row>
          {adaptedGamesList.map((product) => {
            return (
              <Col lg={3} md={4} className="mb-4">
                <Card className={ProducsCSS.card} key={product.id}>
                  <Card.Img variant="top" src={product.image} />
                  <Card.Body>
                    <Card.Title className={ProducsCSS.title}>
                      {product.title}{" "}
                    </Card.Title>
                    <Card.Text>{product.rating} $</Card.Text>
                    <Button
                      className={ProducsCSS.button}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to chart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </Layout>
  );
};

export default Genres;
