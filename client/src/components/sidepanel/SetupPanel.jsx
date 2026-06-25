import { Card, Button } from "react-bootstrap";

// Study phase intro screen
function SetupPanel(props) {
  return (
    <Card className="border shadow-sm h-100 bg-white text-dark">
      <Card.Header className="bg-dark text-light py-3">
        <span className="fw-bold text-uppercase small">Setup Phase</span>
      </Card.Header>
      <Card.Body className="p-4 d-flex flex-column justify-content-between">
        <div>
          <h5 className="fw-bold mb-3">Memorize the Map</h5>
          <p className="text-secondary small mb-3">
            Carefully examine the connections between stations. When you click
            "Start Game", the tracks will disappear and you will have to trace
            the path from memory within 90 seconds!
          </p>
        </div>
        <Button
          variant="primary"
          className="w-100 py-2.5 fw-bold"
          onClick={props.onStartGame}
        >
          <i className="bi bi-play-fill me-1"></i> Start Game
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SetupPanel;
