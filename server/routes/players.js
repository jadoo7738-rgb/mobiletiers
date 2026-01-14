const fs = require("fs");
const { calculateOverall } = require("../logic/tiers");
const { getTitle } = require("../logic/title");

const router = require("express").Router();
const FILE = __dirname + "/../data/players.json";

router.get("/", (req, res) => {
  const players = JSON.parse(fs.readFileSync(FILE));
  players.forEach(p => {
    p.points = calculateOverall(p.modes);
    p.title = getTitle(p.points);
  });
  players.sort((a, b) => b.points - a.points);
  res.json(players);
});

router.get("/:ign", (req, res) => {
  const players = JSON.parse(fs.readFileSync(FILE));
  const p = players.find(x => x.ign === req.params.ign);
  if (!p) return res.status(404).json({ error: "Not found" });

  p.points = calculateOverall(p.modes);
  p.title = getTitle(p.points);
  res.json(p);
});

module.exports = router;
