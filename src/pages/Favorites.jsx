import { useContext } from "react";
import { Button, Card, Col } from "react-bootstrap";
import Layout from "../components/Layout";
import { removeFromFavorites } from "../store/Favorites/action";
import { FavoritesContext } from "../store/Favorites/context";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { favoritesState, favoritesDispatch } = useContext(FavoritesContext);

  const handleDelete = (id) => {
    const actionResult = removeFromFavorites(id);
    favoritesDispatch(actionResult);
  };

  return (
    <Layout>
      {favoritesState.products.length > 0 ? (
        favoritesState.products.map((product) => {
          return (
            <div>
              <Col lg={3} md={4} className="mb-4" key={product.id}>
                <Card key={product.id}>
                  <Link to={`/GamesDetails/${product.id}`}>
                    <Card.Body>
                      <Card.Img variant="top" src={product.image} />
                      <Card.Title>{product.title} </Card.Title>
                      <Card.Text>{product.rating} $</Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
                <Button onClick={() => handleDelete(product.id)}>Delete</Button>
              </Col>
            </div>
          );
        })
      ) : (
        <p>Nu ai produse in cos!</p>
      )}
    </Layout>
  );
};

export default Favorites;
