const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DB_FILE = path.join(process.cwd(), "players.json");

// ================= LOAD =================
function loadPlayers() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// ================= ALL PLAYERS =================
router.get("/", (req, res) => {
  try {
    const players = loadPlayers();
    res.json(players);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load players" });
  }
});

// ================= SINGLE PLAYER =================
router.get("/:ign", (req, res) => {
  try {
    const players = loadPlayers();

    const ign = req.params.ign.toLowerCase().trim();

    const player = players.find(
      p => p.ign.toLowerCase().trim() === ign
    );

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(player);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load player" });
  }
});

module.exports = router;
