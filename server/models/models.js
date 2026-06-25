// User entity
function User(id, username) {
  this.id = id;
  this.username = username;
}

// Subway line
function Line(id, name) {
  this.id = id;
  this.name = name;
}

// Subway station
function Station(id, name) {
  this.id = id;
  this.name = name;
}

// Connection between two stations
function Connection(id, stationAId, stationBId, lineId) {
  this.id = id;
  this.stationAId = stationAId;
  this.stationBId = stationBId;
  this.lineId = lineId;
}

// Journey event
function Event(id, description, effect) {
  this.id = id;
  this.description = description;
  this.effect = effect;
}

// Leaderboard entry (DTO)
function LeaderboardEntryDto(username, bestScore) {
  this.username = username;
  this.bestScore = bestScore;
}

// Journey event during execution (DTO)
function JourneyEventDto(from, to, eventDescription, effect, coinsAfter) {
  this.from = from;
  this.to = to;
  this.eventDescription = eventDescription;
  this.effect = effect;
  this.coinsAfter = coinsAfter;
}

function UserResponseDto(username) {
  this.username = username;
}

// ... rest of the DTOs
function NetworkResponseDto(stations, lines, connections) {
  this.stations = stations;
  this.lines = lines;
  this.connections = connections;
}

function PlanningResponseDto(startStation, endStation) {
  this.startStation = startStation;
  this.endStation = endStation;
}

function ExecutionResponseDto(journeyEvents) {
  this.journeyEvents = journeyEvents;
}

// Error DTOs
function InternalServerErrorDto(res) {
  return res.status(500).json({ error: "Internal server error." });
}

function UnauthorizedErrorDto(res) {
  return res.status(401).json({ error: "Not authenticated." });
}

function BadRequestErrorDto(res, message) {
  return res.status(400).json({ error: message });
}

const models = {
  User,
  Line,
  Station,
  Connection,
  Event,
  LeaderboardEntryDto,
  JourneyEventDto,
  UserResponseDto,
  NetworkResponseDto,
  PlanningResponseDto,
  ExecutionResponseDto,
  InternalServerErrorDto,
  UnauthorizedErrorDto,
  BadRequestErrorDto,
};

export default models;
