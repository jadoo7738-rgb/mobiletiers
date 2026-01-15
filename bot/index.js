// ================= IMPORTS =================
const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require("discord.js");
const express = require("express");
const fs = require("fs");

// ✅ IMPORTANT: fetch fix (Railway / Render safe)
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
    const raw = fs.readFileSync(DB_FILE, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ================= HELPERS =================
function prettyTier(tier) {
  if (!tier) return "Unranked";
  return tier.replace("HT", "High Tier ").replace("LT", "Low Tier ");
}

function totalPoints(player) {
  return Object.values(player.modes || {}).reduce(
    (s, t) => s + (TIERS[t] || 0),
    0
  );
}

function combatTag(points) {
  if (points >= 400) return "Combat Grandmaster";
  if (points >= 300) return "Combat Master";
  if (points >= 200) return "Combat Ace";
  if (points >= 100) return "Combat Skilled";
  return "Rookie";
}

// ================= WEBSITE SYNC =================
async function syncToWebsite(ign, mode, tier, region) {
  try {
    await fetch(SERVER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign, mode, tier, region })
    });
  } catch {
    console.log("❌ Website sync failed");
  }
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

// ================= COMMAND =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if (!msg.content.startsWith("!tier")) return;

  if (!msg.member.roles.cache.has(ADMIN_ROLE)) {
    return msg.reply("❌ Only testers can use this command");
  }

  const [, ign, mode, tier, region] = msg.content.trim().split(/\s+/);
  if (!ign || !mode || !tier || !region) {
    return msg.reply("Usage: `!tier <IGN> <mode> <HT/LT> <AS/EU>`");
  }

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

  // 🔥 SYNC TO WEBSITE
  syncToWebsite(ign, MODE, TIER, REGION);

  // ✅ MISSING PART FIXED
  const points = totalPoints(db[ign]);
  const tag = combatTag(points);

  // ================= EMBED =================
  const embed = new EmbedBuilder()
    .setColor(0x0f172a)
    .setAuthor({ name: `${ign}'s Test Results 🏆` })
    .setThumbnail(`https://minotar.net/body/${ign}/120`)
    .addFields(
      { name: "Tester", value: `<@${msg.author.id}>` },
      { name: "Region", value: REGION, inline: true },
      { name: "Mode", value: MODE.toUpperCase(), inline: true },
      { name: "Previous Rank", value: prettyTier(oldTier) },
      { name: "Rank Earned", value: prettyTier(TIER) },
      { name: "Combat Rank", value: `${tag} (${points} pts)` }
    )
    .setFooter({ text: "MobileTiers • Official Tier System" })
    .setTimestamp();

  const sent = await msg.channel.send({ embeds: [embed] });
  for (const r of ["👑", "🔥", "🏆", "😱", "💀"]) await sent.react(r);
});
const interactionHandler = require("./interactionhandler");

client.on("interactionCreate", async (interaction) => {
  await interactionHandler(interaction);
});
// ================= LOGIN =================
client.login(TOKEN);

