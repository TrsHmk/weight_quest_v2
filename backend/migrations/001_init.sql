CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id        SERIAL PRIMARY KEY,
  email     VARCHAR(255) UNIQUE NOT NULL,
  username  VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_profiles (
  id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id              INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_xp             INTEGER DEFAULT 0,
  current_level        INTEGER DEFAULT 1,
  current_streak       INTEGER DEFAULT 0,
  best_streak          INTEGER DEFAULT 0,
  start_weight         NUMERIC(5,1) DEFAULT 96,
  current_weight       NUMERIC(5,1) DEFAULT 96,
  lowest_weight        NUMERIC(5,1) DEFAULT 96,
  total_money_saved    NUMERIC(8,2) DEFAULT 0,
  total_steps          INTEGER DEFAULT 0,
  unlocked_milestones  JSONB DEFAULT '[]',
  unlocked_achievements JSONB DEFAULT '[]',
  frozen_privileges    JSONB DEFAULT '[]',
  penalty_zone         VARCHAR(10) DEFAULT 'none',
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_logs (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  weight      NUMERIC(5,1),
  steps       INTEGER DEFAULT 0,
  xp_earned   INTEGER DEFAULT 0,
  money_saved NUMERIC(8,2) DEFAULT 0,
  events      JSONB DEFAULT '[]',
  streak_day  INTEGER DEFAULT 0,
  penalty_zone VARCHAR(10) DEFAULT 'none',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_player_profiles_user ON player_profiles(user_id);
