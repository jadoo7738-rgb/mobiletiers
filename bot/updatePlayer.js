const axios = require("axios");

module.exports.updateTier = async (ign, mode, tier) => {
  await axios.post("https://YOUR_API/api/update", {
    ign,
    mode,
    tier
  });
};
