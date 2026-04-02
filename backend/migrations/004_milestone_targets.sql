-- Convert unlocked_milestones from array-index values to target-weight values
-- Old: [0,1,2,3,4,5] meant indices into [94,92,90,87,84,80]
-- New: store actual target weights [94,92,90,87,84,80]
UPDATE player_profiles SET
  unlocked_milestones = (
    SELECT COALESCE(jsonb_agg(
      CASE val::int
        WHEN 0 THEN '94'::jsonb
        WHEN 1 THEN '92'::jsonb
        WHEN 2 THEN '90'::jsonb
        WHEN 3 THEN '87'::jsonb
        WHEN 4 THEN '84'::jsonb
        WHEN 5 THEN '80'::jsonb
        ELSE val::jsonb
      END
    ), '[]'::jsonb)
    FROM jsonb_array_elements_text(unlocked_milestones) val
  )
  WHERE unlocked_milestones IS NOT NULL
    AND jsonb_array_length(unlocked_milestones) > 0;

-- Convert frozen_privileges milestone_index same way
UPDATE player_profiles SET
  frozen_privileges = (
    SELECT COALESCE(jsonb_agg(
      jsonb_set(fp, '{milestone_index}',
        CASE (fp->>'milestone_index')::int
          WHEN 0 THEN '94'::jsonb
          WHEN 1 THEN '92'::jsonb
          WHEN 2 THEN '90'::jsonb
          WHEN 3 THEN '87'::jsonb
          WHEN 4 THEN '84'::jsonb
          WHEN 5 THEN '80'::jsonb
          ELSE fp->'milestone_index'
        END
      )
    ), '[]'::jsonb)
    FROM jsonb_array_elements(frozen_privileges) fp
  )
  WHERE frozen_privileges IS NOT NULL
    AND jsonb_array_length(frozen_privileges) > 0;
