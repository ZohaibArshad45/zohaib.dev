-- ==============================================================================
-- UPCOMING PROJECTS TABLE MIGRATION & RLS POLICIES
-- Run this in Supabase SQL Editor if you are using Supabase
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.upcoming_projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL DEFAULT '01',
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'AI Agents',
  status TEXT NOT NULL DEFAULT 'In Development',
  target_release TEXT NOT NULL DEFAULT 'Q1 2027',
  progress INTEGER NOT NULL DEFAULT 50,
  priority TEXT NOT NULL DEFAULT 'High',
  headline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  key_features TEXT[] NOT NULL DEFAULT '{}',
  architecture_highlights TEXT[] NOT NULL DEFAULT '{}',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  preview_type TEXT NOT NULL DEFAULT 'dashboard',
  waitlist_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.upcoming_projects ENABLE ROW LEVEL SECURITY;

-- Drop any previous policies
DROP POLICY IF EXISTS "Public read upcoming projects" ON public.upcoming_projects;
DROP POLICY IF EXISTS "Full access to upcoming projects" ON public.upcoming_projects;

-- Allow public read access
CREATE POLICY "Public read upcoming projects"
  ON public.upcoming_projects
  FOR SELECT
  USING (true);

-- Allow full access for insert/update/delete (service role or public app key)
CREATE POLICY "Full access to upcoming projects"
  ON public.upcoming_projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_upcoming_projects_slug ON public.upcoming_projects (slug);
CREATE INDEX IF NOT EXISTS idx_upcoming_projects_category ON public.upcoming_projects (category);
