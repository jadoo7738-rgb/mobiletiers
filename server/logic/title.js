module.exports.getTitle = (points) => {
  if (points >= 400) return "Combat Grandmaster";
  if (points >= 300) return "Combat Master";
  if (points >= 200) return "Combat Ace";
  return "Unranked";
};
