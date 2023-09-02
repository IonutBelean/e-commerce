import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { removeFromCart } from "../store/Cart/actions";
import { CartContext } from "../store/Cart/context";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Container } from "react-bootstrap";
import ChartCSS from "./Chart.module.css";
import LayoutSecond from "../components/LayoutSecond";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown, faXmark } from "@fortawesome/free-solid-svg-icons";

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

  const message = document.querySelector("#message");

  const handleXmarkClick = () => {
    message.visibility = "hidden";
  };

  return (
    <LayoutSecond>
      <Container className={ChartCSS.cart}>
        <h2>My Chart</h2>
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
          <p className={ChartCSS.empty} id="message">
            <FontAwesomeIcon icon={faFaceFrown} className="fa-xl me-2" />
            Your shopping cart contains no products. To add products to the
            basket, please return to the <a href="/">store</a>.
            <FontAwesomeIcon
              icon={faXmark}
              size="xl"
              className={`${ChartCSS.xmark} `}
              onClick={handleXmarkClick}
            />
          </p>
        )}
      </Container>
    </LayoutSecond>
  );
};

export default Cart;
