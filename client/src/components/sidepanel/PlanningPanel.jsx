import { Card, Button } from "react-bootstrap";

// Panel used during the planning phase to let players trace their route from memory
function PlanningPanel(props) {
  return (
    <Card className="border shadow-sm h-100 bg-white text-dark">
      <Card.Header className="bg-dark text-light py-3 d-flex justify-content-between align-items-center">
        <span className="fw-bold text-uppercase small">Planning phase</span>
        <span className="badge bg-warning text-dark fs-5 fw-bold px-3 py-1">
          <i className="bi bi-clock me-1"></i> {props.time}s
        </span>
      </Card.Header>
      <Card.Body className="p-4 d-flex flex-column font-monospace">
        <h6 className="fw-bold mb-2 text-uppercase small text-secondary">
          Available Connections:
        </h6>
        <div className="overflow-auto pe-1" style={{ maxHeight: "400px", marginBottom: "3mm" }}>
          {props.network.connections.map((conn) => {
            const isSelected = props.selectedConnections.includes(conn.id);
            const isLastSelected =
              props.selectedConnections[
                props.selectedConnections.length - 1
              ] === conn.id;
            const stationA = props.network.stations.find(
              (s) => s.id === conn.stationAId,
            );
            const stationB = props.network.stations.find(
              (s) => s.id === conn.stationBId,
            );

            let variant = "outline-primary";
            if (isSelected) {
              variant = isLastSelected ? "danger" : "secondary";
            }

            return (
              <Button
                key={conn.id}
                variant={variant}
                className="w-100 text-start mb-2 small py-1"
                disabled={isSelected && !isLastSelected}
                onClick={() => props.onConnectionClicked(conn)}
              >
                {stationA.name} <i className="bi bi-arrow-right"></i>{" "}
                {stationB.name}
              </Button>
            );
          })}
        </div>

        <div className="mt-auto pt-3 border-top text-center">
          <h6 className="text-muted fw-normal small mb-3">
            When you are ready, click the{" "}
            <span className="fw-bold text-dark">"Submit"</span> button.
          </h6>
          <Button
            variant="success"
            className="w-100 py-2 fw-bold"
            onClick={props.onSubmit}
          >
            Submit Path
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PlanningPanel;
