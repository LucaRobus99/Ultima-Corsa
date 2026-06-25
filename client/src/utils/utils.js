import constants from "./constants.js";

// Compute matrix layout for stations with uniform 3.5 cm (132px) spacing
function computeStationPositions(stations) {
  const positions = {};
  if (!stations || stations.length === 0) {
    return positions;
  }

  // Sort stations by ID to ensure deterministic positioning
  const sortedStations = [...stations].sort((a, b) => a.id - b.id);

  sortedStations.forEach((station, index) => {
    const col = index % constants.MAP_COLS;
    const row = Math.floor(index / constants.MAP_COLS);

    const x = constants.MAP_PADDING + col * constants.MAP_SPACING;
    const y = constants.MAP_PADDING + row * constants.MAP_SPACING;

    positions[station.id] = { x, y };
  });

  return positions;
}

// Resolve numeric station IDs in journey events to human-readable names using the selected path
const resolveStationNames = (events, selectedPath) => {
  return events.map((e) => {
    const fromStation = selectedPath.find((s) => s.id === e.from);
    const toStation = selectedPath.find((s) => s.id === e.to);
    return {
      ...e,
      fromName: fromStation ? fromStation.name : `Station ${e.from}`,
      toName: toStation ? toStation.name : `Station ${e.to}`,
    };
  });
};

const validatePath =  (pathArray, network) => {
  const { connections } = network;
  const usedEdges = new Set();

  for (let i = 0; i < pathArray.length - 1; i++) {
    const s1 = pathArray[i];
    const s2 = pathArray[i + 1];

    // Each connection (leg) can only be selected once in a game
    const edgeId = s1 < s2 ? `${s1}-${s2}` : `${s2}-${s1}`;
    if (usedEdges.has(edgeId)) {
      return false;
    }
    usedEdges.add(edgeId);

    // Verify if a connection exists between the two consecutive stations
    const connected = connections.some(
      (c) =>
        (c.stationAId === s1 && c.stationBId === s2) ||
        (c.stationAId === s2 && c.stationBId === s1),
    );

    if (!connected) return false;
  }

  return true;
};


const utils = { computeStationPositions, resolveStationNames,validatePath };
export default utils;
