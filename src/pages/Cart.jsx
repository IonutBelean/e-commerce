import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { removeFromCart, updateQuantity } from "../store/Cart/actions";
import { CartContext } from "../store/Cart/context";
import { Container, Row, Col } from "react-bootstrap";
import CartCSS from "./Cart.module.css";
import LayoutSecond from "../components/LayoutSecond";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown, faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Cart = () => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const [show, setShow] = useState(true);

  const handleDelete = (id) => {
    const actionResult = removeFromCart(id);
    cartDispatch(actionResult);
  };

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value));
    cartDispatch(updateQuantity(id, quantity));
  };

  const handleXmarkClick = () => {
    setShow(false);
  };

  const totalPrice = cartState.products.reduce(
    (acc, product) => acc + product.quantity * product.rating,
    0
  );

  return (
    <LayoutSecond>
      <Container className={CartCSS.cart}>
        <h2>My Cart</h2>
        {cartState.products.length > 0 ? (
          <>
            {cartState.products.map((product) => (
              <div className={`mb-5`} key={product.id}>
                <div className={`${CartCSS.card}`}>
                  <Row className="align-items-center">
                    <Col md={4} className={CartCSS.title}>
                      <h3>{product.title}</h3>
                    </Col>
                    <Col md={3} className={CartCSS.image}>
                      <img src={product.image} alt="game" />
                    </Col>
                    <Col md={2}>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        className={CartCSS.quantityInput}
                      />
                    </Col>
                    <Col md={2} className={CartCSS.amount}>
                      {(product.quantity * product.rating).toFixed(2)}$
                    </Col>
                    <Col md={1}>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        className={`${CartCSS.delete}`}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}

            <div className={CartCSS.total}>
              <h4>Total: {totalPrice.toFixed(2)}$</h4>
            </div>
          </>
        ) : show ? (
          <p className={CartCSS.empty}>
            <FontAwesomeIcon icon={faFaceFrown} className="fa-xl me-2" />
            Your shopping cart contains no products. To add products to the
            basket, please return to the{" "}
            <a href="/" className={CartCSS.store}>
              store
            </a>
            .
            <FontAwesomeIcon
              icon={faXmark}
              size="xl"
              className={`${CartCSS.xmark}`}
              onClick={handleXmarkClick}
            />
          </p>
        ) : null}
      </Container>
    </LayoutSecond>
  );
};

export default Cart;
