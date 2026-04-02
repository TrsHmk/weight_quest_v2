const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [invResult, questResult, logResult] = await Promise.all([
      db.query(
        `SELECT artifact_id, COUNT(*) as total,
                SUM(CASE WHEN used THEN 1 ELSE 0 END) as used_count
         FROM inventory WHERE user_id = $1 GROUP BY artifact_id`,
        [req.userId]
      ),
      db.query(
        `SELECT quests FROM daily_quests WHERE user_id = $1`,
        [req.userId]
      ),
      db.query(
        `SELECT COUNT(*) as total_days FROM daily_logs WHERE user_id = $1`,
        [req.userId]
      ),
    ]);

    let totalQuests = 0, completedQuests = 0;
    const byDifficulty = { easy: 0, medium: 0, hard: 0, epic: 0, legendary: 0 };
    questResult.rows.forEach(row => {
      (row.quests || []).forEach(q => {
        totalQuests++;
        if (q.completed) {
          completedQuests++;
          if (byDifficulty[q.difficulty] !== undefined) byDifficulty[q.difficulty]++;
        }
      });
    });

    res.json({
      inventory: invResult.rows,
      quests: { total: totalQuests, completed: completedQuests, byDifficulty },
      totalDays: parseInt(logResult.rows[0]?.total_days || 0),
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to load stats' });
  }
});

module.exports = router;
