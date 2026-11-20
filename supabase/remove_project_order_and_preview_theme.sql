-- Removes the unused manual ordering and fallback illustration fields.
-- Run in Supabase SQL Editor after reviewing: existing values in these columns are dropped.
ALTER TABLE IF EXISTS public.projects
  DROP COLUMN IF EXISTS number,
  DROP COLUMN IF EXISTS preview_type;

ALTER TABLE IF EXISTS public.upcoming_projects
  DROP COLUMN IF EXISTS number,
  DROP COLUMN IF EXISTS preview_type;
