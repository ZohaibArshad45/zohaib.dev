-- ==============================================================================
-- ZOHAIB.DEV - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create Inquiries Table
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

-- 2. Create Projects Table
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

-- 3. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Site Settings Table (Admin Security & Global Settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create Services Table
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

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public / anon client read & write operations
DROP POLICY IF EXISTS "Allow anon on inquiries" ON public.inquiries;
CREATE POLICY "Allow anon on inquiries" ON public.inquiries
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on projects" ON public.projects;
CREATE POLICY "Allow anon on projects" ON public.projects
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on categories" ON public.categories;
CREATE POLICY "Allow anon on categories" ON public.categories
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on site_settings" ON public.site_settings;
CREATE POLICY "Allow anon on site_settings" ON public.site_settings
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on services" ON public.services;
CREATE POLICY "Allow anon on services" ON public.services
  FOR ALL TO public USING (true) WITH CHECK (true);

-- Insert Initial Categories
INSERT INTO public.categories (name) VALUES
  ('Web Apps'),
  ('AI Systems'),
  ('Automation & Workflows'),
  ('Internal Tools')
ON CONFLICT (name) DO NOTHING;

-- Store Admin Password in Supabase Settings
INSERT INTO public.site_settings (key, value) VALUES
  ('admin_password', '786109Sz9@')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Seed Initial Projects
INSERT INTO public.projects (
  slug, number, title, short_title, status, categories, headline, subhead,
  description, outcome, tags, preview_type, client, role, timeline, deliverables,
  problem, solution, architecture_highlights, metrics, demo_url
) VALUES
(
  'inbox',
  '01',
  'AI Unified Inbox & Lead Triage Assistant',
  'AI Inbox Assistant',
  'AI INTEGRATION • PRODUCTIVITY',
  ARRAY['AI Systems', 'Web Apps'],
  'An inbox that knows what matters.',
  'Smart lead triage, automated classification, and conversational summary engine.',
  'A focused workspace that brings multiple email accounts together and uses AI to surface keywords, urgent client messages, lead scores, and team mentions in real time.',
  'Automated 85% of inbound message classification and reduced lead response latency from hours to under 4 minutes.',
  ARRAY['Next.js', 'OpenAI GPT-4o', 'Supabase', 'Tailwind CSS', 'TypeScript'],
  'inbox',
  'Productivity Tool & SaaS Concept',
  'Full-Stack Engineer & AI Architecture',
  '3 Weeks',
  ARRAY[
    'Unified IMAP & Gmail message ingestion pipeline',
    'GPT-4o intent and urgency classifier',
    'Real-time WebSocket inbox stream',
    'One-click action dispatcher and quick-reply generator'
  ],
  'Teams were losing high-intent leads and critical client updates in cluttered email inboxes. Urgent inquiries went unanswered for hours because key conversations were buried alongside promotional newsletters and notifications.',
  'Engineered an intelligent inbox middleware that continuously ingests inbound messages, analyzes context using OpenAI models, tags sentiment and priority, and surfaces an organized high-signal feed.',
  ARRAY[
    'Edge-based webhook listener processing inbound webhooks in <150ms',
    'Vector embeddings & semantic clustering for similar thread grouping',
    'Supabase PostgreSQL Row-Level Security for multi-tenant data isolation',
    'Optimistic UI updates for instant zero-latency inbox management'
  ],
  '[{"label":"Triage Speedup","value":"85%"},{"label":"Avg. Response Time","value":"< 4 mins"},{"label":"Intent Accuracy","value":"96.4%"}]'::JSONB,
  '/projects/inbox'
),
(
  'automation',
  '02',
  'Deal-to-Task Pipeline Automation',
  'CRM & Project Pipeline',
  'AUTOMATION SYSTEM',
  ARRAY['Automation & Workflows'],
  'From a new deal to the next task.',
  'Zero-latency synchronization from HubSpot CRM deals to Asana project pipelines.',
  'A multi-stage workflow connecting HubSpot deal milestones with Asana project templates through n8n webhooks, ensuring project details transition automatically as sales close.',
  'Saved 15+ hours weekly in repetitive project setup and completely eliminated client onboarding handoff delays.',
  ARRAY['n8n', 'HubSpot API', 'Asana API', 'Webhooks', 'Node.js'],
  'automation',
  'B2B Agency Operations',
  'Automation Architect & Integration Developer',
  '2 Weeks',
  ARRAY[
    'Event-driven webhook listener for HubSpot deal stages',
    'Data normalization engine mapping client contracts to task lists',
    'Automated Asana board instantiation with task dependencies',
    'Slack operational notifier alerting delivery engineers'
  ],
  'Account executives frequently forgot to populate technical project specifications into project management tools after closing deals, leading to chaotic handoffs, lost details, and multi-day kickoff delays.',
  'Built a fault-tolerant event-driven workflow in n8n that captures deal-won events, validates required technical fields, generates client Asana boards from blueprints, and notifies team leads instantly.',
  ARRAY[
    'Automated retry mechanisms with exponential backoff on API rate limits',
    'Payload validation schema preventing malformed deals from breaking boards',
    'Bidirectional sync updating CRM deal records with Asana project URLs',
    'Encrypted credential storage inside secure self-hosted n8n instance'
  ],
  '[{"label":"Hours Saved / Wk","value":"15+ hrs"},{"label":"Handoff Latency","value":"Instant"},{"label":"Sync Reliability","value":"99.9%"}]'::JSONB,
  '/projects/automation'
),
(
  'dashboard',
  '03',
  'Modular Operations & Team Workspace',
  'Operations Workspace',
  'WEB APPLICATION • INTERNAL TOOL',
  ARRAY['Web Apps', 'Internal Tools'],
  'A clearer way to manage the work.',
  'Centralized client deliverables, team capacity, and project progress in one real-time dashboard.',
  'A responsive project dashboard designed to bring tasks, progress, priorities and team activity into one simple, clean workspace with granular role-based access.',
  'Centralized multi-client operations into a unified high-density workspace with instant status updates.',
  ARRAY['Next.js', 'React 19', 'Supabase', 'Server Actions', 'PostgreSQL'],
  'dashboard',
  'Digital Production Studio',
  'Frontend Architect & Backend Developer',
  '4 Weeks',
  ARRAY[
    'Interactive Kanban board and high-density task list views',
    'Live Supabase Realtime synchronization across all team members',
    'Granular role-based permissions (Admins, Team Leads, Clients)',
    'Automated milestone tracking and sprint capacity indicators'
  ],
  'Teams were scattered across messy spreadsheets and generic task boards that offered no consolidated view of cross-project workload or actual delivery deadlines.',
  'Designed and developed a bespoke web application with minimal interface clutter, instant real-time synchronization, and actionable milestone health summaries.',
  ARRAY[
    'Server Components for fast initial loads with React 19 client transitions',
    'PostgreSQL real-time subscriptions with debounced client state updates',
    'Custom responsive CSS layout engineered for 4K desktop to mobile screens',
    'Sub-200ms API response time with edge-cached summary statistics'
  ],
  '[{"label":"Active Team Members","value":"45+"},{"label":"State Sync Latency","value":"< 200ms"},{"label":"Status Meetings Cut","value":"50%"}]'::JSONB,
  '/projects/dashboard'
),
(
  'outreach-ops',
  '04',
  'Autonomous Prospect Discovery & Lead Agent',
  'Outreach Ops Agent',
  'AI AGENT • AUTOMATION',
  ARRAY['AI Systems', 'Automation & Workflows'],
  'Prospect research that never sleeps.',
  'Autonomous web intelligence agent that discovers high-intent prospects and personalizes outreach.',
  'An automated lead generation and enrichment pipeline that crawls target company registries, extracts decision-maker signals, and crafts contextualized intro angles.',
  'Achieved a 3.8x increase in qualified reply rates through hyper-personalized contextual research angles.',
  ARRAY['Python', 'LangChain', 'OpenAI', 'FastAPI', 'PostgreSQL'],
  'outreach',
  'B2B SaaS Growth Team',
  'AI Systems Engineer',
  '3 Weeks',
  ARRAY[
    'Intelligent website crawler extracting executive bios and product offerings',
    'Entity extraction pipeline categorizing technology stacks and hiring signals',
    'LLM reasoning node formulating personalized value-proposition hooks',
    'Automated verification engine filtering invalid emails and duplicate domains'
  ],
  'Outreach specialists spent up to 70% of their day manually copying contact info and looking for talking points, resulting in low outreach volume and generic messages.',
  'Created an agentic workflow that autonomously scans prospect sites, detects trigger events, and synthesizes authentic conversation openers.',
  ARRAY[
    'Multi-step LangChain agent with structured JSON outputs and self-correction',
    'Headless browser scraping with proxy rotation to avoid rate limits',
    'Confidence scoring threshold preventing low-conviction leads from dispatching',
    'Webhook callbacks directly feeding sales engagement platforms'
  ],
  '[{"label":"Qualified Reply Boost","value":"3.8x"},{"label":"Research Time","value":"10s / lead"},{"label":"Enriched Prospects","value":"12,000+"}]'::JSONB,
  '/projects/outreach-ops'
),
(
  'codingskillup',
  '05',
  'Codingskillup Educational Platform & Code Engine',
  'Codingskillup',
  'WEB APPLICATION • PLATFORM',
  ARRAY['Web Apps'],
  'Learn. Build. Repeat.',
  'Interactive programming guides, developer roadmaps, and full-stack tutorials.',
  'A custom developer learning hub created by Zohaib to teach modern web development, AI engineering, and automation workflows with live interactive code examples.',
  'Reached 10,000+ developers worldwide with practical guides, real-world case studies, and open-source starter repositories.',
  ARRAY['Next.js', 'MDX', 'Tailwind CSS', 'TypeScript', 'Vercel'],
  'code',
  'Community & Education Initiative',
  'Founder, Designer & Full-Stack Developer',
  'Ongoing Platform',
  ARRAY[
    'Custom MDX documentation and code snippet rendering engine',
    'Interactive code playground previews with syntax highlighting',
    'Curated technology roadmaps with progress tracking',
    'SEO-optimized content architecture scoring 99+ on Google Lighthouse'
  ],
  'Most developer tutorials either stay too theoretical or fail to demonstrate how modern AI and automation pieces fit into actual production-ready software systems.',
  'Crafted an ultra-fast, minimalist platform focusing on pragmatic code patterns, architectural breakdowns, and step-by-step engineering walk-throughs.',
  ARRAY[
    'Static Site Generation (SSG) with Incremental Static Regeneration (ISR)',
    'Dark-mode first typography system with high-contrast syntax tokens',
    'Custom RSS feed and automated social card image generation',
    '100% PageSpeed performance score across mobile and desktop'
  ],
  '[{"label":"Community Reach","value":"10,000+"},{"label":"Tutorial Articles","value":"45+"},{"label":"Lighthouse Performance","value":"99/100"}]'::JSONB,
  '/projects/codingskillup'
),
(
  'support-copilot',
  '06',
  'RAG-Powered Customer Support Copilot',
  'Support Copilot',
  'AI SYSTEM • INTERNAL TOOL',
  ARRAY['AI Systems', 'Internal Tools'],
  'Instant answers grounded in company docs.',
  'Vector-search knowledge retrieval system for instant customer inquiry resolution.',
  'A Retrieval-Augmented Generation (RAG) assistant connected to internal product documentation, Notion wikis, and historical support tickets to provide verified answers.',
  'Resolved 65% of Tier-1 support tickets automatically with verified citations and zero hallucination.',
  ARRAY['Pinecone', 'LangChain', 'OpenAI', 'Next.js', 'FastAPI'],
  'support',
  'E-Commerce & SaaS Support Teams',
  'AI & Vector Search Engineer',
  '2.5 Weeks',
  ARRAY[
    'Automated document ingestion and markdown chunking pipeline',
    'Pinecone vector database index with semantic metadata filters',
    'Strict citation guardrails ensuring every claim references verified docs',
    'Support agent sidecar UI for reviewing and modifying drafted responses'
  ],
  'Support reps were overwhelmed with repetitive questions, spending 10+ minutes searching outdated wikis to find the right policy or troubleshooting step.',
  'Engineered a private knowledge copilot with semantic vector search that delivers instantaneous, policy-compliant answers accompanied by clickable source links.',
  ARRAY[
    'Hybrid search combining BM25 keyword matching with dense vector embeddings',
    'Confidence thresholding that automatically escalates low-confidence questions',
    'Audit logging of all AI queries and agent feedback for model evaluation',
    'Sub-800ms end-to-end streaming response time over WebSockets'
  ],
  '[{"label":"Tier-1 Deflection","value":"65%"},{"label":"First Response Latency","value":"< 5s"},{"label":"Citation Accuracy","value":"98.2%"}]'::JSONB,
  '/projects/support-copilot'
)
ON CONFLICT (slug) DO NOTHING;
