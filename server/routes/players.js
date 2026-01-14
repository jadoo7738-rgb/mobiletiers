const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DATA_FILE = path.join(__dirname, "../data/players.json");

function loadPlayers() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

/**
 * GET /api/players
 * All players (overall leaderboard)
 */
router.get("/", (req, res) => {
  try {
    const db = loadPlayers();

    // 🔥 object → array
    const players = Object.values(db);

    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load players" });
  }
});

/**
 * GET /api/players/:ign
 * Single player profile
 */
router.get("/:ign", (req, res) => {
  try {
    const db = loadPlayers();
    const ign = req.params.ign;

    if (!db[ign]) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(db[ign]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load player" });
  }
});

module.exports = router;
