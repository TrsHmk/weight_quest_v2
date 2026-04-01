// === MILESTONES ===
export const MILESTONES = [
  { target: 94, label: "Перший ривок", reward: "🍺 1 пиво на вихідних", emoji: "🏃" },
  { target: 92, label: "Фастфуд-пас", reward: "🍔 1 фастфуд на тиждень", emoji: "💪" },
  { target: 90, label: "Солодкий бонус", reward: "🍫 Солодощі 1 раз/тиждень", emoji: "🔥" },
  { target: 87, label: "Вільний вечір", reward: "🍕 Піца-вечір без обмежень", emoji: "⚡" },
  { target: 84, label: "Легенда", reward: "🎮 Повний чіт-дей 1 раз/тижд", emoji: "🏆" },
  { target: 80, label: "Бог Форми", reward: "👑 Режим підтримки — свобода", emoji: "👑" },
];

// === LEVELS ===
export const LEVELS = [
  { level: 1, name: "Новобранець", xpRequired: 0, avatar: "🐣" },
  { level: 2, name: "Воїн", xpRequired: 200, avatar: "⚔️" },
  { level: 3, name: "Лицар", xpRequired: 500, avatar: "🛡️" },
  { level: 4, name: "Паладін", xpRequired: 1000, avatar: "🗡️" },
  { level: 5, name: "Чемпіон", xpRequired: 2000, avatar: "🏅" },
  { level: 6, name: "Герой", xpRequired: 3500, avatar: "🦸" },
  { level: 7, name: "Легенда", xpRequired: 5000, avatar: "👑" },
];

// === ACHIEVEMENTS (secret) ===
export const ACHIEVEMENTS = [
  { id: "streak_14", name: "Залізна воля", description: "14 днів стрік без перерви", icon: "🔗", condition: (profile) => profile.best_streak >= 14 },
  { id: "steps_100k", name: "Марафонець", description: "100 000 кроків за весь час", icon: "👟", condition: (profile) => profile.total_steps >= 100000 },
  { id: "first_milestone", name: "Перший прорив", description: "Досягти першого мілстоуна", icon: "🎯", condition: (profile) => (profile.unlocked_milestones?.length || 0) >= 1 },
  { id: "all_milestones", name: "Непереможний", description: "Розблокувати всі мілстоуни", icon: "🏆", condition: (profile) => (profile.unlocked_milestones?.length || 0) >= 6 },
  { id: "saved_1000", name: "Банкір", description: "Заощадити 1000 грн", icon: "💰", condition: (profile) => (profile.total_money_saved || 0) >= 1000 },
  { id: "level_max", name: "Божество", description: "Досягти 7-го рівня", icon: "✨", condition: (profile) => profile.current_level >= 7 },
];

// === XP CALCULATIONS ===
export function calculateWeightXP(prevWeight, newWeight) {
  const diff = prevWeight - newWeight;
  if (diff > 0) return Math.round(diff * 100); // 100 XP per kg lost
  return 0;
}

export function calculateStepsXP(steps) {
  if (steps >= 12000) return 80;
  if (steps >= 7000) return 50;
  if (steps >= 5000) return 30;
  return 0;
}

export function calculateStepsMoney(steps) {
  if (steps >= 12000) return 30; // 30 UAH
  if (steps >= 7000) return 20;
  if (steps >= 5000) return 10;
  return 0;
}

export function calculateStreakXP(streakDay) {
  if (streakDay > 0 && streakDay % 7 === 0) return 100; // weekly streak bonus
  return 0;
}

// === PENALTY ZONE ===
export function getPenaltyZone(currentWeight, lowestWeight) {
  const gain = currentWeight - lowestWeight;
  if (gain >= 2) return "red";
  if (gain >= 1) return "yellow";
  return "none";
}

// === LEVEL CALCULATION ===
export function getLevelForXP(totalXP) {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.xpRequired) {
      currentLevel = level;
    }
  }
  return currentLevel;
}

export function getNextLevel(currentLevel) {
  const idx = LEVELS.findIndex(l => l.level === currentLevel);
  if (idx < LEVELS.length - 1) return LEVELS[idx + 1];
  return null;
}

// === MILESTONE CHECK ===
export function getUnlockedMilestones(weight) {
  return MILESTONES
    .map((m, i) => ({ ...m, index: i }))
    .filter(m => weight <= m.target);
}

// === BEER SAVINGS ===
const BEER_PRICE_UAH = 65;
export function calculateBeerSavings(daysWithoutBeer) {
  // Assume saving ~1 beer per 2 days on average
  return Math.floor(daysWithoutBeer / 2) * BEER_PRICE_UAH;
}

export { BEER_PRICE_UAH };