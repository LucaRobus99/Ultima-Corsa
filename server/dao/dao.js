import sqlite from "sqlite3";
import models from "../models/models.js";
import crypto from "crypto";

const db = new sqlite.Database("ultime-corse.sqlite", (err) => {
  if (err) throw err;
});

const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        crypto.scrypt(password, row.salt, 16, (err, hashedPassword) => {
          if (err) reject(err);
          else {
            const target = Buffer.from(row.password_hash, "hex");
            if (crypto.timingSafeEqual(target, hashedPassword)) {
              resolve(new models.User(row.id, row.username));
            } else {
              resolve(false);
            }
          }
        });
      }
    });
  });
};

const getNetwork = () => {
  const pStations = new Promise((resolve, reject) =>
    db.all("SELECT * FROM stations", (err, rows) =>
      err ? reject(err) : resolve(rows),
    ),
  );

  const pLines = new Promise((resolve, reject) =>
    db.all("SELECT * FROM lines", (err, rows) =>
      err ? reject(err) : resolve(rows),
    ),
  );

  const pConnections = new Promise((resolve, reject) =>
    db.all("SELECT * FROM connections", (err, rows) =>
      err ? reject(err) : resolve(rows),
    ),
  );

  return Promise.all([pStations, pLines, pConnections]).then(
    ([stations, lines, connections]) => {
      return {
        stations: stations.map((s) => new models.Station(s.id, s.name)),
        lines: lines.map((l) => new models.Line(l.id, l.name)),
        connections: connections.map(
          (c) =>
            new models.Connection(
              c.id,
              c.station_a_id,
              c.station_b_id,
              c.line_id,
            ),
        ),
      };
    },
  );
};

const getEvents = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM events", (err, rows) => {
      if (err) reject(err);
      else {
        resolve(
          rows.map((e) => new models.Event(e.id, e.description, e.effect)),
        );
      }
    });
  });
};

const saveGame = (userId, score) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO games(user_id, score) VALUES (?, ?)",
      [userId, score],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      },
    );
  });
};

const getLeaderboard = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT users.username, MAX(games.score) as bestScore
      FROM games 
      JOIN users ON games.user_id = users.id 
      GROUP BY users.id 
      ORDER BY bestScore DESC
    `;
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map(
            (r) => new models.LeaderboardEntryDto(r.username, r.bestScore),
          ),
        );
    });
  });
};

const validatePath = async (pathArray) => {
  const { connections } = await getNetwork();
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

const dao = {
  getUser,
  getNetwork,
  getEvents,
  saveGame,
  getLeaderboard,
  validatePath,
};
export default dao;
