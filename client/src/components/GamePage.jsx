import { useEffect, useState } from "react";

import { Container, Row, Col } from "react-bootstrap";
import NetworkMap from "./NetworkMap.jsx";
import SetupPanel from "./sidepanel/SetupPanel.jsx";
import PlanningPanel from "./sidepanel/PlanningPanel.jsx";
import ExecutionPanel from "./sidepanel/ExecutionPanel.jsx";
import ResultPanel from "./sidepanel/ResultPanel.jsx";
import API from "../api/api.js";
import utils from "../utils/utils.js";

// Main component handling game lifecycle across all phases
function GamePage(props) {
  // Game phases: 'setup', 'planning', 'execution' and 'result'
  const [gameState, setGameState] = useState("setup");
  const [network, setNetwork] = useState(null);

  const [selectedConnections, setSelectedConnections] = useState([]);
  const [selectedPath, setSelectedPath] = useState([]);
  const [endpoints, setEndpoints] = useState(null);
  const [time, setTime] = useState(90);
  const [planningStart, setPlanningStart] = useState(null);

  const [coins, setCoins] = useState(20);
  const [fullServerEvents, setFullServerEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch map network on load
  useEffect(() => {
    const loadNetwork = async () => {
      try {
        const data = await API.getNetwork();
        setNetwork(data);
      } catch (err) {
        if (!err.error) {
          props.handleError();
        } else {
          setErrorMessage(err.error);
        }
      }
    };
    loadNetwork();
  }, []);

  // Initialize game by getting start and end stations
  const handleStartGame = async () => {
    try {
      const response = await API.getGamePlanning();
      setEndpoints({
        start: response.startStation,
        end: response.endStation,
      });
      setSelectedPath([]);
      setSelectedConnections([]);
      setGameState("planning");
      setTime(90);
      setPlanningStart(Date.now());
    } catch (error) {
      if (!error.error) {
        props.handleError();
      } else {
        setErrorMessage(error.error);
      }
    }
  };

  // Path building on map clicks
  const handleConnectionClicked = (conn) => {
    // If the connection is already selected, click acts as backtracking if it was the last connection
    if (selectedConnections.includes(conn.id)) {
      if (selectedConnections[selectedConnections.length - 1] === conn.id) {
        setSelectedConnections((prev) => prev.slice(0, -1));
        setSelectedPath((prev) => prev.slice(0, -2));
      }
      return;
    }

    const stationA = network.stations.find((s) => s.id === conn.stationAId);
    const stationB = network.stations.find((s) => s.id === conn.stationBId);

    setSelectedPath((prev) => {
      let appendA = stationA;
      let appendB = stationB;
      
      if (prev.length > 0) {
        // Match direction with the last clicked station
        if (prev[prev.length - 1].id === stationB.id) {
          appendA = stationB;
          appendB = stationA;
        }
      } else {
        // Match direction with the start station
        if (endpoints.start.id === stationB.id) {
          appendA = stationB;
          appendB = stationA;
        }
      }
      return [...prev, appendA, appendB];
    });

    setSelectedConnections((prev) => [...prev, conn.id]);
  };

  // Submits the selected path to the server
  const handleSubmit = async () => {
    // Deduplicate adjacent stations as requested by the user logic
    const finalPath = [];
    for (let i = 0; i < selectedPath.length; i++) {
      if (i === 0 || selectedPath[i].id !== selectedPath[i - 1].id) {
        finalPath.push(selectedPath[i]);
      }
    }

    if (finalPath.length < 2) {
      setTime(0);
      setCoins(0);
      setVisibleEvents([]);
      setFullServerEvents([]);
      setErrorMessage("The path must contain at least start and end stations.");
      setGameState("result");
      return;
    }

    const actualStart = finalPath[0].id;
    const actualEnd = finalPath[finalPath.length - 1].id;
    if (actualStart !== endpoints.start.id || actualEnd !== endpoints.end.id) {
      setTime(0);
      setCoins(0);
      setVisibleEvents([]);
      setFullServerEvents([]);
      setErrorMessage("Incomplete path or incorrect start/destination stations.");
      setGameState("result");
      return;
    }

    const secondsElapsed = (Date.now() - planningStart) / 1000;
    if (secondsElapsed > 93) {
      setTime(0);
      setCoins(0);
      setVisibleEvents([]);
      setFullServerEvents([]);
      setErrorMessage("Maximum time of 90 seconds exceeded for planning.");
      setGameState("result");
      return;
    }

    const data = finalPath.map((station) => station.id);

    if(!utils.validatePath(data, network)){
      setTime(0);
      setCoins(0);
      setVisibleEvents([]);
      setFullServerEvents([]);
      setErrorMessage("Invalid path or line interchange rules violated.");
      setGameState("result");
      return;
    }

    try {
      const response = await API.playGame(data);
      const events = utils.resolveStationNames(
        response.journeyEvents,
        finalPath,
      );
      setFullServerEvents(events);
      setErrorMessage(null);
      setCoins(events[0].coinsAfter);
      setVisibleEvents([events[0]]);
      setTime(0);
      setGameState("execution");
    } catch (error) {
      if (!error.error) {
        props.handleError();
        return;
      }
      setTime(0);
      setCoins(0);
      setVisibleEvents([]);
      setFullServerEvents([]);
      setErrorMessage(error.error || "Unable to complete the journey.");
      setGameState("result");
    }
  };

  // Restarts the game, resetting all relevant states
  const handleRestartGame = () => {
    setGameState("setup");
    setSelectedPath([]);
    setSelectedConnections([]);
    setEndpoints(null);
    setFullServerEvents([]);
    setCoins(20);
    setErrorMessage(null);
    setVisibleEvents([]);
  };

  // Handle step-by-step game execution visualization
  useEffect(() => {
    if (gameState !== "execution" || fullServerEvents.length < 1) return;

    let index = 0;

    const interval = setInterval(() => {
      index++;
      if (index >= fullServerEvents.length) {
        clearInterval(interval);
        setCoins((prevCoins) => (prevCoins < 0 ? 0 : prevCoins));
        setGameState("result");
        return;
      }
      setVisibleEvents((prev) => [...prev, fullServerEvents[index]]);
      setCoins(fullServerEvents[index].coinsAfter);
    }, 1500);

    return () => clearInterval(interval);
  }, [gameState, fullServerEvents]);

  // Game planning phase timer
  useEffect(() => {
    if (gameState !== "planning") return;

    const timeLeft = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timeLeft);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timeLeft);
  }, [gameState]);

  // Trigger submission when time runs out
  useEffect(() => {
    if (gameState === "planning" && time === 0) {
      handleSubmit();
    }
  }, [gameState, time]);

  return (
    <Container className="mt-3 mb-5 font-monospace">
      <Row className="gy-4">
        <Col lg={8} md={12}>
          <NetworkMap
            gamestate={gameState}
            network={network}
            endpoints={endpoints}
          />
        </Col>

        <Col lg={4} md={12}>
          {gameState === "setup" && (
            <SetupPanel onStartGame={handleStartGame} />
          )}

          {gameState === "planning" && (
            <PlanningPanel
              network={network}
              selectedConnections={selectedConnections}
              selectedPath={selectedPath}
              onConnectionClicked={handleConnectionClicked}
              onSubmit={handleSubmit}
              time={time}
            />
          )}

          {gameState === "execution" && (
            <ExecutionPanel coins={coins} visibleEvents={visibleEvents} />
          )}

          {gameState === "result" && (
            <ResultPanel
              coins={coins}
              fullServerEvents={fullServerEvents}
              visibleEvents={visibleEvents}
              errorMessage={errorMessage}
              onRestart={handleRestartGame}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default GamePage;
