const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const ENTITY_TABLES = {
  PlayerProfile: 'player_profiles',
  DailyLog: 'daily_logs',
};

// pg returns NUMERIC columns as strings — parse them to JS numbers before sending
const FLOAT_FIELDS = {
  PlayerProfile: ['start_weight', 'current_weight', 'lowest_weight', 'total_money_saved'],
  DailyLog: ['weight', 'money_saved'],
};

function parseRow(entity, row) {
  const fields = FLOAT_FIELDS[entity] || [];
  const out = { ...row };
  fields.forEach(f => {
    if (out[f] != null) out[f] = parseFloat(out[f]);
  });
  return out;
}

const ENTITY_COLUMNS = {
  PlayerProfile: [
    'id', 'total_xp', 'current_level', 'current_streak', 'best_streak',
    'start_weight', 'current_weight', 'lowest_weight', 'total_money_saved',
    'total_steps', 'unlocked_milestones', 'unlocked_achievements',
    'frozen_privileges', 'penalty_zone', 'created_at',
  ],
  DailyLog: [
    'id', 'date', 'weight', 'steps', 'xp_earned', 'money_saved',
    'events', 'streak_day', 'penalty_zone', 'created_at',
  ],
};

const SORTABLE_COLS = new Set(['date', 'created_at', 'weight', 'steps', 'total_xp']);

// GET /api/entities/:entity
router.get('/:entity', async (req, res) => {
  const table = ENTITY_TABLES[req.params.entity];
  if (!table) return res.status(404).json({ message: 'Unknown entity' });

  const cols = ENTITY_COLUMNS[req.params.entity].join(', ');
  const { sort, limit } = req.query;

  let orderBy = 'created_at DESC';
  if (sort) {
    const desc = sort.startsWith('-');
    const col = desc ? sort.slice(1) : sort;
    if (SORTABLE_COLS.has(col)) orderBy = `${col} ${desc ? 'DESC' : 'ASC'}`;
  }

  const limitVal = Math.min(parseInt(limit) || 100, 500);

  try {
    const result = await db.query(
      `SELECT ${cols} FROM ${table} WHERE user_id = $1 ORDER BY ${orderBy} LIMIT $2`,
      [req.userId, limitVal]
    );
    res.json(result.rows.map(r => parseRow(req.params.entity, r)));
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ message: 'Failed to list entities' });
  }
});

// POST /api/entities/:entity
router.post('/:entity', async (req, res) => {
  const table = ENTITY_TABLES[req.params.entity];
  if (!table) return res.status(404).json({ message: 'Unknown entity' });

  const cols = ENTITY_COLUMNS[req.params.entity];
  const writableCols = cols.filter(c => c !== 'id' && c !== 'created_at');
  const fields = Object.keys(req.body).filter(k => writableCols.includes(k));
  if (!fields.length) return res.status(400).json({ message: 'No valid fields provided' });

  const values = fields.map(f => {
    const v = req.body[f];
    return Array.isArray(v) || (v !== null && typeof v === 'object') ? JSON.stringify(v) : v;
  });

  const placeholders = fields.map((_, i) => `$${i + 2}`).join(', ');

  try {
    const result = await db.query(
      `INSERT INTO ${table} (user_id, ${fields.join(', ')}) VALUES ($1, ${placeholders}) RETURNING ${cols.join(', ')}`,
      [req.userId, ...values]
    );
    res.status(201).json(parseRow(req.params.entity, result.rows[0]));
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ message: 'Failed to create entity' });
  }
});

// PUT /api/entities/:entity/:id
router.put('/:entity/:id', async (req, res) => {
  const table = ENTITY_TABLES[req.params.entity];
  if (!table) return res.status(404).json({ message: 'Unknown entity' });

  const cols = ENTITY_COLUMNS[req.params.entity];
  const writableCols = cols.filter(c => c !== 'id' && c !== 'created_at');
  const fields = Object.keys(req.body).filter(k => writableCols.includes(k));
  if (!fields.length) return res.status(400).json({ message: 'No valid fields to update' });

  const values = fields.map(f => {
    const v = req.body[f];
    return Array.isArray(v) || (v !== null && typeof v === 'object') ? JSON.stringify(v) : v;
  });

  const setClauses = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');

  try {
    const result = await db.query(
      `UPDATE ${table} SET ${setClauses} WHERE id = $1 AND user_id = $2 RETURNING ${cols.join(', ')}`,
      [req.params.id, req.userId, ...values]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Entity not found' });
    res.json(parseRow(req.params.entity, result.rows[0]));
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update entity' });
  }
});

module.exports = router;
