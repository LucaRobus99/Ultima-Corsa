# Ultima Corsa Game

**Ultima Corsa** is an interactive Single-Page Application (SPA) built with React and Node.js. Developed as an advanced project during my Master's Degree in Computer Engineering, the game is a single-player management adventure inspired by the board game "Race the Rails". Players must plan optimal routes across a fictional subway network while managing random events and strict time limits.

## Game Overview

The player has to navigate a complex subway network featuring multiple lines and interchange stations. At the start of every game, a departure and destination station are randomly assigned.

The game loop is divided into three crucial phases:

1. **Setup:** Free exploration of the complete network map.
2. **Planning (Time-Attack):** The player has 90 seconds to mentally reconstruct the network (which is only partially visible) and sequentially select the routes to reach their destination.
3. **Execution:** The application algorithmically validates the path. If valid, the train departs: at each stop, the player faces random events (positive or negative) that will affect their final coin score.

## 💻 Tech Stack

| Component | Technologies Used |
| --- | --- |
| **Front-end** | React, React Router, JavaScript (ES6+), Bootstrap, SVG (for custom map rendering) |
| **Back-end** | Node.js, Express.js |
| **Database** | SQLite |
| **Authentication** | Passport.js (Session-based via Cookie), Salted Password Hashing |
| **Architecture** | "Two-Server" Pattern, RESTful HTTP APIs, CORS |

## ✨ Key Features & Technical Challenges

* **Path Validation Engine:** Developed complex logic on both the client and server sides to ensure the submitted path is contiguous, respects line constraints, and correctly utilizes interchange hubs.
* **Advanced React State Management:** Intensive use of contexts, hooks, and effects to manage the game lifecycle, including strict synchronization of the 90-second timer and phase transitions (Setup -> Planning -> Execution).
* **Dynamic Vector Rendering:** The subway map is rendered using SVG components in React (`<line>`, `<circle>`), allowing for smooth interactivity and real-time highlighting of the user's selected route.
* **Secure and Protected APIs:** Express-based backend architecture with route protection middleware. Access to gameplay features and the leaderboard is strictly limited to authenticated users.
* **Global Leaderboard:** Persistent score tracking system in the SQLite database, with data extraction and sorting of the best results for the global ranking.

## 📸 Screenshots

*(Replace the paths below with the actual links to your images inside the repository)*

## 🚀 How to Run Locally

The project uses the "two-server" pattern (separate frontend and backend). Make sure you have **Node.js (v24.x LTS)** installed.

**1. Start the Back-end (API Server):**

```bash
cd server
npm install
npm run dev # or nodemon index.js

```

**2. Start the Front-end (React Client):**

```bash
# In a new terminal window
cd client
npm install
npm run dev

```

The client will be available at `http://localhost:5173` (or the port specified by Vite/React), while the API server will respond on its designated port (e.g., `3001`).

## 📚 Main API Structure

* `POST /api/sessions` - User authentication.
* `GET /api/network` - Retrieve network topology (stations, lines, connections).
* `GET /api/game/planning` - Initialize game and generate destinations.
* `POST /api/game/execution` - Submit the path and resolve random events.
* `GET /api/leaderboard` - Retrieve the global ranking.

---

*Designed and developed by **Luca Robustelli**.*
