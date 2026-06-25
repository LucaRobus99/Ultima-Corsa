import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout.jsx";
import HomePage from "./components/HomePage.jsx";
import GamePage from "./components/GamePage.jsx";
import NotFound from "./components/NotFound.jsx";
import LeaderboardPage from "./components/Leaderboard.jsx";
import api from "./api/api.js";

// Main App component with routing and auth
function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if user is logged in
    const checkAuth = async () => {
      try {
        const loggedUser = await api.getUserInfo();
        setLoggedIn(true);
        setUser(loggedUser);
      } catch {
        // Unauthenticated, standard behavior, nothing to log
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // handle user logout
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignored
    } finally {
      setLoggedIn(false);
      setUser(null);
    }
  };

  // synchronously reset user state on critical errors
  const handleError = () => {
    setLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  // handle user login
  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await api.login(credentials);
      setLoggedIn(true);
      setUser(loggedUser);
    } catch (error) {
      if (!error.error) {
        handleError();
      }
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 font-monospace bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <div className="text-muted small">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        element={
          <Layout
            loggedIn={loggedIn}
            handleLogout={handleLogout}
            user={user}
          />
        }
      >
        <Route
          path="/"
          element={
            <HomePage loggedIn={loggedIn} login={handleLogin} user={user} />
          }
        />
        <Route
          path="/game"
          element={
            loggedIn ? (
              <GamePage user={user} loggedIn={loggedIn} handleError={handleError} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/leaderboard"
          element={loggedIn ? <LeaderboardPage handleError={handleError} /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
