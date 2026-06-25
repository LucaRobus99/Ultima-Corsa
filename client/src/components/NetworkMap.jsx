import { Spinner } from "react-bootstrap";
import utils from "../utils/utils.js";
import constants from "../utils/constants.js";
// Main map component. Reused across different game states (setup, planning)
function NetworkMap(props) {
  const { network } = props;

  if (!network || !network.stations) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5 font-monospace text-secondary">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading map...
      </div>
    );
  }

  const stationPositions = utils.computeStationPositions(network.stations);

  return (
    <div className="network-map-container">
      <svg
        viewBox={`0 0 ${constants.MAP_WIDTH} ${constants.MAP_HEIGHT}`}
        className="w-100 h-auto bg-white border rounded shadow-sm"
      >
        {/* connections */}
        {props.gamestate === "setup" &&
          network.connections.map((conn) => {
            const from = stationPositions[conn.stationAId];
            const to = stationPositions[conn.stationBId];

            if (!from || !to) return null;

            const color = constants.LINE_COLORS[conn.lineId] || "#6B7280";

            return (
              <line
                key={conn.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            );
          })}

        {/* stations */}
        {network.stations.map((station) => {
          const pos = stationPositions[station.id];
          if (!pos) return null;

          return (
            <g key={station.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6.5"
                fill="#FFFFFF"
                stroke="#212529"
                strokeWidth="2.5"
              />
              <text
                x={pos.x}
                y={pos.y - 15}
                textAnchor="middle"
                fontSize="9px"
                fill="#374151"
                fontWeight="bold"
                className="station-label"
              >
                {station.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* map legend (lines) */}
      {props.gamestate === "setup" && (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mt-3 p-3 bg-light border rounded text-dark small font-monospace shadow-sm">
          <span className="fw-bold text-muted text-uppercase">
            Lines Legend:
          </span>
          {network.lines.map((line) => {
            const color = constants.LINE_COLORS[line.id] || "#6B7280";
            return (
              <div key={line.id} className="d-flex align-items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  className="d-inline-block align-middle"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="5.5"
                    fill={color}
                    stroke="#CCCCCC"
                    strokeWidth="1"
                  />
                </svg>
                <span className="fw-semibold">{line.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {props.gamestate === "planning" && (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mt-3 p-3 bg-light border rounded text-dark small font-monospace shadow-sm">
          <span className="fw-bold text-muted text-uppercase">
            Mission Legend:
          </span>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">
              Departure:{" "}
              <span className="text-dark">{props.endpoints.start.name}</span>
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold">
              Destination:{" "}
              <span className="text-dark">{props.endpoints.end.name}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkMap;
