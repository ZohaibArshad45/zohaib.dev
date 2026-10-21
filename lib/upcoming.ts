export type UpcomingStatus =
  | "Planning"
  | "In Development"
  | "Prototype"
  | "Beta Testing"
  | "Ready for Launch";

export interface UpcomingProject {
  id: string;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  status: UpcomingStatus;
  targetRelease: string;
  progress: number;
  priority: "High" | "Critical" | "Medium";
  headline: string;
  description: string;
  problem: string;
  solution: string;
  techStack: string[];
  keyFeatures: string[];
  architectureHighlights: string[];
  deliverables: string[];
  previewType?: "inbox" | "automation" | "dashboard" | "outreach" | "code" | "support";
  waitlistCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const UPCOMING_CATEGORIES: string[] = [
  "All",
  "AI Agents",
  "Voice AI",
  "SaaS & CRM",
  "RAG & Knowledge",
  "Automation",
];

export const INITIAL_UPCOMING_PROJECTS: UpcomingProject[] = [
  {
    id: "up-01",
    slug: "autonomous-sdr-voice-agent",
    number: "01",
    title: "Autonomous Multi-Agent SDR & Realtime Calling Copilot",
    shortTitle: "Autonomous Voice SDR",
    category: "Voice AI",
    status: "In Development",
    targetRelease: "November 2026",
    progress: 80,
    priority: "Critical",
    headline: "Autonomous Multi-Agent SDR & Realtime Calling Copilot",
    description: "A bidirectional conversational voice agent capable of dialing outbound qualified leads, holding human-like sales discovery calls, handling pricing objections, and booking meetings directly into Google Calendar & HubSpot.",
    problem: "Sales development reps waste 65% of their working day leaving voicemails, getting gatekept, and repeating scripted qualification questions. Lead response delays above 5 minutes decrease conversion by 80%.",
    solution: "Engineering an ultra-low latency voice pipeline bridging Twilio PSTN with OpenAI Realtime WebSocket API and Cartesia voice models. The agent responds in < 450ms, understands nuanced interruptions, and logs full transcripts with deal sentiment.",
    techStack: [
      "OpenAI Realtime API",
      "Next.js 16",
      "Twilio Voice",
      "WebSockets",
      "TypeScript",
      "Supabase",
      "n8n"
    ],
    keyFeatures: [
      "Sub-450ms voice latency with conversational turn-taking",
      "Dynamic CRM contact profile lookup during live phone call",
      "Automated Google Calendar meeting scheduling during call",
      "Live call sentiment telemetry and call recording playback",
      "Authentication, dark mode, dashboard & admin portal",
      "Role-based access control with Stripe usage billing"
    ],
    architectureHighlights: [
      "Node.js binary WebSocket gateway streaming 24kHz PCM audio",
      "Server-side function calling for real-time calendar availability check",
      "Twilio Media Streams webhook connector with automatic call recording",
      "PostgreSQL call log repository with full transcript embeddings"
    ],
    deliverables: [
      "Production-ready calling copilot web console with live audio visualizer",
      "Twilio integration module with caller ID configuration",
      "Autonomous objection handling logic tree with guardrails",
      "Automated SMS/Email follow-up dispatch with meeting confirmation"
    ],
    previewType: "support",
    waitlistCount: 142,
    createdAt: "2026-10-15T10:00:00.000Z"
  },
  {
    id: "up-02",
    slug: "enterprise-mcp-hub",
    number: "02",
    title: "Enterprise Model Context Protocol (MCP) Server Hub",
    shortTitle: "Enterprise MCP Hub",
    category: "AI Agents",
    status: "Beta Testing",
    targetRelease: "December 2026",
    progress: 90,
    priority: "High",
    headline: "Enterprise MCP Hub — Universal Tool & Data Gateway for LLMs",
    description: "A secure, standardized Model Context Protocol (MCP) gateway that connects frontier LLMs (Claude Desktop, Cursor, OpenAI Agents) to corporate databases, internal REST APIs, cloud files, and n8n automations.",
    problem: "Integrating enterprise tools with LLMs requires writing fragile custom API wrappers for every model and tool. Security teams worry about leaking database credentials and unvetted AI execution.",
    solution: "Building an enterprise MCP server hub with role-based access control, cryptographic tool auditing, and schema reflection that exposes internal microservices as standardized MCP tools.",
    techStack: [
      "Anthropic MCP SDK",
      "TypeScript",
      "Docker",
      "PostgreSQL",
      "Next.js",
      "OAuth2",
      "Tailwind CSS"
    ],
    keyFeatures: [
      "Standardized MCP server protocol compliant with official specs",
      "Live tool execution monitor with inspectable input/output payloads",
      "Granular role-based tool execution permissions and API rate limits",
      "One-click integration with Claude Desktop, Cursor, and custom agent runtimes",
      "Secure encrypted credential vault and audit logging",
      "Admin dashboard with latency and cost telemetry"
    ],
    architectureHighlights: [
      "JSON-RPC 2.0 transport layer supporting both stdio and SSE connections",
      "PostgreSQL database query sandbox with read-only constraint safety",
      "Next.js management dashboard with interactive tool testing playground",
      "JWT-based bearer authentication with granular scope enforcement"
    ],
    deliverables: [
      "Deployable Docker container with pre-configured database & API tools",
      "Next.js administrative web portal for registering new endpoints",
      "Interactive schema inspector and live RPC test console",
      "Comprehensive developer documentation and TypeScript SDK starter"
    ],
    previewType: "code",
    waitlistCount: 215,
    createdAt: "2026-10-12T08:00:00.000Z"
  },
  {
    id: "up-03",
    slug: "ai-contract-auditor-rag",
    number: "03",
    title: "AI Legal Contract & Risk Auditor with pgvector RAG",
    shortTitle: "AI Contract & Risk Auditor",
    category: "RAG & Knowledge",
    status: "In Development",
    targetRelease: "Q1 2027",
    progress: 65,
    priority: "Critical",
    headline: "AI Contract & Risk Auditor — Automated Due Diligence & Redlines",
    description: "A high-precision document intelligence platform that ingests 100+ page Master Service Agreements, NDAs, and vendor contracts. Identifies legal vulnerabilities, non-standard indemnity clauses, and GDPR/SOC2 compliance gaps in seconds.",
    problem: "Corporate legal review is extremely slow (often 1–3 weeks per contract) and costs thousands of dollars per review. Crucial indemnification caps and auto-renewal traps frequently slip past fatigued human reviewers.",
    solution: "Engineered a specialized RAG engine utilizing OpenAI o1 reasoning and Supabase pgvector. The system breaks contracts into contextual legal clauses, benchmarks them against standard playbook standards, and outputs marked-up redline suggestions with exact page references.",
    techStack: [
      "Next.js 16",
      "OpenAI o1 / GPT-4o",
      "Supabase pgvector",
      "LangChain",
      "Prisma",
      "Stripe",
      "TypeScript"
    ],
    keyFeatures: [
      "Automated clause classification (Indemnity, Liability, Term, Data Privacy)",
      "Redline generation with DOCX track-changes compatible export",
      "Risk heatmap rating contract risk from Low to Critical with justifications",
      "Side-by-side contract comparison and deviation analysis",
      "Role-based access control for legal teams and outside counsel",
      "Stripe recurring subscription and pay-per-contract credit packs"
    ],
    architectureHighlights: [
      "Semantic clause boundary text splitting with hierarchy preservation",
      "Supabase pgvector index optimized for legal taxonomy embeddings",
      "Streaming analysis engine delivering section-by-section audit results",
      "Encrypted document storage with automatic redaction of PII"
    ],
    deliverables: [
      "Split-screen contract editor with interactive risk highlights",
      "One-click PDF/DOCX audit report generator with executive summary",
      "Custom company legal playbook configuration portal",
      "Full API endpoints for automated contract intake from email attachments"
    ],
    previewType: "support",
    waitlistCount: 189,
    createdAt: "2026-10-18T14:30:00.000Z"
  },
  {
    id: "up-04",
    slug: "self-healing-n8n-engine",
    number: "04",
    title: "Self-Healing Business Automation Engine for n8n",
    shortTitle: "Self-Healing n8n Engine",
    category: "Automation",
    status: "Prototype",
    targetRelease: "Q1 2027",
    progress: 50,
    priority: "High",
    headline: "Self-Healing n8n Engine — Zero Silent Workflow Breakages",
    description: "An autonomous supervisor daemon that monitors distributed n8n instances. When third-party APIs change schemas or webhooks fail, the supervisor intercepts the exception, uses GPT-4o diagnostic reasoning to transform payloads, and safely replays failed executions.",
    problem: "Enterprise automations frequently break when external APIs update JSON keys or return unexpected null values. Operations teams only discover broken pipelines days later when customers complain about missing invoices or unrouted leads.",
    solution: "Building an automated anomaly detection and payload adaptation engine that intercepts failing n8n webhook nodes, queries schema registries, adjusts data mappings in memory, and resumes execution without data loss.",
    techStack: [
      "n8n REST API",
      "Node.js",
      "OpenAI GPT-4o",
      "PostgreSQL",
      "Webhooks",
      "Next.js",
      "TypeScript"
    ],
    keyFeatures: [
      "Real-time webhook interception and failure isolation",
      "LLM diagnostic analysis generating root-cause explanations in plain English",
      "Automated payload schema mapping recovery and retry queuing",
      "Slack & PagerDuty emergency alert routing with one-click resolution buttons",
      "Telemetry dashboard tracking self-healed incidents vs human escalations",
      "Admin panel with schema version history and audit logs"
    ],
    architectureHighlights: [
      "Dead Letter Queue (DLQ) pattern implemented on PostgreSQL",
      "Idempotent retry scheduler with exponential backoff and jitter",
      "n8n execution API hooks for runtime state injection",
      "Fast next.js monitoring console with live WebSocket alerts"
    ],
    deliverables: [
      "Self-healing supervisory daemon packaged as a lightweight Docker container",
      "Operations dashboard with real-time error telemetry and incident timeline",
      "Automated test suite simulating 25+ real-world API failure scenarios",
      "Slack bot integration for interactive failure triage"
    ],
    previewType: "automation",
    waitlistCount: 97,
    createdAt: "2026-10-19T09:00:00.000Z"
  },
  {
    id: "up-05",
    slug: "ai-micro-saas-starter",
    number: "05",
    title: "AI Micro-SaaS Boilerplate with Metered Stripe Usage",
    shortTitle: "AI Micro-SaaS Starter",
    category: "SaaS & CRM",
    status: "In Development",
    targetRelease: "December 2026",
    progress: 85,
    priority: "High",
    headline: "AI Micro-SaaS Starter — Ship Production AI Apps in 48 Hours",
    description: "A battle-tested production starter kit for developers building AI software. Pre-wired with Supabase Auth, PostgreSQL, Stripe tiered subscriptions + token credit packs, dark glassmorphic UI, and streaming OpenAI integrations.",
    problem: "Developers waste 40–60 hours setting up boilerplate authentication, database schemas, Stripe webhooks, and responsive layouts before writing a single line of proprietary AI product logic.",
    solution: "Engineered the ultimate modern full-stack template with strictly typed architecture, server actions, token usage accounting, and cyber-neon aesthetics that allow founders to launch in days instead of months.",
    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Stripe Billing",
      "Supabase",
      "Tailwind CSS",
      "Vercel"
    ],
    keyFeatures: [
      "Pre-configured Supabase Auth with social logins and magic links",
      "Stripe Checkout, Customer Portal & metered token credit accounting",
      "Dark glassmorphic design system with responsive mobile navigation",
      "Admin dashboard with user management, MRR metrics and analytics",
      "Streaming OpenAI integration with token consumption tracking",
      "Production-ready deployment pipeline with environment validation"
    ],
    architectureHighlights: [
      "Next.js App Router with React Server Components for instant initial paint",
      "Idempotent Stripe webhook listeners handling subscription lifecycle events",
      "Prisma schema with credit wallets and transactional deductions",
      "Tailwind CSS theme tokens with high-contrast accessibility"
    ],
    deliverables: [
      "Full source code repository with GitHub Actions CI/CD setup",
      "Comprehensive setup guide and Supabase one-click migration scripts",
      "Stripe CLI test environment configuration files",
      "Starter UI components (Landing page, Auth modal, Dashboard, Pricing table)"
    ],
    previewType: "dashboard",
    waitlistCount: 310,
    createdAt: "2026-10-14T12:00:00.000Z"
  },
  {
    id: "up-06",
    slug: "voice-multimodal-support-bot",
    number: "06",
    title: "Multimodal AI Support & Live Screen Diagnostics Agent",
    shortTitle: "Multimodal Support Bot",
    category: "Voice AI",
    status: "Planning",
    targetRelease: "Q2 2027",
    progress: 35,
    priority: "Medium",
    headline: "Multimodal AI Support — Voice Conversation + Screen Diagnostics",
    description: "An advanced customer support copilot combining natural voice conversation with visual screen perception. Users can share screenshots or stream browser tabs while speaking, and the agent identifies UI bugs and guides resolution live.",
    problem: "Customers struggle to describe visual software glitches and configuration errors over plain text chat, leading to protracted back-and-forth email chains and frustrated users.",
    solution: "Integrating GPT-4o Vision with Realtime Audio streaming. The agent perceives the customer's shared screen, spots error dialogs or misconfigurations immediately, and explains the step-by-step fix out loud while highlighting the button to click.",
    techStack: [
      "OpenAI GPT-4o Vision",
      "Whisper",
      "WebRTC",
      "Next.js",
      "Supabase",
      "Tailwind CSS",
      "TypeScript"
    ],
    keyFeatures: [
      "Real-time visual screen capture analysis with OCR and bounding boxes",
      "Voice conversation with simultaneous visual reasoning",
      "Interactive screen annotation overlays guiding the user",
      "Automatic bug report generation with console error extraction",
      "Full session replay recording and diagnostic audit logs",
      "Role-based customer and support engineer access levels"
    ],
    architectureHighlights: [
      "WebRTC data and media channels delivering low-latency screen frames",
      "Vision frame sampling throttled to optimal tokens per second",
      "Next.js client with canvas overlay renderer for pointer guidance",
      "Supabase Storage with automatic video session archiving"
    ],
    deliverables: [
      "Embeddable browser support widget supporting screen-share and microphone",
      "Support agent console with synchronized audio and video playback",
      "Automated Jira/GitHub issue creator containing error screenshot & repro steps",
      "Admin configuration portal for visual inspection sensitivity"
    ],
    previewType: "inbox",
    waitlistCount: 88,
    createdAt: "2026-10-20T16:00:00.000Z"
  }
];
