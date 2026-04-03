ALTER TABLE player_profiles ADD COLUMN IF NOT EXISTS active_effects JSONB DEFAULT '[]';
