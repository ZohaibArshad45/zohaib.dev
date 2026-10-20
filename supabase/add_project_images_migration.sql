-- Run this single line in your Supabase SQL Editor:
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';
