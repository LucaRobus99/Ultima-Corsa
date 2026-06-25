import models from "../models/models.js";

const SERVER_URL = "http://localhost:3001";

const request = async (path, method, object = undefined) => {
  const options = {
    method: `${method}`,
    credentials: "include",
  };

  if (object !== undefined) {
    options.body = JSON.stringify(object);
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  const res = await fetch(`${SERVER_URL}/api/${path}`, options);

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Unrecognized Error" }));
    throw errorData;
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
};

// Login user
const login = async (credentials) => {
  const user = await request("sessions", "POST", credentials);
  return new models.User(user.username);
};

// Logout current user
const logout = async () => {
  try {
    await request("sessions/current", "DELETE");
    return true;
  } catch {
    return false;
  }
};

// Fetch logged in user info
const getUserInfo = async () => {
  const user = await request("sessions/current", "GET");
  return new models.User(user.username);
};

// Fetch the whole network (stations, lines, connections)
const getNetwork = async () => {
  const data = await request("network", "GET");
  return {
    stations: data.stations.map((s) => new models.Station(s.id, s.name)),
    lines: data.lines.map((l) => new models.Line(l.id, l.name)),
    connections: data.connections.map(
      (c) => new models.Connection(c.id, c.stationAId, c.stationBId, c.lineId),
    ),
  };
};

// Fetch global leaderboard
const getLeaderboard = async () => {
  const data = await request("leaderboard", "GET");
  return data.map(
    (entry) => new models.LeaderboardEntryDto(entry.username, entry.bestScore),
  );
};

// Fetch game start/end stations
const getGamePlanning = async () => {
  const data = await request("game/planning", "GET");
  return {
    startStation: new models.Station(
      data.startStation.id,
      data.startStation.name,
    ),
    endStation: new models.Station(data.endStation.id, data.endStation.name),
  };
};

// Post selected path and retrieve game results
const playGame = async (path) => {
  const data = await request("game/execution", "POST", { path });
  return {
    journeyEvents: data.journeyEvents.map(
      (e) =>
        new models.JourneyEventDto(
          e.from,
          e.to,
          e.eventDescription,
          e.effect,
          e.coinsAfter,
        ),
    ),
  };
};

const api = {
  login,
  logout,
  getUserInfo,
  getNetwork,
  getLeaderboard,
  getGamePlanning,
  playGame,
};
export default api;
