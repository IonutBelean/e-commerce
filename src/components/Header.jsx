import { useContext } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CartContext } from "../store/Cart/context";
import HeaderCSS from "./Header.module.css";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FavoritesContext } from "../store/Favorites/context";

// import SearchBar from "./SearchBar";
// import SearchBarResults from "./SearchBarResults";

const Header = () => {
  const { cartState } = useContext(CartContext);
  const { favoritesState } = useContext(FavoritesContext);
  const { products } = cartState;

  const favProd = favoritesState.products;

  // const [results, setResults] = useState([]);

  const totalProducts = products.reduce((accum, product) => {
    return accum + product.quantity;
  }, 0);
  const totalFav = favProd.reduce((accum, product) => {
    return accum + product.quantity;
  }, 0);

  return (
    <div className={HeaderCSS.container}>
      <Navbar expand="lg" className={HeaderCSS.nav}>
        <Container className="d-flex justify-content-between">
          <Navbar.Brand as={Link} to="/">
            UnderFive
          </Navbar.Brand>
          {/* <SearchBar setResults={setResults} /> */}
          <div>
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            {/* <Navbar.Collapse id="basic-navbar-nav"> */}
            <Nav className={HeaderCSS.links}>
              {/* <SearchBarResults results={results} /> */}
              <Nav.Link as={Link} to="/Favorites">
                Favorites
                <span className={HeaderCSS.cart}>
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    className="fa-lg me-2"
                  />
                  {totalFav > 0 && (
                    <p className={HeaderCSS.total_prods}>{favProd.length}</p>
                  )}
                </span>
              </Nav.Link>
              <Nav.Link as={Link} to="/Cart">
                Cart
                <span className={HeaderCSS.cart}>
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    className="fa-lg me-2"
                  />
                  {totalProducts > 0 && (
                    <p className={HeaderCSS.total_prods}>{totalProducts}</p>
                  )}
                </span>
              </Nav.Link>
            </Nav>
            {/* </Navbar.Collapse> */}
          </div>
        </Container>
      </Navbar>
      <div className={HeaderCSS.orizontal}></div>
    </div>
  );
};

export default Header;
