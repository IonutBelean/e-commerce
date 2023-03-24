import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import HeaderSecondCSS from "./HeaderSecond.module.css";

const HeaderSecond = () => {
  return (
    <Navbar className={HeaderSecondCSS.container} expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className={HeaderSecondCSS.main}>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/AllGames">
            All Games
          </Nav.Link>
          <Nav.Link as={Link} to="/ActionGames">
            Action
          </Nav.Link>
          <Nav.Link as={Link} to="/ShooterGames">
            Shooter
          </Nav.Link>
          <Nav.Link as={Link} to="/RacingGames">
            Racing
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderSecond;
