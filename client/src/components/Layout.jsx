import { Outlet } from "react-router";
import NavHeader from "./Navbar.jsx";
import { Container } from "react-bootstrap";

// Main layout wrapper
function Layout(props) {
  return (
    <>
      <NavHeader
        loggedIn={props.loggedIn}
        handleLogout={props.handleLogout}
        user={props.user}
      />
      <Container fluid className="mt-3 flex-grow-1">
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
