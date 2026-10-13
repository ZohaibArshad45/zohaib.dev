-- ==============================================================================
-- ZOHAIB.DEV - COMPLETE DATABASE SETUP & RLS FIX (RUN IN SUPABASE SQL EDITOR)
-- This script enables 100% Database Mode:
-- 1. Creates all tables (resources, projects, services, site_settings, inquiries, categories)
-- 2. Sets RLS policies so the app has full access
-- 3. Seeds initial data into the database
-- ==============================================================================

-- 1. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'Web App',
  timeline TEXT NOT NULL DEFAULT 'Flexible',
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  priority TEXT NOT NULL DEFAULT 'Medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  estimated_budget TEXT
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  slug TEXT PRIMARY KEY,
  number TEXT NOT NULL DEFAULT '01',
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  status TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  headline TEXT NOT NULL,
  subhead TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  preview_type TEXT NOT NULL DEFAULT 'inbox',
  client TEXT NOT NULL DEFAULT 'Personal Project',
  role TEXT NOT NULL DEFAULT 'Full-Stack Developer',
  timeline TEXT NOT NULL DEFAULT 'Completed',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  problem TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  architecture_highlights TEXT[] NOT NULL DEFAULT '{}',
  metrics JSONB NOT NULL DEFAULT '[]'::JSONB,
  demo_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL DEFAULT '01',
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  best_for TEXT NOT NULL DEFAULT '',
  stack TEXT NOT NULL DEFAULT '',
  timeline TEXT,
  starting_price TEXT,
  cta TEXT NOT NULL DEFAULT 'Get in touch ↗',
  href TEXT NOT NULL DEFAULT '/contact',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Source Code & Starters',
  type TEXT NOT NULL DEFAULT 'code',
  file_url TEXT NOT NULL,
  file_size TEXT,
  cover_image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  downloads_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  external_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - GRANT FULL ACCESS TO APP (ANON & PUBLIC)
-- ==============================================================================
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon on inquiries" ON public.inquiries;
CREATE POLICY "Allow anon on inquiries" ON public.inquiries FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on projects" ON public.projects;
CREATE POLICY "Allow anon on projects" ON public.projects FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on categories" ON public.categories;
CREATE POLICY "Allow anon on categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on site_settings" ON public.site_settings;
CREATE POLICY "Allow anon on site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on services" ON public.services;
CREATE POLICY "Allow anon on services" ON public.services FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on resources" ON public.resources;
CREATE POLICY "Allow anon on resources" ON public.resources FOR ALL TO public USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED (ONLY INSERTS IF TABLES ARE CURRENTLY EMPTY)
-- ==============================================================================
INSERT INTO public.categories (name) VALUES
  ('Web Apps'),
  ('AI Systems'),
  ('Automation & Workflows'),
  ('Internal Tools')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
  ('admin_password', '786109Sz9@')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed Resources if empty
INSERT INTO public.resources (
  id, slug, title, description, category, type, file_url, file_size, cover_image, tags, downloads_count, featured, created_at, external_link
)
SELECT * FROM (VALUES
  (
    'res-nextjs16-starter',
    'nextjs16-production-saas-starter',
    'Next.js 16 & Turbopack Production SaaS Starter',
    'Production-ready Next.js 16 boilerplate with TypeScript, Supabase Auth, Tailwind CSS, dark glassmorphic styling, and resilient API route architecture.',
    'Source Code & Starters',
    'code',
    '/uploads/nextjs16-saas-starter.zip',
    '2.4 MB (ZIP)',
    '/uploads/01-mv66ky4x.png',
    ARRAY['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    348,
    true,
    '2026-10-10T08:00:00.000Z'::TIMESTAMPTZ,
    'https://github.com/codingskillup'
  ),
  (
    'res-ai-agent-architecture',
    'autonomous-ai-agents-system-design-guide',
    'Autonomous AI Agents & Tool-Calling Architecture Playbook',
    'A comprehensive 28-page PDF engineering handbook on building resilient AI agents with LangChain, OpenAI/Gemini function calling, Vector search, and human-in-the-loop safeguards.',
    'PDF Guides & Ebooks',
    'pdf',
    '/uploads/ai-agents-system-design-guide.pdf',
    '5.8 MB (PDF)',
    '/uploads/03-mv679el9.png',
    ARRAY['AI Agents', 'System Design', 'Python', 'LLMs'],
    512,
    true,
    '2026-10-08T10:30:00.000Z'::TIMESTAMPTZ,
    NULL
  ),
  (
    'res-supabase-rls-cheatsheet',
    'postgresql-supabase-security-rls-master-cheatsheet',
    'PostgreSQL & Supabase Security & RLS Master Cheatsheet',
    'Essential SQL cheat sheet for Row Level Security policies, table grants, composite indexes, real-time channels, and service role security for full-stack Next.js apps.',
    'Cheatsheets & Roadmaps',
    'pdf',
    '/uploads/supabase-rls-security-cheatsheet.pdf',
    '1.2 MB (PDF)',
    '/uploads/04-mv678cuj.png',
    ARRAY['PostgreSQL', 'Supabase', 'SQL', 'Security'],
    289,
    false,
    '2026-10-05T14:15:00.000Z'::TIMESTAMPTZ,
    NULL
  ),
  (
    'res-fastapi-microservice',
    'fastapi-langchain-microservice-boilerplate',
    'FastAPI & LangChain Microservice Boilerplate',
    'Lightweight Python FastAPI service with streaming LLM token responses, async background workers, health check endpoints, and Docker container setup.',
    'Source Code & Starters',
    'code',
    '/uploads/fastapi-langchain-microservice.zip',
    '850 KB (ZIP)',
    '/uploads/1-mv5i8zzw.png',
    ARRAY['FastAPI', 'Python', 'Docker', 'LangChain'],
    215,
    true,
    '2026-10-02T11:00:00.000Z'::TIMESTAMPTZ,
    'https://github.com/codingskillup'
  ),
  (
    'res-web-performance-playbook',
    'modern-web-performance-core-web-vitals-guide',
    'Modern Web Performance & Core Web Vitals Optimization Playbook',
    'Actionable PDF guide covering font subsetting, Turbopack bundle analysis, responsive image optimization, dynamic imports, and sub-second TTFB targets.',
    'PDF Guides & Ebooks',
    'pdf',
    '/uploads/web-performance-playbook.pdf',
    '3.1 MB (PDF)',
    '/uploads/2-mv5i95fc.png',
    ARRAY['Web Vitals', 'Performance', 'SEO', 'Next.js'],
    420,
    false,
    '2026-09-28T09:45:00.000Z'::TIMESTAMPTZ,
    NULL
  ),
  (
    'res-interactive-dark-ui-kit',
    'interactive-dark-ui-kit-micro-interactions',
    'Interactive Dark UI Component Kit & Micro-Interactions',
    'Handcrafted glassmorphic cards, fluid hover glow effects, magnetic custom cursor followers, and responsive navigation modules in vanilla CSS and React.',
    'Templates & Boilerplates',
    'code',
    '/uploads/interactive-dark-ui-kit.zip',
    '1.6 MB (ZIP)',
    '/uploads/01-mv66ky4x.png',
    ARRAY['React', 'UI/UX', 'CSS Animations', 'Frontend'],
    630,
    true,
    '2026-09-20T16:00:00.000Z'::TIMESTAMPTZ,
    NULL
  )
) AS v(id, slug, title, description, category, type, file_url, file_size, cover_image, tags, downloads_count, featured, created_at, external_link)
WHERE NOT EXISTS (SELECT 1 FROM public.resources);
