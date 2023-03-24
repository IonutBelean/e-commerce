import { useContext, useState } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartContext } from "../store/Cart/context";
import HeaderCSS from "./Header.module.css";

import SearchBar from "./SearchBar";
import SearchBarResults from "./SearchBarResults";

const Header = () => {
  const { cartState } = useContext(CartContext);
  const { products } = cartState;

  const [results, setResults] = useState([]);

  const totalProducts = products.reduce((accum, product) => {
    return accum + product.quantity;
  }, 0);

  return (
    <Container className={HeaderCSS.main}>
      <Navbar expand="lg" className={HeaderCSS.nav}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            UnderFive
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className={HeaderCSS.links}>
              <SearchBar setResults={setResults} />
              <SearchBarResults results={results} />
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
    </Container>
  );
};

export default Header;
