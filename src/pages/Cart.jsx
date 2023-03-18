import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { removeFromCart } from "../store/Cart/actions";
import { CartContext } from "../store/Cart/context";
import Layout from "../components/Layout";
import { useLocalStorage } from "../hooks/useLocalStorage";

const Cart = () => {
  const { cartState, cartDispatch } = useContext(CartContext);

  const [_, setCartLocalStorageState] = useLocalStorage("cart", cartState);

  useEffect(() => {
    setCartLocalStorageState(cartState);
  }, [cartState, setCartLocalStorageState]);

  const handleDelete = (id) => {
    const actionResult = removeFromCart(id);
    cartDispatch(actionResult);
  };

  return (
    <Layout>
      {cartState.products.length > 0 ? (
        cartState.products.map((product) => {
          return (
            <div className="m-3" key={product.id}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>{product.title}</h3>
                <img src={product.image} alt="game" />
                <p>
                  {product.quantity} x {product.rating}$ ={" "}
                  {product.quantity * product.rating}$
                </p>
              </div>
              <Button onClick={() => handleDelete(product.id)}>Delete</Button>
            </div>
          );
        })
      ) : (
        <p>Nu ai produse in cos!</p>
      )}
    </Layout>
  );
};

export default Cart;
