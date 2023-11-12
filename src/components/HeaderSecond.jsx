import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import HeaderSecondCSS from "./HeaderSecond.module.css";

const HeaderSecond = () => {
  return (
    <Navbar className={HeaderSecondCSS.nav} expand="lg">
      <Container className={HeaderSecondCSS.container}>
        <div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`${HeaderSecondCSS.collapse} `}
          >
            <Nav>
              <Nav.Link as={Link} to="/" className={HeaderSecondCSS.links}>
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/AllGames"
                className={HeaderSecondCSS.links}
              >
                All Games
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/ActionGames"
                className={HeaderSecondCSS.links}
              >
                Action
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/ShooterGames"
                className={HeaderSecondCSS.links}
              >
                Shooter
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/RacingGames"
                className={HeaderSecondCSS.links}
              >
                Racing
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
};

export default HeaderSecond;
