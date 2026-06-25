import { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/api.js";

// Leaderboard page displaying top scores
function LeaderboardPage(props) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        if (!err.error) {
          props.handleError();
          return;
        }
        setError(err.error || "Unable to load the leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [props]);

  if (loading) {
    return (
      <div className="text-center py-5 font-monospace text-secondary">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4 text-center font-monospace">
        <Alert variant="danger" className="small">
          {error}
        </Alert>
        <Button as={Link} to="/" variant="primary">
          Home
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 font-monospace mx-auto max-w-600">
      <div className="p-3 bg-primary text-light rounded shadow-sm text-center mb-4">
        <h2 className="fw-bold m-0 text-uppercase fs-4 text-white">
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          Leaderboard
        </h2>
      </div>

      {leaderboard.length === 0 ? (
        <p className="text-center text-muted small">No scores available yet.</p>
      ) : (
        <Table hover striped className="text-dark align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th className="text-end">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.username}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td className="text-end fw-bold">
                  {entry.bestScore} <i className="bi bi-coin"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="text-center mt-4">
        <Button as={Link} to="/" variant="outline-primary" size="sm">
          Back to Home
        </Button>
      </div>
    </Container>
  );
}

export default LeaderboardPage;
