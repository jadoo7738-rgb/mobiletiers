// ================= IMPORTS =================
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// ================= APP =================
const app = express();
app.use(cors());
app.use(express.json());

// ================= FILE PATH =================
const DB_FILE = path.join(process.cwd(), "players.json");

// ================= HELPERS =================
function loadPlayers() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function savePlayers(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ================= TIER POINTS =================
const TIER_POINTS = {
  HT1: 60, LT1: 45,
  HT2: 30, LT2: 20,
  HT3: 15, LT3: 12,
  HT4: 10, LT4: 8,
  HT5: 5,  LT5: 2
};

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("✅ MobileTiers API Running");
});

// ================= ALL PLAYERS =================
app.get("/api/players", (req, res) => {
  const players = loadPlayers();
  res.json(Object.values(players));
});

// ================= SINGLE PLAYER =================
app.get("/api/players/:ign", (req, res) => {
  const ign = req.params.ign.toLowerCase();
  const players = loadPlayers();

  const player = Object.values(players).find(
    p => p.ign.toLowerCase() === ign
  );

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  res.json(player);
});

// ================= GAMEMODE RANKING =================
app.get("/api/gamemode/:mode", (req, res) => {
  const mode = req.params.mode.toLowerCase();
  const players = loadPlayers();

  const ranked = Object.values(players)
    .filter(p => p.modes && p.modes[mode])
    .map(p => ({
      ign: p.ign,
      region: p.region,
      tier: p.modes[mode],
      points: TIER_POINTS[p.modes[mode]] || 0
    }))
    .sort((a, b) => b.points - a.points);

  res.json(ranked);
});

// ================= BOT → API UPDATE =================
app.post("/api/update-tier", (req, res) => {
  const { ign, mode, tier } = req.body;
  if (!ign || !mode || !tier) {
    return res.status(400).json({ error: "Missing data" });
  }

  const players = loadPlayers();

  if (!players[ign]) {
    players[ign] = {
      ign,
      region: "AS",
      modes: {}
    };
  }

  players[ign].modes[mode.toLowerCase()] = tier.toUpperCase();
  savePlayers(players);

  res.json({ success: true });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 API running on ${PORT}`);
});
