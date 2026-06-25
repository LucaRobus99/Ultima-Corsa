import { Row, Col, Card, Button } from "react-bootstrap";
import LoginForm from "./AuthComponent.jsx";
import { Link } from "react-router-dom";
import constants from "../utils/constants.js";

// Landing page with game rules and user status
function HomePage(props) {
  return (
    
    <div className="homepage-container font-monospace mt-2">
      <Row className="mb-4">
        <Col>
          <div className="p-4 bg-primary text-light rounded shadow-sm text-center">
            <h1 className="fw-bold m-0 text-uppercase fs-3">
              <i className="bi bi-train-front me-3"></i>
              Welcome to Ultima Corsa
            </h1>
          </div>
        </Col>
      </Row>
      <Row className="gy-4">

        <Col md={6}>
          <Card className="h-100 border shadow-sm">
            <Card.Header className="bg-dark text-light fw-bold py-3 text-uppercase small tracking-wider">
              <i className="bi bi-info-circle-fill me-2 text-warning"></i> Game
              Rules
            </Card.Header>
            <Card.Body
              className="p-4 d-flex flex-column justify-content-center"
              style={{ minHeight: "250px" }}
            >
              {constants.GAME_RULES.map((rule, idx) => (
                <p
                  key={idx}
                  className={`text-secondary small ${idx === constants.GAME_RULES.length - 1 ? "mb-0" : "mb-3"}`}
                >
                  {rule}
                </p>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          {props.loggedIn ? (
            <Card className="h-100 border shadow-sm text-center">
              <Card.Header className="bg-dark text-light fw-bold py-3 text-uppercase small tracking-wider">
                <i className="bi bi-person-fill me-2 text-warning"></i> User
                Panel
              </Card.Header>
              <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center py-5 my-3">
                <div className="mb-3 text-primary display-4">
                  <i className="bi bi-check-circle-fill text-success"></i>
                </div>
                <h4 className="fw-bold text-dark">Logged In</h4>
                <p className="text-secondary small mt-2">
                  You are logged in as{" "}
                  <strong className="text-primary">
                    {props.user.username}
                  </strong>
                  .
                </p>
                <Button
                  as={Link}
                  to="/game"
                  variant="primary"
                  className="w-100 mt-3 py-2 fw-bold"
                >
                  <i className="bi bi-play-circle me-2"></i> Start Playing
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <LoginForm login={props.login} />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
