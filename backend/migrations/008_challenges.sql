ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS challenges JSONB DEFAULT '[]';
