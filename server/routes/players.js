const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DB_FILE = path.join(process.cwd(), "players.json");

function loadPlayers() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// ALL PLAYERS
router.get("/", (req, res) => {
  const players = loadPlayers();
  res.json(Object.values(players));
});

// SINGLE PLAYER (case-insensitive)
router.get("/:ign", (req, res) => {
  const players = loadPlayers();
  const ign = req.params.ign.toLowerCase();

  const player = Object.values(players).find(
    p => p.ign.toLowerCase() === ign
  );

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  res.json(player);
});

module.exports = router;
