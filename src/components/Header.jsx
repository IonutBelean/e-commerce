import { useContext } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartContext } from "../store/Cart/context";

import SearchBar from "./SearchBar";

const Header = () => {
  const { cartState } = useContext(CartContext);
  const { products } = cartState;

  const totalProducts = products.reduce((accum, product) => {
    return accum + product.quantity;
  }, 0);

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          UnderFive
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <SearchBar />
            <Nav.Link as={Link} to="/Favorites">
              Favourite
            </Nav.Link>
            <Nav.Link as={Link} to="/Cart">
              Cart {totalProducts > 0 && `${totalProducts}`}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
