// ================= IMPORTS =================
const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require("discord.js");
const express = require("express");
const fs = require("fs");

// ================= KEEP ALIVE (Render/Replit) =================
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000);

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const ADMIN_ROLE = "1459409372118515998"; // tester role
const DB_FILE = "./players.json";

// 🔥 PUT YOUR REAL SERVER URL HERE (AFTER HOST)
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
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
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
  if (!player.modes) return 0;
  return Object.values(player.modes).reduce(
    (sum, tier) => sum + (TIERS[tier] || 0),
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
async function syncToWebsite(ign, mode, tier) {
  try {
    await fetch(SERVER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ign, mode, tier })
    });
  } catch (e) {
    console.log("❌ Website sync failed");
  }
}

// ================= DISCORD CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log("🤖 MobileTiers Bot Ready");
});

// ================= MESSAGE COMMAND =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // ================= TIER COMMAND =================
  if (!msg.content.startsWith("!tier")) return;

  if (!msg.member.roles.cache.has(ADMIN_ROLE)) {
    return msg.reply("❌ Only testers can use this command");
  }

  // !tier IGN MODE TIER REGION
  const [_, ign, mode, tier, region] = msg.content.split(" ");

  if (!ign || !mode || !tier || !region) {
    return msg.reply(
      "Usage: `!tier <IGN> <mode> <HT/LT> <AS/EU>`"
    );
  }

  const MODE = mode.toLowerCase();
  const TIER = tier.toUpperCase();

  if (!TIERS[TIER]) return msg.reply("❌ Invalid tier");

  const db = loadDB();

  if (!db[ign]) {
    db[ign] = {
      region: region.toUpperCase(),
      createdAt: new Date().toISOString(),
      modes: {}
    };
  }

  const oldTier = db[ign].modes[MODE];

  // 🔥 overwrite tier for that gamemode
  db[ign].modes[MODE] = TIER;
  db[ign].region = region.toUpperCase();

  saveDB(db);

  // 🔥 WEBSITE AUTO UPDATE
  syncToWebsite(ign, MODE, TIER);

  const points = totalPoints(db[ign]);
  const tag = combatTag(points);

  // ================= EMBED =================
  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setAuthor({ name: `${ign}'s Test Results 🏆` })
    .setThumbnail(`https://minotar.net/helm/${ign}/128`)
    .addFields(
      { name: "Tester", value: `<@${msg.author.id}>`, inline: false },
      { name: "Region", value: db[ign].region, inline: false },
      { name: "Username", value: ign, inline: false },
      { name: "Previous Rank", value: prettyTier(oldTier), inline: false },
      { name: "Rank Earned", value: prettyTier(TIER), inline: false },
      { name: "Combat Rank", value: `${tag} (${points} pts)`, inline: false }
    )
    .setFooter({ text: "MobileTiers • Auto Sync Enabled" })
    .setTimestamp();

  const sent = await msg.channel.send({ embeds: [embed] });
  for (const r of ["👑", "🎉", "😱", "😂", "💀"]) {
    await sent.react(r);
  }
});

// ================= LOGIN =================

client.login(TOKEN);