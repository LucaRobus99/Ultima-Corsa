import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router";

// App navigation bar
function NavHeader(props) {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container fluid>
        <Link to="/" className="navbar-brand">
          Ultima-Corsa
        </Link>

        <div className="d-flex align-items-center gap-3">
          {props.loggedIn ? (
            <>
              <Link to="/leaderboard" className="nav-link text-light">
                Leaderboard
              </Link>
              <Button
                variant="outline-light"
                size="sm"
                onClick={props.handleLogout}
              >
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
