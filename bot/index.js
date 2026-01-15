// ================= IMPORTS =================
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const express = require("express");
const fs = require("fs");

// ✅ fetch fix (Render / Railway)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ================= KEEP ALIVE =================
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000);

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const ADMIN_ROLE = "1459409372118515998";
const DB_FILE = "./players.json";
const SERVER_API = "https://mobiletiers.onrender.com/api/update-tier";

// ================= TIERS =================
const TIERS = {
  HT1: 60, LT1: 45,
  HT2: 30, LT2: 20,
  HT3: 15, LT3: 12,
  HT4: 10, LT4: 8,
  HT5: 5,  LT5: 2
};

// ================= DB =================
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const data = fs.readFileSync(DB_FILE, "utf8").trim();
    if (!data) return {};
    return JSON.parse(data);
  } catch {
    return {};
  }
}
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ================= HELPERS =================
function prettyTier(t) {
  if (!t) return "Unranked";
  return t.replace("HT", "High Tier ").replace("LT", "Low Tier ");
}
function totalPoints(p) {
  return Object.values(p.modes || {}).reduce(
    (s, t) => s + (TIERS[t] || 0),
    0
  );
}
function combatTag(p) {
  if (p >= 400) return "Combat Grandmaster";
  if (p >= 300) return "Combat Master";
  if (p >= 200) return "Combat Ace";
  if (p >= 100) return "Combat Skilled";
  return "Rookie";
}

// ================= DISCORD CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log("🤖 MobileTiers Bot Ready");
});

// ================= !TIER COMMAND =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot || !msg.guild) return;

  // ===== WAITLIST PANEL COMMAND =====
  if (msg.content === "!waitlistpanel") {
    if (!msg.member.roles.cache.has(ADMIN_ROLE))
      return msg.reply("❌ No permission");

    const sendPanel = require("./waitlistpanel");
    return sendPanel(msg.channel);
  }

  // ===== TIER COMMAND =====
  if (!msg.content.startsWith("!tier")) return;

  if (!msg.member.roles.cache.has(ADMIN_ROLE))
    return msg.reply("❌ Only testers can use this command");

  const [, ign, mode, tier, region] = msg.content.split(/\s+/);
  if (!ign || !mode || !tier || !region)
    return msg.reply("Usage: `!tier <IGN> <mode> <HT/LT> <AS/EU>`");

  const MODE = mode.toLowerCase();
  const TIER = tier.toUpperCase();
  const REGION = region.toUpperCase();
  if (!TIERS[TIER]) return msg.reply("❌ Invalid tier");

  const db = loadDB();
  if (!db[ign]) db[ign] = { region: REGION, modes: {} };

  const oldTier = db[ign].modes[MODE];
  db[ign].modes[MODE] = TIER;
  db[ign].region = REGION;
  saveDB(db);

  fetch(SERVER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ign, mode: MODE, tier: TIER, region: REGION })
  }).catch(() => {});

  const points = totalPoints(db[ign]);
  const tag = combatTag(points);

  const embed = {
    color: 0x0f172a,
    author: { name: `${ign}'s Test Results 🏆` },
    thumbnail: { url: `https://minotar.net/body/${ign}/120` },
    fields: [
      { name: "Tester", value: `<@${msg.author.id}>` },
      { name: "Region", value: REGION, inline: true },
      { name: "Mode", value: MODE.toUpperCase(), inline: true },
      { name: "Previous Rank", value: prettyTier(oldTier) },
      { name: "Rank Earned", value: prettyTier(TIER) },
      { name: "Combat Rank", value: `${tag} (${points} pts)` }
    ],
    footer: { text: "MobileTiers • Official Tier System" },
    timestamp: new Date()
  };

  const sent = await msg.channel.send({ embeds: [embed] });
  for (const r of ["👑", "🔥", "🏆", "😱", "💀"]) await sent.react(r);
});

// ================= INTERACTIONS =================
const interactionHandler = require("./interactionhandler");
client.on("interactionCreate", interactionHandler);

// ================= LOGIN =================
client.login(TOKEN);
