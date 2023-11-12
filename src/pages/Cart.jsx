import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { removeFromCart } from "../store/Cart/actions";
import { CartContext } from "../store/Cart/context";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Container, Row, Col } from "react-bootstrap";
import CartCSS from "./Cart.module.css";
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

  const [show, setShow] = useState(true);

  const handleXmarkClick = () => {
    setShow(false);
  };

  return (
    <LayoutSecond>
      <Container className={CartCSS.cart}>
        <h2>My Cart</h2>
        {cartState.products.length > 0 ? (
          cartState.products.map((product) => {
            return (
              <div className={`mb-5`} key={product.id}>
                <div className={`${CartCSS.card} `}>
                  <Row>
                    <Col className={CartCSS.title}>
                      <h3>{product.title}</h3>
                    </Col>
                    <Col>
                      <img src={product.image} alt="game" />
                    </Col>
                    <Col className={CartCSS.price}>
                      <div>
                        <div className={CartCSS.quantity}>
                          {product.quantity}
                        </div>
                        <div className={CartCSS.amount}>
                          {(product.quantity * product.rating).toFixed(2)}$
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <Button
                  onClick={() => handleDelete(product.id)}
                  className={`${CartCSS.delete}`}
                >
                  Remove from cart
                </Button>
              </div>
            );
          })
        ) : show ? (
          <p className={CartCSS.empty}>
            <FontAwesomeIcon icon={faFaceFrown} className="fa-xl me-2" />
            Your shopping cart contains no products. To add products to the
            basket, please return to the <a href="/">store</a>.
            <FontAwesomeIcon
              icon={faXmark}
              size="xl"
              className={`${CartCSS.xmark} `}
              onClick={handleXmarkClick}
            />
          </p>
        ) : null}
      </Container>
    </LayoutSecond>
  );
};

export default Cart;
