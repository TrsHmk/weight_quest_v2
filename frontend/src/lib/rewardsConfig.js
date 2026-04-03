// ── НАГОРОДИ ЗА СТРІК ──────────────────────────────────
export const STREAK_REWARDS = [
  { streak: 3,  id: 'streak_3',  icon: '☕', title: 'Кава з десертом',       desc: '3 дні стріку — заслужив солодке!' },
  { streak: 7,  id: 'streak_7',  icon: '🍺', title: 'Пивко на вихідних',    desc: '7 днів без зриву — герой. Насолоджуйся!' },
  { streak: 14, id: 'streak_14', icon: '🍕', title: 'Піца без каяття',      desc: '2 тижні дисципліни — будь-яка піца дозволена!' },
  { streak: 21, id: 'streak_21', icon: '🎉', title: 'Повний чіт-дей',       desc: '3 тижні стріку — їж що хочеш, весь день!' },
  { streak: 30, id: 'streak_30', icon: '🍽️', title: 'Ресторан на вибір',    desc: 'Місяць стріку. Легенда. Обирай будь-який ресторан!' },
];

// ── НАГОРОДИ ЗА СКИНУТУ ВАГУ ──────────────────────────
export const WEIGHT_REWARDS = [
  { lost: 1,  id: 'lost_1',  icon: '🍦', title: 'Морозиво',               desc: 'Мінус 1 кг — порція морозива дозволена!' },
  { lost: 3,  id: 'lost_3',  icon: '🍔', title: 'Бургер на вихідних',     desc: 'Мінус 3 кг — один бургер заслужено!' },
  { lost: 5,  id: 'lost_5',  icon: '🍣', title: 'Суші без обмежень',      desc: 'Мінус 5 кг — суші-бар чекає!' },
  { lost: 10, id: 'lost_10', icon: '👔', title: 'Нове вбрання',            desc: 'Мінус 10 кг — час оновити гардероб!' },
  { lost: 15, id: 'lost_15', icon: '🏖️', title: 'Відпустка-нагорода',     desc: 'Мінус 15 кг — ти заслужив пляж!' },
];

// ── НАГОРОДИ ЗА КРОКИ ─────────────────────────────────
export const STEP_REWARDS = [
  { steps: 10000, id: 'steps_10k', icon: '🥐', title: 'Перекус без каяття',  desc: '10K кроків — перекус заслужено!' },
  { steps: 15000, id: 'steps_15k', icon: '🌯', title: 'Шаурма VIP',          desc: '15K кроків — шаурма з подвійним м\'ясом!' },
  { steps: 20000, id: 'steps_20k', icon: '🍰', title: 'Торт на вечерю',      desc: '20K кроків — їж торт і не червоній!' },
];

// ── ПОКАРАННЯ / ЧЕЛЕНДЖІ ──────────────────────────────
export const PUNISHMENTS = {
  weight_up: [
    { id: 'p_squats_30',   icon: '🏋️', title: '30 присідань',           desc: 'Вага зросла — присідай прямо зараз!' },
    { id: 'p_pushups_20',  icon: '💪', title: '20 віджимань',            desc: 'Вага зросла — віджимайся!' },
    { id: 'p_read_10',     icon: '📖', title: '10 сторінок книги',       desc: 'Вага зросла — прокачай мозок!' },
    { id: 'p_plank_60',    icon: '🧘', title: '60 секунд планка',        desc: 'Вага зросла — тримай планку!' },
  ],
  weight_up_big: [
    { id: 'p_big_combo',   icon: '🔥', title: '50 присідань + 20 віджимань', desc: 'Вага різко зросла — повний комбо!' },
    { id: 'p_walk_3km',    icon: '🚶', title: '3 км прогулянка',         desc: 'Вага різко зросла — йди гуляти!' },
  ],
  streak_break: [
    { id: 'p_streak_pushups', icon: '💔', title: '30 віджимань',          desc: 'Стрік зірвано — відпрацюй!' },
    { id: 'p_streak_run',    icon: '🏃', title: '15 хвилин бігу',         desc: 'Стрік зірвано — біжи і думай!' },
    { id: 'p_streak_read',   icon: '📚', title: '20 сторінок книги',      desc: 'Стрік зірвано — хоча б мозок прокачай!' },
  ],
  yellow_zone: [
    { id: 'p_yellow_read',   icon: '📖', title: '10 сторінок книги',      desc: 'Жовта зона — час для розуму!' },
    { id: 'p_yellow_walk',   icon: '🚶', title: '3000 кроків додатково',   desc: 'Жовта зона — ходи більше!' },
  ],
  red_zone: [
    { id: 'p_red_walk',     icon: '🚶', title: '5000 кроків + 50 присідань', desc: 'Червона зона — серйозне покарання!' },
    { id: 'p_red_full',     icon: '😤', title: '30 віджимань + 30 присідань + 2 км', desc: 'Червона зона — повна відпрацьовка!' },
  ],
};

// Pick a random punishment from a category
export function pickPunishment(category) {
  const pool = PUNISHMENTS[category];
  if (!pool || !pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Check which streak rewards are newly earned
export function checkStreakRewards(currentStreak, earnedRewardIds) {
  return STREAK_REWARDS.filter(
    r => currentStreak >= r.streak && !earnedRewardIds.has(r.id)
  );
}

// Check which weight loss rewards are newly earned
export function checkWeightRewards(startWeight, currentWeight, earnedRewardIds) {
  const lost = startWeight - currentWeight;
  return WEIGHT_REWARDS.filter(
    r => lost >= r.lost && !earnedRewardIds.has(r.id)
  );
}

// Check which step rewards apply today
export function checkStepRewards(steps, earnedTodayIds) {
  return STEP_REWARDS.filter(
    r => steps >= r.steps && !earnedTodayIds.has(r.id)
  );
}
