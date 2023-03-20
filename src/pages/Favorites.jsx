import { useContext, useEffect } from "react";
import { Button, Card, Col } from "react-bootstrap";
import Layout from "../components/Layout";
import { removeFromFavorites } from "../store/Favorites/action";
import { FavoritesContext } from "../store/Favorites/context";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CartContext } from "../store/Cart/context";
import { addToCart } from "../store/Cart/actions";

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

  return (
    <Layout>
      {favoritesState.products.length > 0 ? (
        favoritesState.products.map((product) => {
          return (
            <div>
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
