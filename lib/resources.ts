export type ResourceType = "pdf" | "code" | "zip" | "template" | "guide";

export type ResourceCategory =
  | "PDF Guides & Ebooks"
  | "Source Code & Starters"
  | "Templates & Boilerplates"
  | "Cheatsheets & Roadmaps"
  | "AI Prompts & Architecture";

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  type: ResourceType;
  fileUrl: string;
  fileSize?: string;
  coverImage?: string;
  tags: string[];
  downloadsCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  externalLink?: string;
}

export const RESOURCE_CATEGORIES: string[] = [
  "PDF Guides & Ebooks",
  "Source Code & Starters",
  "Templates & Boilerplates",
  "Cheatsheets & Roadmaps",
  "AI Prompts & Architecture",
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: "res-nextjs16-starter",
    slug: "nextjs16-production-saas-starter",
    title: "Next.js 16 & Turbopack Production SaaS Starter",
    description:
      "Production-ready Next.js 16 boilerplate with TypeScript, Supabase Auth, Tailwind CSS, dark glassmorphic styling, and resilient API route architecture.",
    category: "Source Code & Starters",
    type: "code",
    fileUrl: "/uploads/nextjs16-saas-starter.zip",
    fileSize: "2.4 MB (ZIP)",
    coverImage: "/uploads/01-mv66ky4x.png",
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase"],
    downloadsCount: 348,
    featured: true,
    createdAt: "2026-10-10T08:00:00.000Z",
    externalLink: "https://github.com/codingskillup",
  },
  {
    id: "res-ai-agent-architecture",
    slug: "autonomous-ai-agents-system-design-guide",
    title: "Autonomous AI Agents & Tool-Calling Architecture Playbook",
    description:
      "A comprehensive 28-page PDF engineering handbook on building resilient AI agents with LangChain, OpenAI/Gemini function calling, Vector search, and human-in-the-loop safeguards.",
    category: "PDF Guides & Ebooks",
    type: "pdf",
    fileUrl: "/uploads/ai-agents-system-design-guide.pdf",
    fileSize: "5.8 MB (PDF)",
    coverImage: "/uploads/03-mv679el9.png",
    tags: ["AI Agents", "System Design", "Python", "LLMs"],
    downloadsCount: 512,
    featured: true,
    createdAt: "2026-10-08T10:30:00.000Z",
  },
  {
    id: "res-supabase-rls-cheatsheet",
    slug: "postgresql-supabase-security-rls-master-cheatsheet",
    title: "PostgreSQL & Supabase Security & RLS Master Cheatsheet",
    description:
      "Essential SQL cheat sheet for Row Level Security policies, table grants, composite indexes, real-time channels, and service role security for full-stack Next.js apps.",
    category: "Cheatsheets & Roadmaps",
    type: "pdf",
    fileUrl: "/uploads/supabase-rls-security-cheatsheet.pdf",
    fileSize: "1.2 MB (PDF)",
    coverImage: "/uploads/04-mv678cuj.png",
    tags: ["PostgreSQL", "Supabase", "SQL", "Security"],
    downloadsCount: 289,
    featured: false,
    createdAt: "2026-10-05T14:15:00.000Z",
  },
  {
    id: "res-fastapi-microservice",
    slug: "fastapi-langchain-microservice-boilerplate",
    title: "FastAPI & LangChain Microservice Boilerplate",
    description:
      "Lightweight Python FastAPI service with streaming LLM token responses, async background workers, health check endpoints, and Docker container setup.",
    category: "Source Code & Starters",
    type: "code",
    fileUrl: "/uploads/fastapi-langchain-microservice.zip",
    fileSize: "850 KB (ZIP)",
    coverImage: "/uploads/1-mv5i8zzw.png",
    tags: ["FastAPI", "Python", "Docker", "LangChain"],
    downloadsCount: 215,
    featured: true,
    createdAt: "2026-10-02T11:00:00.000Z",
    externalLink: "https://github.com/codingskillup",
  },
  {
    id: "res-web-performance-playbook",
    slug: "modern-web-performance-core-web-vitals-guide",
    title: "Modern Web Performance & Core Web Vitals Optimization Playbook",
    description:
      "Actionable PDF guide covering font subsetting, Turbopack bundle analysis, responsive image optimization, dynamic imports, and sub-second TTFB targets.",
    category: "PDF Guides & Ebooks",
    type: "pdf",
    fileUrl: "/uploads/web-performance-playbook.pdf",
    fileSize: "3.1 MB (PDF)",
    coverImage: "/uploads/2-mv5i95fc.png",
    tags: ["Web Vitals", "Performance", "SEO", "Next.js"],
    downloadsCount: 420,
    featured: false,
    createdAt: "2026-09-28T09:45:00.000Z",
  },
  {
    id: "res-interactive-dark-ui-kit",
    slug: "interactive-dark-ui-kit-micro-interactions",
    title: "Interactive Dark UI Component Kit & Micro-Interactions",
    description:
      "Handcrafted glassmorphic cards, fluid hover glow effects, magnetic custom cursor followers, and responsive navigation modules in vanilla CSS and React.",
    category: "Templates & Boilerplates",
    type: "code",
    fileUrl: "/uploads/interactive-dark-ui-kit.zip",
    fileSize: "1.6 MB (ZIP)",
    coverImage: "/uploads/01-mv66ky4x.png",
    tags: ["React", "UI/UX", "CSS Animations", "Frontend"],
    downloadsCount: 630,
    featured: true,
    createdAt: "2026-09-20T16:00:00.000Z",
  },
];
