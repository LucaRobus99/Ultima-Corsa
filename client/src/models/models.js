// User model
function User(username) {
  this.username = username;
}

// Subway line model
function Line(id, name) {
  this.id = id;
  this.name = name;
}

// Station model
function Station(id, name) {
  this.id = id;
  this.name = name;
}

// Subway connection between stations
function Connection(id, stationAId, stationBId, lineId) {
  this.id = id;
  this.stationAId = stationAId;
  this.stationBId = stationBId;
  this.lineId = lineId;
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

const models = {
  User,
  Line,
  Station,
  Connection,
  LeaderboardEntryDto,
  JourneyEventDto,
};
export default models;
