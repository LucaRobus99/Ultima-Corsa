import { Card } from "react-bootstrap";

// Panel showing the journey execution progress and station log
function ExecutionPanel(props) {
  return (
    <Card className="border shadow-sm h-100 bg-white text-dark">
      <Card.Header className="bg-warning text-dark py-3 d-flex justify-content-between align-items-center">
        <span className="fw-bold text-uppercase small">
          Execution phase
        </span>
        <span className="badge bg-dark text-white fw-bold px-2.5 py-1.5 fs-6">
          <i className="bi bi-coin me-1"></i> {props.coins}
        </span>
      </Card.Header>
      <Card.Body className="p-4 font-monospace d-flex flex-column justify-content-between">
        <div className="flex-grow-1">
          <h6 className="fw-bold mb-3 text-uppercase small text-secondary">
            Station Log:
          </h6>
          <div className="overflow-auto pe-1 mb-4 max-h-250">
            {props.visibleEvents.length > 0 &&
              props.visibleEvents.map((event, index) => {
                const isNegative = event.effect < 0;
                return (
                  <div
                    key={index}
                    className="p-3 mb-2 bg-light border rounded small"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark">
                        {event.fromName} <i className="bi bi-arrow-right"></i>{" "}
                        {event.toName}
                      </span>
                      <span
                        className={`badge ${isNegative ? "bg-danger" : "bg-success"} text-white fw-bold`}
                      >
                        {event.effect >= 0 ? `+${event.effect}` : event.effect}
                      </span>
                    </div>
                    <div className="text-secondary small">
                      {event.eventDescription}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ExecutionPanel;
