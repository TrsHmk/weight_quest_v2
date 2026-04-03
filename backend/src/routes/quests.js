const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Quest pool — same structure as frontend QUEST_TEMPLATES
const QUEST_POOL = [
  // easy → chest_wood
  { id: 'log_today',       icon: '📝', name: 'Перший крок',      desc: 'Запиши свою вагу сьогодні',              type: 'log',              chest: 'chest_wood',      difficulty: 'easy' },
  { id: 'steps_3k',        icon: '🚶', name: 'Вечірня прогулянка', desc: 'Зроби 3 000 кроків',                   type: 'steps',    target: 3000,  chest: 'chest_wood',  difficulty: 'easy' },
  { id: 'not_red_zone',    icon: '🟢', name: 'Тримайся зеленого', desc: 'Не потрапи в червону зону сьогодні',    type: 'not_red',          chest: 'chest_wood',      difficulty: 'easy' },
  // medium → chest_iron
  { id: 'steps_7k',        icon: '🏃', name: 'Пів-марафонець',   desc: 'Зроби 7 000 кроків',                    type: 'steps',    target: 7000,  chest: 'chest_iron',  difficulty: 'medium' },
  { id: 'weight_loss_any', icon: '📉', name: 'Хоч трохи менше', desc: 'Стань легше ніж вчора',                  type: 'weight_loss',      chest: 'chest_iron',      difficulty: 'medium' },
  { id: 'streak_3',        icon: '🔥', name: '3 дні підряд',     desc: 'Підтримай стрік хоча б 3 дні',          type: 'streak',   target: 3,     chest: 'chest_iron',  difficulty: 'medium' },
  // hard → chest_gold
  { id: 'steps_10k',       icon: '⚡', name: '10 000 кроків',    desc: 'Зроби 10 000 кроків',                   type: 'steps',    target: 10000, chest: 'chest_gold',  difficulty: 'hard' },
  { id: 'streak_7',        icon: '🗓️', name: 'Тижень без зриву', desc: 'Підтримай стрік 7 днів',               type: 'streak',   target: 7,     chest: 'chest_gold',  difficulty: 'hard' },
  { id: 'steps_12k',       icon: '🦶', name: 'Козацький крок',   desc: 'Зроби 12 000 кроків',                   type: 'steps',    target: 12000, chest: 'chest_gold',  difficulty: 'hard' },
  // epic → chest_epic
  { id: 'steps_15k',       icon: '🦅', name: 'Марафонець',       desc: 'Зроби 15 000 кроків',                   type: 'steps',    target: 15000, chest: 'chest_epic',  difficulty: 'epic' },
  { id: 'streak_14',       icon: '💀', name: '2 тижні сили',     desc: 'Підтримай стрік 14 днів',               type: 'streak',   target: 14,    chest: 'chest_epic',  difficulty: 'epic' },
  // legendary → chest_legendary
  { id: 'steps_20k',       icon: '🏆', name: 'Козацький марш',   desc: 'Зроби 20 000 кроків',                   type: 'steps',    target: 20000, chest: 'chest_legendary', difficulty: 'legendary' },
  { id: 'streak_30',       icon: '👑', name: 'Місяць сили',      desc: 'Підтримай стрік 30 днів',               type: 'streak',   target: 30,    chest: 'chest_legendary', difficulty: 'legendary' },
];

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateQuests(streak = 0) {
  const easy   = pickRandom(QUEST_POOL.filter(q => q.difficulty === 'easy'),   1);
  const medium = pickRandom(QUEST_POOL.filter(q => q.difficulty === 'medium'), 1);

  let hardPool;
  if (streak >= 14) {
    hardPool = QUEST_POOL.filter(q => ['hard','epic','legendary'].includes(q.difficulty));
  } else if (streak >= 7) {
    hardPool = QUEST_POOL.filter(q => ['hard','epic'].includes(q.difficulty));
  } else {
    hardPool = QUEST_POOL.filter(q => q.difficulty === 'hard');
  }
  const hard = pickRandom(hardPool, 1);

  return [...easy, ...medium, ...hard].map(q => ({ ...q, completed: false }));
}

// GET /api/quests — return today's quests (auto-generate if needed)
router.get('/', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    let result = await db.query(
      'SELECT * FROM daily_quests WHERE user_id = $1 AND date::text = $2',
      [req.userId, today]
    );
    if (!result.rows.length) {
      const profileResult = await db.query(
        'SELECT current_streak FROM player_profiles WHERE user_id = $1',
        [req.userId]
      );
      const streak = profileResult.rows[0]?.current_streak || 0;
      const quests = generateQuests(streak);
      result = await db.query(
        'INSERT INTO daily_quests (user_id, date, quests) VALUES ($1, $2, $3) RETURNING *',
        [req.userId, today, JSON.stringify(quests)]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Quests get error:', err);
    res.status(500).json({ message: 'Failed to load quests' });
  }
});

// POST /api/quests/complete — check which quests are done, drop chests, return completed list
router.post('/complete', async (req, res) => {
  const { steps, weight, prevWeight, streak, penaltyZone } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const result = await db.query(
      'SELECT * FROM daily_quests WHERE user_id = $1 AND date::text = $2',
      [req.userId, today]
    );
    if (!result.rows.length) return res.json({ completed: [] });

    const row = result.rows[0];
    const quests = row.quests;
    const newly = [];

    quests.forEach(q => {
      if (q.completed) return;
      let done = false;
      switch (q.type) {
        case 'log':         done = true; break;
        case 'steps':       done = (steps || 0) >= (q.target || 0); break;
        case 'streak':      done = (streak || 0) >= (q.target || 0); break;
        case 'weight_loss': done = prevWeight != null && weight != null && weight < prevWeight; break;
        case 'not_red':     done = penaltyZone !== 'red'; break;
      }
      if (done) { q.completed = true; newly.push(q); }
    });

    if (newly.length) {
      await db.query(
        'UPDATE daily_quests SET quests = $1 WHERE id = $2',
        [JSON.stringify(quests), row.id]
      );
      // Drop chests to inventory
      for (const q of newly) {
        await db.query(
          'INSERT INTO inventory (user_id, artifact_id) VALUES ($1, $2)',
          [req.userId, q.chest]
        );
      }
    }

    res.json({ completed: newly });
  } catch (err) {
    console.error('Quests complete error:', err);
    res.status(500).json({ message: 'Failed to complete quests' });
  }
});

module.exports = router;
