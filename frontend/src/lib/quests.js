export const QUEST_TEMPLATES = [
  { id: 'log_today',       icon: '📝', name: 'Перший крок',       desc: 'Запиши свою вагу сьогодні',           type: 'log',              chest: 'chest_wood',      difficulty: 'easy' },
  { id: 'steps_3k',        icon: '🚶', name: 'Вечірня прогулянка', desc: 'Зроби 3 000 кроків',                 type: 'steps',  target: 3000,  chest: 'chest_wood',    difficulty: 'easy' },
  { id: 'not_red_zone',    icon: '🟢', name: 'Тримайся зеленого', desc: 'Не потрапи в червону зону сьогодні',  type: 'not_red',          chest: 'chest_wood',      difficulty: 'easy' },
  { id: 'steps_7k',        icon: '🏃', name: 'Пів-марафонець',    desc: 'Зроби 7 000 кроків',                  type: 'steps',  target: 7000,  chest: 'chest_iron',    difficulty: 'medium' },
  { id: 'weight_loss_any', icon: '📉', name: 'Хоч трохи менше',  desc: 'Стань легше ніж вчора',               type: 'weight_loss',      chest: 'chest_iron',      difficulty: 'medium' },
  { id: 'streak_3',        icon: '🔥', name: '3 дні підряд',      desc: 'Підтримай стрік хоча б 3 дні',       type: 'streak', target: 3,     chest: 'chest_iron',    difficulty: 'medium' },
  { id: 'steps_10k',       icon: '⚡', name: '10 000 кроків',     desc: 'Зроби 10 000 кроків',                 type: 'steps',  target: 10000, chest: 'chest_gold',    difficulty: 'hard' },
  { id: 'streak_7',        icon: '🗓️', name: 'Тижень без зриву',  desc: 'Підтримай стрік 7 днів',             type: 'streak', target: 7,     chest: 'chest_gold',    difficulty: 'hard' },
  { id: 'steps_12k',       icon: '🦶', name: 'Козацький крок',    desc: 'Зроби 12 000 кроків',                 type: 'steps',  target: 12000, chest: 'chest_gold',    difficulty: 'hard' },
  { id: 'steps_15k',       icon: '🦅', name: 'Марафонець',        desc: 'Зроби 15 000 кроків',                 type: 'steps',  target: 15000, chest: 'chest_epic',    difficulty: 'epic' },
  { id: 'streak_14',       icon: '💀', name: '2 тижні сили',      desc: 'Підтримай стрік 14 днів',             type: 'streak', target: 14,    chest: 'chest_epic',    difficulty: 'epic' },
  { id: 'steps_20k',       icon: '🏆', name: 'Козацький марш',    desc: 'Зроби 20 000 кроків',                 type: 'steps',  target: 20000, chest: 'chest_legendary', difficulty: 'legendary' },
  { id: 'streak_30',       icon: '👑', name: 'Місяць сили',       desc: 'Підтримай стрік 30 днів',             type: 'streak', target: 30,    chest: 'chest_legendary', difficulty: 'legendary' },
];

export const DIFFICULTY_CONFIG = {
  easy:       { label: 'Легко',       color: 'text-slate-400',  border: 'border-slate-600' },
  medium:     { label: 'Середньо',    color: 'text-green-400',  border: 'border-green-600/60' },
  hard:       { label: 'Важко',       color: 'text-blue-400',   border: 'border-blue-500/60' },
  epic:       { label: 'Епічно',      color: 'text-purple-400', border: 'border-purple-500/70' },
  legendary:  { label: 'Легендарно',  color: 'text-yellow-400', border: 'border-yellow-400/80' },
};

/** Returns progress value 0..1 for a quest given current log data */
export function getQuestProgress(quest, { steps = 0, streak = 0, logged = false, weightLost = false, notRed = true }) {
  if (quest.completed) return 1;
  switch (quest.type) {
    case 'log':         return logged ? 1 : 0;
    case 'steps':       return Math.min(1, (steps || 0) / quest.target);
    case 'streak':      return Math.min(1, (streak || 0) / quest.target);
    case 'weight_loss': return weightLost ? 1 : 0;
    case 'not_red':     return notRed ? 1 : 0;
    default:            return 0;
  }
}
