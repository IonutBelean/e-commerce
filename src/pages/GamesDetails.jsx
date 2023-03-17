import { Row, Col, Container, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getGamesDetailsEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { useContext } from "react";
import { CartContext } from "../store/Cart/context";
import { addToCart } from "../store/Cart/actions";

const GamesDetails = () => {
  const { cartDispatch } = useContext(CartContext);

  const { gameId } = useParams();

  const gamesDetails = getGamesDetailsEndpoint(gameId);

  const data = useFetch(gamesDetails);

  console.log(data);

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
    console.log(cartToAdd);
    const actionResult = addToCart(cartToAdd);
    cartDispatch(actionResult);
  };

  return (
    <Layout>
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
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default GamesDetails;
