const getShortestDistancesFrom = (startId, connList) => {
  const adj = {};
  for (const c of connList) {
    (adj[c.stationAId] ||= []).push(c.stationBId);
    (adj[c.stationBId] ||= []).push(c.stationAId);
  }
  
  // standard bfs algorithm to find shortest distance between stations
  const distances = { [startId]: 0 };
  const queue = [startId];
  
  while (queue.length > 0) {
    const current = queue.shift();
    const currentDist = distances[current];
    
    for (const neighbor of adj[current] || []) {
      if (distances[neighbor] === undefined) {
        distances[neighbor] = currentDist + 1;
        queue.push(neighbor);
      }
    }
  }
  return distances;
};

const cleanupGameSession = (req) => {
  if (req.session) {
    req.session.assignedStart = undefined;
    req.session.assignedEnd = undefined;
    req.session.planningStart = undefined;
    req.session.save();
  }
};
const utils = { getShortestDistancesFrom, cleanupGameSession };
export default utils;
