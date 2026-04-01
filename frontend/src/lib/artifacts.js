export const ARTIFACTS = [
  // ── COMMON ───────────────────────────────────────────────
  {
    id: 'old_dumbbell',
    name: 'Стара Гантеля',
    icon: '🏋️',
    rarity: 'common',
    desc: 'Знайшов у бабусиному підвалі. Пахне совком.',
    effect: '+10 XP, але зроби 10 присідань прямо зараз',
    type: 'debuff_quest',
  },
  {
    id: 'protein_bar_fake',
    name: 'Протеїновий Батончик',
    icon: '🍫',
    rarity: 'common',
    desc: 'На упаковці написано 20г білка. Брехня.',
    effect: '+15 XP бонус до наступного запису',
    type: 'xp_bonus',
    value: 15,
  },
  {
    id: 'motivation_post',
    name: 'Мотивуючий Пост',
    icon: '📱',
    rarity: 'common',
    desc: '"Ти можеш усе!" — написав інфлюенсер з ліпосакцією',
    effect: '+5 XP та нескінченний сором за бездіяльність',
    type: 'xp_bonus',
    value: 5,
  },
  {
    id: 'gym_selfie',
    name: 'Селфі з Тренажерки',
    icon: '🤳',
    rarity: 'common',
    desc: 'Якщо не запостив — ніби й не тренувався',
    effect: 'Дебаф: зроби 15 стрибків на місці',
    type: 'debuff_quest',
  },

  // ── UNCOMMON ─────────────────────────────────────────────
  {
    id: 'adidas_shoes',
    name: 'Кросівки "Адідас"',
    icon: '👟',
    rarity: 'uncommon',
    desc: 'Три смужки — три причини йти гуляти',
    effect: '+25 XP якщо сьогодні 10k+ кроків',
    type: 'steps_bonus',
    value: 25,
  },
  {
    id: 'cossack_thermos',
    name: 'Термос Козака',
    icon: '☕',
    rarity: 'uncommon',
    desc: 'Гарячий чай зігріває тіло і стрік',
    effect: 'Захист стріку: пропусти 1 день без скидання',
    type: 'streak_shield',
    value: 1,
  },
  {
    id: 'premium_buckwheat',
    name: 'Гречка Преміум',
    icon: '🍲',
    rarity: 'uncommon',
    desc: 'Золотий запас нації. Справжня.',
    effect: '+30 XP за правильне харчування сьогодні',
    type: 'xp_bonus',
    value: 30,
  },
  {
    id: 'yoga_mat',
    name: 'Килимок для Йоги',
    icon: '🧘',
    rarity: 'uncommon',
    desc: 'Використовується як підстилка для кота',
    effect: 'Дебаф: 5 хвилин розтяжки або -10 XP',
    type: 'debuff_or_penalty',
    value: 10,
  },

  // ── RARE ─────────────────────────────────────────────────
  {
    id: 'lviv_beer',
    name: 'Пиво Львівське 1715',
    icon: '🍺',
    rarity: 'rare',
    desc: 'Заслужив, воїне. Місто лева схвалює.',
    effect: 'Дозволяє 1 пиво без жодних штрафів',
    type: 'allow_beer',
    value: 1,
  },
  {
    id: 'magic_burger',
    name: 'Бургер МакМагічний',
    icon: '🍔',
    rarity: 'rare',
    desc: '"Та один бургер не рахується" — Sun Tzu',
    effect: '1 фастфуд без штрафних санкцій',
    type: 'allow_fastfood',
    value: 1,
  },
  {
    id: 'lucky_scales',
    name: 'Щасливі Ваги',
    icon: '⚖️',
    rarity: 'rare',
    desc: 'Показують на 0.5 кг менше. Технічно не брехня.',
    effect: '-0.5 кг від зафіксованої ваги (лише один раз)',
    type: 'weight_reduce',
    value: 0.5,
  },
  {
    id: 'uncle_bob_advice',
    name: 'Порада Дядька Бориса',
    icon: '👴',
    rarity: 'rare',
    desc: '"Я в твої роки 20 км пішки ходив на роботу"',
    effect: '+50 XP, але зроби 20 хвилин прогулянки',
    type: 'debuff_quest_bonus',
    value: 50,
  },

  // ── EPIC ─────────────────────────────────────────────────
  {
    id: 'cheat_ring',
    name: 'Кільце Чіт-Коду',
    icon: '💍',
    rarity: 'epic',
    desc: '↑↑↓↓←→←→BA. Активовано. Штрафи відключені.',
    effect: 'Ігнорує штрафну зону 1 раз (навіть червону)',
    type: 'penalty_immunity',
    value: 1,
  },
  {
    id: 'schwarzenegger_ghost',
    name: 'Привид Шварценеггера',
    icon: '👻',
    rarity: 'epic',
    desc: '"I\'ll be back... після тренування" — Арнольд',
    effect: '+150 XP та 5000 безкоштовних кроків зараховано',
    type: 'xp_bonus',
    value: 150,
  },
  {
    id: 'weight_joystick',
    name: 'Джойстик Ваги',
    icon: '🎮',
    rarity: 'epic',
    desc: 'Press X to lose weight. Press B для бургера.',
    effect: '2x XP за наступний щоденний запис',
    type: 'xp_multiplier',
    value: 2,
  },
  {
    id: 'shaurma_vip',
    name: 'Шаурма VIP',
    icon: '🌯',
    rarity: 'epic',
    desc: 'З подвійним м\'ясом і без каяття',
    effect: 'Один нездоровий прийом їжі без штрафів та сорому',
    type: 'allow_fastfood',
    value: 1,
  },

  // ── LEGENDARY ────────────────────────────────────────────
  {
    id: 'cossack_kettlebell',
    name: 'Золота Гиря Козака',
    icon: '🏅',
    rarity: 'legendary',
    desc: 'Передається від покоління до покоління. Важить 32кг.',
    effect: '+500 XP миттєво. Предки пишаються.',
    type: 'xp_bonus',
    value: 500,
  },
  {
    id: 'anti_burger_sword',
    name: 'Меч Анти-Бургер',
    icon: '⚔️',
    rarity: 'legendary',
    desc: 'Рубає калорії без пощади. +10 до харизми.',
    effect: '2x XP та імунітет до штрафів на наступні 3 дні',
    type: 'legendary_buff',
    value: 3,
  },
  {
    id: 'pandora_box',
    name: 'Скриня Пандори',
    icon: '📦',
    rarity: 'legendary',
    desc: 'Відкрий якщо наважишся. Або не відкривай. Вибір твій.',
    effect: 'Рандом: або +800 XP або 50 присідань прямо зараз',
    type: 'gamble',
    value: 0,
  },
];

