const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DB_FILE = path.join(__dirname, "../data/players.json");

// ================= LOAD PLAYERS =================
function loadPlayers() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// ================= GET ALL PLAYERS =================
router.get("/", (req, res) => {
  try {
    const players = loadPlayers();
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load players" });
  }
});

// ================= GET PLAYER BY IGN =================
router.get("/:ign", (req, res) => {
  try {
    const players = loadPlayers();
    const player = players.find(
      p => p.ign.toLowerCase() === req.params.ign.toLowerCase()
    );

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load player" });
  }
});

module.exports = router;
