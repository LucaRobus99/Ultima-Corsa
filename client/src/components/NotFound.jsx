import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// 404 page
function NotFound() {
  return (
    <Container className="text-center py-5 font-monospace">
      <div className="mb-4 text-danger display-1">
        <i className="bi bi-exclamation-triangle-fill"></i>
      </div>
      <h1 className="display-4 fw-bold text-dark">404 - Page Not Found</h1>
      <p className="text-secondary mt-3 mb-4">
        Sorry, the subway page you are looking for does not exist, is not
        active, or has been moved.
      </p>
      <Button as={Link} to="/" variant="primary" className="py-2 px-4 fw-bold">
        <i className="bi bi-house-door-fill me-2"></i> Back to Home
      </Button>
    </Container>
  );
}

export default NotFound;
