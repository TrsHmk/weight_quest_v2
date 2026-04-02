const express = require('express');
const db = require('../db');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
router.use(adminAuth);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [usersRes, logsRes, activeRes, weightRes] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM users WHERE is_admin = FALSE'),
      db.query('SELECT COUNT(*) AS total FROM daily_logs'),
      db.query(`SELECT COUNT(DISTINCT user_id) AS total FROM daily_logs WHERE date = CURRENT_DATE`),
      db.query(`
        SELECT
          AVG(u.start_weight - u.current_weight) FILTER (WHERE u.start_weight > u.current_weight) AS avg_lost,
          SUM(u.start_weight - u.current_weight) FILTER (WHERE u.start_weight > u.current_weight) AS total_lost
        FROM player_profiles u
      `),
    ]);

    res.json({
      totalUsers: parseInt(usersRes.rows[0].total),
      totalLogs: parseInt(logsRes.rows[0].total),
      activeToday: parseInt(activeRes.rows[0].total),
      avgWeightLost: parseFloat(weightRes.rows[0].avg_lost || 0).toFixed(1),
      totalWeightLost: parseFloat(weightRes.rows[0].total_lost || 0).toFixed(1),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Failed to get stats' });
  }
});

// GET /api/admin/users?page=1&limit=20
router.get('/users', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;

  try {
    const [usersRes, countRes] = await Promise.all([
      db.query(`
        SELECT
          u.id, u.email, u.username, u.created_at, u.is_admin,
          p.total_xp, p.current_level, p.current_weight,
          p.start_weight, p.current_streak, p.best_streak,
          p.total_steps, p.penalty_zone,
          (SELECT COUNT(*) FROM daily_logs dl WHERE dl.user_id = u.id) AS log_count
        FROM users u
        LEFT JOIN player_profiles p ON p.user_id = u.id
        ORDER BY u.is_admin DESC, u.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]),
      db.query('SELECT COUNT(*) FROM users'),
    ]);

    res.json({
      users: usersRes.rows,
      total: parseInt(countRes.rows[0].count),
      page,
      pages: Math.ceil(parseInt(countRes.rows[0].count) / limit),
    });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Failed to get users' });
  }
});

// GET /api/admin/users/:userId
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [userRes, profileRes, logsRes, invRes] = await Promise.all([
      db.query('SELECT id, email, username, created_at FROM users WHERE id = $1', [userId]),
      db.query('SELECT * FROM player_profiles WHERE user_id = $1', [userId]),
      db.query('SELECT *, date::text AS date FROM daily_logs WHERE user_id = $1 ORDER BY daily_logs.date DESC LIMIT 60', [userId]),
      db.query('SELECT * FROM inventory WHERE user_id = $1 ORDER BY acquired_at DESC', [userId]),
    ]);
    if (!userRes.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json({
      user: userRes.rows[0],
      profile: profileRes.rows[0] || null,
      logs: logsRes.rows,
      inventory: invRes.rows,
    });
  } catch (err) {
    console.error('Admin user detail error:', err);
    res.status(500).json({ message: 'Failed to get user detail' });
  }
});

// DELETE /api/admin/users/:userId/logs/:logId
router.delete('/users/:userId/logs/:logId', async (req, res) => {
  try {
    await db.query('DELETE FROM daily_logs WHERE id = $1 AND user_id = $2', [req.params.logId, req.params.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete log' });
  }
});

// DELETE /api/admin/users/:userId/logs
router.delete('/users/:userId/logs', async (req, res) => {
  try {
    await db.query('DELETE FROM daily_logs WHERE user_id = $1', [req.params.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear logs' });
  }
});

// DELETE /api/admin/users/:userId/inventory/:itemId
router.delete('/users/:userId/inventory/:itemId', async (req, res) => {
  try {
    await db.query('DELETE FROM inventory WHERE id = $1 AND user_id = $2', [req.params.itemId, req.params.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete inventory item' });
  }
});

// DELETE /api/admin/users/:userId/inventory
router.delete('/users/:userId/inventory', async (req, res) => {
  try {
    await db.query('DELETE FROM inventory WHERE user_id = $1', [req.params.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear inventory' });
  }
});

// POST /api/admin/users/:userId/inventory  { artifact_id }
router.post('/users/:userId/inventory', async (req, res) => {
  const { artifact_id } = req.body;
  if (!artifact_id) return res.status(400).json({ message: 'artifact_id required' });
  try {
    const result = await db.query(
      'INSERT INTO inventory (user_id, artifact_id) VALUES ($1, $2) RETURNING *',
      [req.params.userId, artifact_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add artifact' });
  }
});

// POST /api/admin/users/:userId/reset-steps — zero out steps in profile + all logs
router.post('/users/:userId/reset-steps', async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query(`UPDATE player_profiles SET total_steps = 0 WHERE user_id = $1`, [userId]);
    await db.query(`UPDATE daily_logs SET steps = 0 WHERE user_id = $1`, [userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset steps' });
  }
});

// POST /api/admin/users/:userId/reset-weight — reset current_weight to start_weight
router.post('/users/:userId/reset-weight', async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query(`
      UPDATE player_profiles
      SET current_weight = start_weight, lowest_weight = start_weight
      WHERE user_id = $1
    `, [userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset weight' });
  }
});

// POST /api/admin/users/:userId/reset — clear logs, inventory, quests; reset profile
router.post('/users/:userId/reset', async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query('DELETE FROM daily_logs WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM inventory WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM daily_quests WHERE user_id = $1', [userId]);
    await db.query(`
      UPDATE player_profiles SET
        total_xp = 0, current_level = 1, current_streak = 0, best_streak = 0,
        current_weight = start_weight, lowest_weight = start_weight,
        total_money_saved = 0, total_steps = 0,
        unlocked_milestones = '[]', unlocked_achievements = '[]',
        frozen_privileges = '[]', penalty_zone = 'none'
      WHERE user_id = $1
    `, [userId]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Failed to reset user' });
  }
});

module.exports = router;
