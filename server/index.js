const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/players", require("./routes/players"));

app.listen(3001, () => console.log("API running on 3001"));
