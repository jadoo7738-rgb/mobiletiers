// ================= IMPORTS =================
const express = require("express");
const path = require("path");

// ================= ROUTES =================
const playersRoute = require("./routes/players");

// ================= APP =================
const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROOT TEST =================
app.get("/", (req, res) => {
  res.send("MobileTiers API Running");
});

// ================= API ROUTES =================
app.use("/api/players", playersRoute);

// ================= PORT =================
const PORT = process.env.PORT || 10000;

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 MobileTiers API running on port ${PORT}`);
});
