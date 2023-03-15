import { useContext } from "react";
import { Nav, Navbar, Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartContext } from "../store/Cart/context";

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
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <Nav.Link as={Link} to="/">
              Favourite
            </Nav.Link>
            <Nav.Link as={Link} to="/Cart">
              Cart{totalProducts > 0 && `${totalProducts}`}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
