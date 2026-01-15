// ================= IMPORTS =================
const { Client, GatewayIntentBits, EmbedBuilder, Partials } = require("discord.js");
const express = require("express");
const fs = require("fs");

// ================= KEEP ALIVE =================
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000);

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const ADMIN_ROLE = "1459409372118515998"; // tester role
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
    GatewayIntentBits.GuildMembers // 🔥 IMPORTANT
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log("🤖 MobileTiers Bot Ready");
});

// ================= COMMAND =================
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.guild) return; // ❌ DM ignore
  if (!msg.content.startsWith("!tier")) return;

  // SAFETY
  if (!msg.member) {
    return msg.reply("❌ Member cache error, try again");
  }

  // ROLE CHECK
  if (!msg.member.roles.cache.has(ADMIN_ROLE)) {
    return msg.reply("❌ Only testers can use this command");
  }

  const args = msg.content.trim().split(/\s+/);
  const ign = args[1];
  const mode = args[2];
  const tier = args[3];
  const region = args[4];

  if (!ign || !mode || !tier || !region) {
    return msg.reply("Usage: `!tier <IGN> <mode> <HT/LT> <AS/EU>`");
  }

  const MODE = mode.toLowerCase();
  const TIER = tier.toUpperCase();
  const REGION = region.toUpperCase();

  if (!TIERS[TIER]) return msg.reply("❌ Invalid tier");

  const db = loadDB();
  if (!db[ign]) {
    db[ign] = { region: REGION, modes: {} };
  }

  const oldTier = db[ign].modes[MODE];
  db[ign].modes[MODE] = TIER;
  db[ign].region = REGION;
  saveDB(db);

  syncToWebsite(ign, MODE, TIER, REGION);

  const points = totalPoints(db[ign]);
  const tag = combatTag(points);

  const embed = new EmbedBuilder()
    .setColor(0xf5c542)
    .setAuthor({ name: `${ign} • Tier Update 🏆` })
    .setThumbnail(`https://minotar.net/body/${ign}/120`)
    .setImage(`https://minotar.net/body/${ign}/300`)
    .addFields(
      { name: "Tester", value: `<@${msg.author.id}>`, inline: true },
      { name: "Region", value: REGION, inline: true },
      { name: "Mode", value: MODE.toUpperCase(), inline: true },
      { name: "Previous Tier", value: prettyTier(oldTier), inline: true },
      { name: "New Tier", value: prettyTier(TIER), inline: true },
      { name: "Combat Rank", value: `${tag} (${points} pts)`, inline: false }
    )
    .setFooter({ text: "MobileTiers • System" })
    .setTimestamp();

  const sent = await msg.channel.send({ embeds: [embed] });
  for (const r of ["👑", "🔥", "🏆", "😱", "💀"]) {
    await sent.react(r);
  }
});

// ================= LOGIN =================
client.login(TOKEN);
      
