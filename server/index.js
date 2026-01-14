const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/players"));
app.use("/api", require("./routes/gamemodes"));

app.get("/", (_, res) => res.send("MobileTiers API Running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on", PORT));
