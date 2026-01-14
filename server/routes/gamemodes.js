const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DB_FILE = path.join(process.cwd(), "players.json");

const TIER_POINTS = {
  HT1: 60, LT1: 45,
  HT2: 30, LT2: 20,
  HT3: 15, LT3: 12,
  HT4: 10, LT4: 8,
  HT5: 5,  LT5: 2
};

router.get("/:mode", (req, res) => {
  const mode = req.params.mode.toLowerCase();
  const players = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

  const ranked = Object.values(players)
    .filter(p => p.modes?.[mode])
    .map(p => ({
      ign: p.ign,
      region: p.region,
      tier: p.modes[mode],
      points: TIER_POINTS[p.modes[mode]] || 0
    }))
    .sort((a, b) => b.points - a.points);

  res.json(ranked);
});

module.exports = router;