export const RARITY_CONFIG = {
  common:    { label: 'Звичайний',   color: 'text-slate-400',   border: 'border-slate-600',    bg: 'bg-slate-800/30',    glow: '' },
  uncommon:  { label: 'Незвичайний', color: 'text-green-400',   border: 'border-green-600/60', bg: 'bg-green-900/20',   glow: '' },
  rare:      { label: 'Рідкісний',   color: 'text-blue-400',    border: 'border-blue-500/60',  bg: 'bg-blue-900/20',    glow: '' },
  epic:      { label: 'Епічний',     color: 'text-purple-400',  border: 'border-purple-500/70', bg: 'bg-purple-900/20', glow: 'shadow-purple-500/20 shadow-md' },
  legendary: { label: 'Легендарний', color: 'text-yellow-400',  border: 'border-yellow-400/80', bg: 'bg-yellow-900/20', glow: 'shadow-yellow-400/40 shadow-lg' },
};

const RARITY_WEIGHTS = { common: 45, uncommon: 30, rare: 17, epic: 6, legendary: 2 };
const DROP_CHANCE = 0.25; // 25% per log

export function rollArtifact() {
  if (Math.random() > DROP_CHANCE) return null;

  const entries = Object.entries(RARITY_WEIGHTS);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let roll = Math.random() * total;
  let rarity = 'common';
  for (const [r, w] of entries) {
    roll -= w;
    if (roll <= 0) { rarity = r; break; }
  }

  const pool = ARTIFACTS.filter(a => a.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getArtifact(id) {
  return ARTIFACTS.find(a => a.id === id);
}
