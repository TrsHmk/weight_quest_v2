const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const entityRoutes = require('./routes/entities');
const adminRoutes = require('./routes/admin');
const inventoryRoutes = require('./routes/inventory');
const questRoutes = require('./routes/quests');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/quests', questRoutes);

app.listen(PORT, () => {
  console.log(`[backend] running on port ${PORT}`);
});
