"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import ContactSection from "@/components/MainPage/ContactSection";
import type { SiteSettings } from "@/lib/settings";

type Phase = {
  number: string;
  tag: string;
  duration: string;
  title: string;
  description: string;
  deliverables: string[];
  quote: string;
  icon: string;
};

type Principle = {
  number: string;
  title: string;
  description: string;
  badge: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

const PHASES: Phase[] = [
  {
    number: "01",
    tag: "DISCOVERY & ARCHITECTURE",
    duration: "2 to 4 Days",
    title: "Discover, analyze, and lock the scope.",
    description:
      "Every great build starts with absolute clarity. We dissect your requirements, user journey, and existing tooling to eliminate ambiguity before writing code. We define the database model, external API integrations, and technical constraints to establish a fixed milestone roadmap.",
    deliverables: [
      "Technical specification & architecture blueprint",
      "Database schema & relationship diagram",
      "Fixed milestones, deliverables checklist & timeline",
    ],
    quote: "Measure twice, code once. Proper architectural mapping eliminates 80% of downstream revisions.",
    icon: "🗺️",
  },
  {
    number: "02",
    tag: "FOUNDATION & PROTOTYPE",
    duration: "Week 1",
    title: "Scaffold the architecture & live staging.",
    description:
      "A production-grade foundation is established from day one. I configure Next.js, Supabase PostgreSQL with strict Row-Level Security, authentication flows, and automated CI/CD deployments. You get a private staging link to interact with early progress.",
    deliverables: [
      "Live private staging environment (Vercel / Supabase)",
      "Authentication, user sessions & role-based permissions",
      "Responsive core layout, design system & typography tokens",
    ],
    quote: "You interact with working software within the first few days, not weeks later.",
    icon: "⚡",
  },
  {
    number: "03",
    tag: "CORE SPRINT EXECUTION",
    duration: "Weeks 2 – 3",
    title: "Iterative sprints with daily async progress.",
    description:
      "Deep feature engineering. I build out the custom business logic, autonomous AI pipelines, third-party webhooks (Stripe, HubSpot, OpenAI, Resend), and polished interactions. You receive continuous staging updates and async summaries to review progress without meeting fatigue.",
    deliverables: [
      "Feature module deployments onto your staging URL",
      "Asynchronous progress walkthroughs & changelogs",
      "Real-time feedback loops while code is active and adaptable",
    ],
    quote: "Continuous visibility ensures zero surprises and gives you complete control over your product.",
    icon: "🛠️",
  },
  {
    number: "04",
    tag: "AUDIT, LAUNCH & EMPOWER",
    duration: "Final Sprint",
    title: "Rigorous QA, production launch & clean handover.",
    description:
      "Before go-live, the application undergoes end-to-end testing, responsive audits across screen sizes, Lighthouse performance tuning, and domain DNS setup. Once deployed, you receive full repository ownership, environment secret documentation, and a 30-day post-launch warranty.",
    deliverables: [
      "Production deployment on your custom domain & SSL",
      "100% intellectual property & GitHub repository handover",
      "Environment variables runbook & architecture documentation",
      "30-day complimentary bug fix & stabilization warranty",
    ],
    quote: "You walk away with clean, documented code that your team can run and scale with zero dependencies.",
    icon: "🚀",
  },
];

const PRINCIPLES: Principle[] = [
  {
    number: "01",
    badge: "NO MIDDLEMEN",
    title: "Direct Developer Communication",
    description:
      "You speak directly with the engineer writing your code. No account managers, non-technical liaisons, or miscommunicated instructions. Ideas translate into working software without lag.",
  },
  {
    number: "02",
    badge: "REAL CODE",
    title: "Working Demos Over Static Slides",
    description:
      "We test and evaluate real interactive prototypes on staging URLs. You review live database queries, mobile interactions, and actual buttons instead of static Figma slide decks.",
  },
  {
    number: "03",
    badge: "ASYNC-FIRST",
    title: "Structured, Respectful Updates",
    description:
      "I prioritize deep, uninterrupted coding hours paired with regular async updates via Slack, WhatsApp, or Loom. You stay completely informed without having your calendar consumed by check-in meetings.",
  },
  {
    number: "04",
    badge: "BATTLE-TESTED",
    title: "Pragmatic Modern Stack",
    description:
      "Built with Next.js, TypeScript, Tailwind CSS, and Supabase. Clean, maintainable architectures that hire easily, run at edge speeds, and don't accrue fragile dependencies.",
  },
];

const FAQS: FAQItem[] = [
  {
    question: "How do we communicate throughout the sprint?",
    answer:
      "We collaborate via your preferred channel — Slack, WhatsApp, Discord, or Email. You receive asynchronous progress updates with live staging URLs and short Loom walkthroughs whenever major milestones are pushed.",
  },
  {
    question: "What if my requirements or scope evolve midway?",
    answer:
      "We work with an agile mindset. If new features or pivots are needed, we assess the impact on timeline and complexity immediately. We either swap out equal-effort items or agree on a lightweight scope addendum before proceeding.",
  },
  {
    question: "How are project payments structured?",
    answer:
      "Most custom projects operate on milestone-based billing (typically 50% upfront to reserve sprint capacity and initiate Phase 01, and 50% upon successful final deployment and repository handover). For larger systems, we break it into 33% phase milestones.",
  },
  {
    question: "Do I own 100% of the intellectual property and code?",
    answer:
      "Yes, completely. Once the final milestone is settled, full ownership of the GitHub repository, database schemas, assets, and deployment accounts is transferred directly to your organization.",
  },
  {
    question: "What happens after the product is launched?",
    answer:
      "Every project includes a 30-day post-launch warranty covering any unforeseen bugs, performance optimizations, or deployment adjustments. Ongoing monthly maintenance or feature sprint retainer packages are also available if needed.",
  },
];

export default function ProcessClient({ settings }: { settings?: SiteSettings }) {
  const [width, setWidth] = useState<number>(1440);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width <= 768;
  const isTablet = width > 768 && width <= 1024;

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const activePhase = PHASES[activePhaseIndex];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* BREADCRUMB */}
        <div style={styles.breadcrumbRow}>
          <Link href="/" style={styles.backLink}>
            ← Home
          </Link>
          <span style={styles.crumbDivider}>/</span>
          <span style={styles.crumbCurrent}>Process</span>
        </div>

        {/* HERO SECTION */}
        <header style={styles.header}>
          <div style={styles.eyebrowBadge}>ENGINEERING METHODOLOGY &amp; BLUEPRINT</div>
          <h1 style={styles.heroTitle}>
            How great ideas become reliable, live software.
          </h1>
          <p style={styles.heroSubhead}>
            A transparent, async-first development process built on clarity, rapid iterative milestones, and zero agency fluff. From day one to final handover, you always know exactly what is happening and what comes next.
          </p>

          {/* QUICK VALUE HIGHLIGHTS */}
          <div style={styles.highlightsGrid}>
            <div style={styles.highlightPill}>
              <span style={styles.highlightDot} />
              <span style={styles.highlightText}>⚡ 48-Hour Kickoff</span>
            </div>
            <div style={styles.highlightPill}>
              <span style={styles.highlightDot} />
              <span style={styles.highlightText}>🔄 Daily Async Updates</span>
            </div>
            <div style={styles.highlightPill}>
              <span style={styles.highlightDot} />
              <span style={styles.highlightText}>🎯 Fixed-Scope Milestones</span>
            </div>
            <div style={styles.highlightPill}>
              <span style={styles.highlightDot} />
              <span style={styles.highlightText}>🚀 100% Code Ownership</span>
            </div>
          </div>
        </header>

        {/* 4 PHASES DEEP DIVE SECTION */}
        <section style={styles.phasesSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>THE 4 PHASES OF EVERY ENGAGEMENT</div>
            <h2 style={styles.sectionTitle}>A clear path from kickoff to production</h2>
            <p style={styles.sectionSub}>
              Select any phase below to explore its specific timeline, engineering objectives, and tangible client deliverables.
            </p>
          </div>

          {/* PHASE SELECTOR TABS */}
          <div style={styles.phaseTabsContainer}>
            {PHASES.map((p, idx) => {
              const isActive = activePhaseIndex === idx;
              return (
                <button
                  key={p.number}
                  type="button"
                  onClick={() => setActivePhaseIndex(idx)}
                  onMouseEnter={() => setHoveredPhase(idx)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  style={{
                    ...styles.phaseTabBtn,
                    background: isActive ? "#1c231e" : hoveredPhase === idx ? "#151a16" : "#111412",
                    borderColor: isActive ? "#caff46" : "#28322a",
                    transform: isActive ? "translateY(-2px)" : "none",
                  }}
                >
                  <div style={styles.tabTop}>
                    <span
                      style={{
                        ...styles.tabNum,
                        color: isActive ? "#caff46" : "#838d85",
                      }}
                    >
                      {p.number}
                    </span>
                    <span style={styles.tabDuration}>{p.duration}</span>
                  </div>
                  <div
                    style={{
                      ...styles.tabTitle,
                      color: isActive ? "#ffffff" : "#aeb5af",
                    }}
                  >
                    {p.tag}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE PHASE DETAILED CARD */}
          <div style={styles.activePhaseCard}>
            <div style={styles.activePhaseHeader}>
              <div style={styles.phaseBadgeRow}>
                <span style={styles.activePhaseNum}>PHASE {activePhase.number}</span>
                <span style={styles.activePhaseTag}>{activePhase.tag}</span>
                <span style={styles.activePhaseDuration}>⏱ {activePhase.duration}</span>
              </div>
              <h3 style={styles.activePhaseTitle}>{activePhase.title}</h3>
              <p style={styles.activePhaseDesc}>{activePhase.description}</p>
            </div>

            <div style={styles.activePhaseSplit}>
              {/* DELIVERABLES LIST */}
              <div style={styles.deliverablesBox}>
                <div style={styles.deliverablesTitle}>WHAT YOU RECEIVE AT THIS PHASE:</div>
                <ul style={styles.deliverablesList}>
                  {activePhase.deliverables.map((item) => (
                    <li key={item} style={styles.deliverableItem}>
                      <span style={styles.checkIcon}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* QUOTE / PRINCIPLE CALLOUT */}
              <div style={styles.phaseQuoteBox}>
                <div style={styles.quoteIcon}>{activePhase.icon}</div>
                <div style={styles.quoteText}>&ldquo;{activePhase.quote}&rdquo;</div>
                <div style={styles.quoteAuthor}>— Zohaib, Full-Stack &amp; AI Builder</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div style={styles.divider} />

        {/* CORE COLLABORATION PRINCIPLES */}
        <section style={styles.principlesSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>HOW WE WORK TOGETHER</div>
            <h2 style={styles.sectionTitle}>The &ldquo;No Agency Fluff&rdquo; Standard</h2>
            <p style={styles.sectionSub}>
              Modern software requires modern working practices. Here is why working directly with an independent developer yields better results, faster turnaround, and higher code quality.
            </p>
          </div>

          <div style={styles.principlesGrid}>
            {PRINCIPLES.map((pr) => (
              <div key={pr.number} style={styles.principleCard}>
                <div style={styles.principleTop}>
                  <span style={styles.principleNum}>{pr.number}</span>
                  <span style={styles.principleBadge}>{pr.badge}</span>
                </div>
                <h3 style={styles.principleTitle}>{pr.title}</h3>
                <p style={styles.principleDesc}>{pr.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div style={styles.divider} />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section style={styles.faqSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionEyebrow}>COMMON QUESTIONS</div>
            <h2 style={styles.sectionTitle}>Everything you need to know about partnering</h2>
            <p style={styles.sectionSub}>
              Clear answers to the questions clients ask most often before kicking off a project.
            </p>
          </div>

          <div style={styles.faqContainer}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.question} style={styles.faqCard}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={styles.faqQuestionBtn}
                    aria-expanded={isOpen}
                  >
                    <span style={styles.faqQuestionText}>{faq.question}</span>
                    <span
                      style={{
                        ...styles.faqIcon,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        color: isOpen ? "#caff46" : "#89928b",
                      }}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div style={styles.faqAnswerBox}>
                      <p style={styles.faqAnswerText}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div style={styles.divider} />

        {/* KICKOFF CALL TO ACTION BANNER */}
        <section style={styles.ctaBanner}>
          <div style={styles.ctaLeft}>
            <div style={styles.ctaEyebrow}>HAVE A PROJECT READY?</div>
            <h2 style={styles.ctaTitle}>Let&apos;s map out your build roadmap.</h2>
            <p style={styles.ctaSub}>
              Share your concept or current bottleneck. I will review your requirements and provide a clear technical scope, milestone estimate, and initial recommendations within 24 hours.
            </p>
          </div>
          <div style={styles.ctaRight}>
            <Link href="/contact" style={styles.ctaPrimaryBtn}>
              Discuss Your Project ↗
            </Link>
            <Link href="/projects" style={styles.ctaSecondaryBtn}>
              View Live Case Studies ↓
            </Link>
          </div>
        </section>
      </div>

      {/* EMBEDDED CONTACT FORM */}
      <ContactSection settings={settings} />
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0c0e0d",
    color: "#f5f6f4",
    fontFamily: "inherit",
  },
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "120px 24px 60px",
    boxSizing: "border-box",
  },
  breadcrumbRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
    fontSize: "13px",
  },
  backLink: {
    color: "#caff46",
    textDecoration: "none",
    fontWeight: "600",
  },
  crumbDivider: {
    color: "#465048",
  },
  crumbCurrent: {
    color: "#8e9890",
  },
  header: {
    marginBottom: "64px",
  },
  eyebrowBadge: {
    display: "inline-block",
    color: "#caff46",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    marginBottom: "18px",
  },
  heroTitle: {
    fontSize: "clamp(34px, 5.5vw, 60px)",
    lineHeight: "1.08",
    fontWeight: "400",
    color: "#f6f6f4",
    margin: "0 0 22px",
    letterSpacing: "-1.5px",
    maxWidth: "850px",
  },
  heroSubhead: {
    fontSize: "clamp(16px, 2vw, 19px)",
    lineHeight: "1.65",
    color: "#b4beb6",
    maxWidth: "760px",
    margin: "0 0 36px",
  },
  highlightsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px 18px",
  },
  highlightPill: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#141915",
    border: "1px solid #283329",
    borderRadius: "30px",
    padding: "8px 16px",
  },
  highlightDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#caff46",
  },
  highlightText: {
    fontSize: "13px",
    color: "#d9e2db",
    fontWeight: "500",
  },
  phasesSection: {
    marginBottom: "80px",
  },
  sectionHeader: {
    marginBottom: "36px",
  },
  sectionEyebrow: {
    color: "#caff46",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.4px",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "clamp(26px, 4vw, 42px)",
    lineHeight: "1.15",
    fontWeight: "400",
    color: "#f5f6f4",
    margin: "0 0 14px",
    letterSpacing: "-1px",
  },
  sectionSub: {
    fontSize: "15px",
    color: "#9da69f",
    maxWidth: "680px",
    lineHeight: "1.6",
    margin: 0,
  },
  phaseTabsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "24px",
  },
  phaseTabBtn: {
    padding: "18px 20px",
    border: "1px solid #28322a",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.25s ease",
  },
  tabTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  tabNum: {
    fontSize: "18px",
    fontWeight: "700",
    fontFamily: "monospace",
  },
  tabDuration: {
    fontSize: "11px",
    color: "#838d85",
    background: "#18201a",
    padding: "3px 8px",
    borderRadius: "12px",
  },
  tabTitle: {
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  activePhaseCard: {
    background: "#121613",
    border: "1px solid #283329",
    borderRadius: "14px",
    padding: "clamp(24px, 4vw, 44px)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
  },
  activePhaseHeader: {
    borderBottom: "1px solid #232c25",
    paddingBottom: "28px",
    marginBottom: "28px",
  },
  phaseBadgeRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  activePhaseNum: {
    background: "#caff46",
    color: "#0c0e0d",
    fontSize: "11px",
    fontWeight: "800",
    padding: "4px 10px",
    borderRadius: "4px",
    letterSpacing: "0.8px",
  },
  activePhaseTag: {
    color: "#aeb5af",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  activePhaseDuration: {
    color: "#caff46",
    fontSize: "12px",
    fontWeight: "600",
    background: "rgba(202, 255, 70, 0.08)",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  activePhaseTitle: {
    fontSize: "clamp(22px, 3.5vw, 32px)",
    color: "#f6f6f4",
    margin: "0 0 14px",
    fontWeight: "500",
    lineHeight: "1.25",
  },
  activePhaseDesc: {
    fontSize: "15px",
    lineHeight: "1.75",
    color: "#b4beb6",
    margin: 0,
    maxWidth: "840px",
  },
  activePhaseSplit: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "28px",
    alignItems: "stretch",
  },
  deliverablesBox: {
    background: "#0e120f",
    border: "1px solid #222a23",
    borderRadius: "10px",
    padding: "24px",
  },
  deliverablesTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#caff46",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  deliverablesList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  deliverableItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "14px",
    color: "#d0d8d2",
    lineHeight: "1.5",
  },
  checkIcon: {
    color: "#caff46",
    fontWeight: "700",
    flexShrink: 0,
  },
  phaseQuoteBox: {
    background: "linear-gradient(135deg, #161c17 0%, #101411 100%)",
    border: "1px solid #263228",
    borderRadius: "10px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  quoteIcon: {
    fontSize: "30px",
    marginBottom: "12px",
  },
  quoteText: {
    fontSize: "15px",
    lineHeight: "1.65",
    color: "#e2ebe4",
    fontStyle: "italic",
    marginBottom: "14px",
  },
  quoteAuthor: {
    fontSize: "12px",
    color: "#919b93",
    fontWeight: "600",
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#222a23",
    margin: "70px 0",
  },
  principlesSection: {
    marginBottom: "80px",
  },
  principlesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  principleCard: {
    background: "#121613",
    border: "1px solid #242c25",
    borderRadius: "12px",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    transition: "border-color 0.25s ease, transform 0.25s ease",
  },
  principleTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  principleNum: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#caff46",
    fontFamily: "monospace",
  },
  principleBadge: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#929d94",
    background: "#1a211b",
    border: "1px solid #2d382e",
    padding: "4px 8px",
    borderRadius: "12px",
    letterSpacing: "0.8px",
  },
  principleTitle: {
    fontSize: "19px",
    color: "#f6f6f4",
    margin: "0 0 12px",
    fontWeight: "600",
    lineHeight: "1.3",
  },
  principleDesc: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#a4aea6",
    margin: 0,
  },
  faqSection: {
    marginBottom: "80px",
  },
  faqContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "920px",
  },
  faqCard: {
    background: "#121613",
    border: "1px solid #232a24",
    borderRadius: "10px",
    overflow: "hidden",
  },
  faqQuestionBtn: {
    width: "100%",
    padding: "20px 24px",
    background: "none",
    border: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left",
  },
  faqQuestionText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f3f5f3",
    lineHeight: "1.4",
  },
  faqIcon: {
    fontSize: "22px",
    fontWeight: "400",
    lineHeight: "1",
    transition: "transform 0.2s ease, color 0.2s ease",
    marginLeft: "16px",
    flexShrink: 0,
  },
  faqAnswerBox: {
    padding: "0 24px 22px",
    borderTop: "1px solid #1c231d",
  },
  faqAnswerText: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#b0baa2",
    margin: "14px 0 0",
  },
  ctaBanner: {
    background: "linear-gradient(135deg, #151d16 0%, #0e1310 100%)",
    border: "1px solid #2c382e",
    borderRadius: "16px",
    padding: "clamp(28px, 5vw, 52px)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "36px",
    alignItems: "center",
  },
  ctaLeft: {},
  ctaEyebrow: {
    color: "#caff46",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.4px",
    marginBottom: "12px",
  },
  ctaTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    color: "#f6f6f4",
    margin: "0 0 14px",
    fontWeight: "500",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
  },
  ctaSub: {
    fontSize: "14px",
    color: "#abb5ad",
    lineHeight: "1.7",
    margin: 0,
  },
  ctaRight: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    alignItems: "flex-start",
  },
  ctaPrimaryBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    textDecoration: "none",
    padding: "14px 28px",
    borderRadius: "30px",
    fontWeight: "700",
    fontSize: "14px",
    transition: "transform 0.2s ease, background 0.2s ease",
    display: "inline-block",
  },
  ctaSecondaryBtn: {
    color: "#d0d8d2",
    textDecoration: "none",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: "500",
  },
};
