const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/inventory
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, artifact_id, acquired_at, used, used_at FROM inventory WHERE user_id = $1 ORDER BY acquired_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Inventory list error:', err);
    res.status(500).json({ message: 'Failed to load inventory' });
  }
});

// POST /api/inventory — add artifact drop
router.post('/', async (req, res) => {
  const { artifact_id } = req.body;
  if (!artifact_id) return res.status(400).json({ message: 'artifact_id required' });

  try {
    const result = await db.query(
      'INSERT INTO inventory (user_id, artifact_id) VALUES ($1, $2) RETURNING id, artifact_id, acquired_at, used, used_at',
      [req.userId, artifact_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Inventory create error:', err);
    res.status(500).json({ message: 'Failed to save artifact' });
  }
});

// POST /api/inventory/:id/use — mark artifact as used
router.post('/:id/use', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE inventory SET used = TRUE, used_at = NOW()
       WHERE id = $1 AND user_id = $2 AND used = FALSE
       RETURNING id, artifact_id, acquired_at, used, used_at`,
      [req.params.id, req.userId]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Artifact not found or already used' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Inventory use error:', err);
    res.status(500).json({ message: 'Failed to use artifact' });
  }
});

module.exports = router;
