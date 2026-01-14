module.exports.TIER_POINTS = {
  HT1: 60, LT1: 45,
  HT2: 30, LT2: 20,
  HT3: 15, LT3: 12,
  HT4: 10, LT4: 8,
  HT5: 5,  LT5: 2
};

module.exports.calculateOverall = (modes) => {
  return Object.values(modes).reduce(
    (sum, tier) => sum + (module.exports.TIER_POINTS[tier] || 0),
    0
  );
};
