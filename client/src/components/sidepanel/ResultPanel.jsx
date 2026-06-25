import { Card, Button } from "react-bootstrap";

// End game screen showing score and events log
function ResultPanel(props) {
  const isSuccess = !props.errorMessage && props.coins >= 0;

  return (
    <Card className="border shadow-sm h-100 bg-white text-dark">
      <Card.Header
        className={`text-light py-3 d-flex justify-content-between align-items-center ${isSuccess ? "bg-success" : "bg-danger"}`}
      >
        <span className="fw-bold text-uppercase small">
          {isSuccess ? "Journey Completed" : "Journey Failed"}
        </span>
        <span className="badge bg-dark text-white fw-bold px-2.5 py-1.5 fs-6">
          <i className="bi bi-coin me-1"></i> {props.coins}
        </span>
      </Card.Header>
      <Card.Body className="p-4 font-monospace d-flex flex-column justify-content-between">
        {props.visibleEvents.length > 0 && (
          <div className="flex-grow-1 mb-3">
            <h6 className="fw-bold mb-3 text-uppercase small text-secondary">
              Station Log:
            </h6>
            <div className="overflow-auto pe-1 max-h-250">
              {props.visibleEvents.map((event, index) => {
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
        )}

        <div className="mt-auto pt-3 border-top">
          {!isSuccess ? (
            <div className="alert alert-danger text-center mb-3">
              <h6 className="fw-bold mb-1">
                <i className="bi bi-x-circle-fill me-1"></i> Error!
              </h6>
              <p className="small mb-0">
                {props.errorMessage ||
                  "You ran out of coins during the journey!"}
              </p>
              <div className="fs-5 fw-bold mt-2">
                Score: 0 <i className="bi bi-coin"></i>
              </div>
            </div>
          ) : (
            <div className="alert alert-success text-center mb-3">
              <h6 className="fw-bold mb-1">
                <i className="bi bi-trophy-fill me-1"></i> Success!
              </h6>
              <p className="small mb-0">
                You arrived safely at your destination!
              </p>
              <div className="fs-5 fw-bold mt-2">
                Score: {props.coins} <i className="bi bi-coin"></i>
              </div>
            </div>
          )}
          <Button
            variant="primary"
            className="w-100 py-2.5 fw-bold text-uppercase"
            onClick={props.onRestart}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Play Again
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ResultPanel;
