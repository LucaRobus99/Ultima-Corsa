import express from "express";
import morgan from "morgan";
import { check, validationResult } from "express-validator";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import cors from "cors";

import dao from "./dao/dao.js";
import utils from "./utils/utils.js";
import models from "./models/models.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan("dev"));

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const user = await dao.getUser(username, password);
      if (!user) return cb(null, false, "Incorrect username or password.");

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }),
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return new models.UnauthorizedErrorDto(res);
};

app.use(
  session({
    secret: "whispering_forest_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.authenticate("session"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessState: 200,
  exposedHeaders: ["WWW-Authenticate"],
  credentials: true,
};

app.use(cors(corsOptions));

app.post("/api/sessions", [
  check("username").isString().notEmpty().withMessage("Username is required"),
  check("password").isString().notEmpty().withMessage("Password is required")
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new models.BadRequestErrorDto(res, errors.array()[0].msg);
  }
  next();
}, passport.authenticate("local"), function (req, res) {
  return res.status(201).json(new models.UserResponseDto(req.user.username));
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(new models.UserResponseDto(req.user.username));
  } else {
    return new models.UnauthorizedErrorDto(res);
  }
});

app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    utils.cleanupGameSession(req);
    res.status(204).end();
  });
});

app.get("/api/network", isLoggedIn, async (req, res) => {
  try {
    const network = await dao.getNetwork();
    return res.json(
      new models.NetworkResponseDto(
        network.stations,
        network.lines,
        network.connections,
      ),
    );
  } catch (err) {
    console.error(err);
    return new models.InternalServerErrorDto(res);
  }
});

app.get("/api/game/planning", isLoggedIn, async (req, res) => {
  try {
    const { stations, connections } = await dao.getNetwork();
    if (stations.length < 2) {
      return new models.InternalServerErrorDto(res);
    }

    const startStation = stations[Math.floor(Math.random() * stations.length)];
    const distances = utils.getShortestDistancesFrom(
      startStation.id,
      connections,
    );

    // find stations that are 3+ stops away
    const candidates = stations.filter((station) => distances[station.id] >= 3);

    if (candidates.length === 0) {
      return new models.InternalServerErrorDto(res);
    }

    const endStation =
      candidates[Math.floor(Math.random() * candidates.length)];

    req.session.assignedStart = startStation.id;
    req.session.assignedEnd = endStation.id;
    req.session.planningStart = Date.now();

    req.session.save((err) => {
      if (err) {
        console.error(err);
        utils.cleanupGameSession(req);
        return new models.InternalServerErrorDto(res);
      }
      return res.json(new models.PlanningResponseDto(startStation, endStation));
    });
  } catch (err) {
    console.error(err);
    utils.cleanupGameSession(req);
    return new models.InternalServerErrorDto(res);
  }
});

app.get("/api/leaderboard", isLoggedIn, async (req, res) => {
  try {
    const leaderboard = await dao.getLeaderboard();
    return res.json(leaderboard);
  } catch (err) {
    console.error(err);
    return new models.InternalServerErrorDto(res);
  }
});

app.post(
  "/api/game/execution",
  isLoggedIn,
  [
    check("path").isArray().withMessage("The path must be an array"),
    check("path.*").isInt().withMessage("Each stop must be a numeric ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new models.BadRequestErrorDto(res, errors.array()[0].msg);
    }

    const userPath = req.body.path;

    const assignedStart = req.session.assignedStart;
    const assignedEnd = req.session.assignedEnd;
    const planningStart = req.session.planningStart;

    if (
      assignedStart === undefined ||
      assignedEnd === undefined ||
      planningStart === undefined
    ) {
      return new models.BadRequestErrorDto(
        res,
        "No active planning session found. Please start a new game.",
      );
    }

    try {
      if (!Array.isArray(userPath) || userPath.length < 2) {
        utils.cleanupGameSession(req);
        return new models.BadRequestErrorDto(
          res,
          "The path must contain at least start and end stations.",
        );
      }

      // check time limit (90 seconds + small network buffer)
      const secondsElapsed = (Date.now() - planningStart) / 1000;
      if (secondsElapsed > 93) {
        utils.cleanupGameSession(req);
        return new models.BadRequestErrorDto(
          res,
          "Maximum time of 90 seconds exceeded for planning.",
        );
      }

      const actualStart = userPath[0];
      const actualEnd = userPath[userPath.length - 1];

      if (actualStart !== assignedStart || actualEnd !== assignedEnd) {
        utils.cleanupGameSession(req);
        return new models.BadRequestErrorDto(
          res,
          "Incomplete path or incorrect start/destination stations.",
        );
      }

      // check route layout and lines swap constraints
      const isPathValid = await dao.validatePath(userPath);

      if (!isPathValid) {
        utils.cleanupGameSession(req);
        return new models.BadRequestErrorDto(
          res,
          "Invalid path or line interchange rules violated.",
        );
      }

      let currentCoins = 20;
      const events = await dao.getEvents();
      const journeyEvents = [];

      for (let i = 0; i < userPath.length - 1; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        currentCoins += randomEvent.effect;

        journeyEvents.push(
          new models.JourneyEventDto(
            userPath[i],
            userPath[i + 1],
            randomEvent.description,
            randomEvent.effect,
            currentCoins,
          ),
        );
      }

      const finalScore = Math.max(0, currentCoins);

      await dao.saveGame(req.user.id, finalScore);

      utils.cleanupGameSession(req);

      return res
        .status(201)
        .json(new models.ExecutionResponseDto(journeyEvents));
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
      utils.cleanupGameSession(req);
      return new models.InternalServerErrorDto(res);
    }
  },
);

app.listen(port, () => {
  console.log(`API server started at http://localhost:${port}`);
});
