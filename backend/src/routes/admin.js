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
          u.id, u.email, u.username, u.created_at,
          p.total_xp, p.current_level, p.current_weight,
          p.start_weight, p.current_streak, p.best_streak,
          p.total_steps, p.penalty_zone,
          (SELECT COUNT(*) FROM daily_logs dl WHERE dl.user_id = u.id) AS log_count
        FROM users u
        LEFT JOIN player_profiles p ON p.user_id = u.id
        WHERE u.is_admin = FALSE
        ORDER BY u.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]),
      db.query('SELECT COUNT(*) FROM users WHERE is_admin = FALSE'),
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
    const [userRes, profileRes, logsRes] = await Promise.all([
      db.query('SELECT id, email, username, created_at FROM users WHERE id = $1', [userId]),
      db.query('SELECT * FROM player_profiles WHERE user_id = $1', [userId]),
      db.query(
        'SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY date DESC LIMIT 30',
        [userId]
      ),
    ]);

    if (!userRes.rows.length) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: userRes.rows[0],
      profile: profileRes.rows[0] || null,
      logs: logsRes.rows,
    });
  } catch (err) {
    console.error('Admin user detail error:', err);
    res.status(500).json({ message: 'Failed to get user detail' });
  }
});

module.exports = router;
