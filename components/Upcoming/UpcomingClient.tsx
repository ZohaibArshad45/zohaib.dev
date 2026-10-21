"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import ContactSection from "@/components/MainPage/ContactSection";
import type { UpcomingProject } from "@/lib/upcoming";
import { UPCOMING_CATEGORIES } from "@/lib/upcoming";

type Props = {
  initialUpcomingProjects?: UpcomingProject[];
};

export default function UpcomingClient({
  initialUpcomingProjects,
}: Props) {
  const [projects, setProjects] = useState<UpcomingProject[]>(
    initialUpcomingProjects || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<UpcomingProject | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(1440);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Refresh dynamically in case admin updated projects
    fetch("/api/upcoming")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.upcomingProjects)) {
          setProjects(data.upcomingProjects);
        }
      })
      .catch((err) => console.warn("Failed to fetch fresh upcoming projects:", err));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width <= 720;
  const isTablet = width <= 1024;

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const avgProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.progress || 0), 0) /
            projects.length
        )
      : 0;

  const inDevCount = projects.filter(
    (p) => p.status === "In Development" || p.status === "Beta Testing"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Beta Testing":
        return { bg: "rgba(126, 217, 87, 0.15)", text: "#7ed957", border: "#7ed957" };
      case "Ready for Launch":
        return { bg: "rgba(202, 255, 70, 0.18)", text: "#caff46", border: "#caff46" };
      case "In Development":
        return { bg: "rgba(255, 179, 71, 0.15)", text: "#ffb347", border: "#ffb347" };
      case "Prototype":
        return { bg: "rgba(147, 112, 219, 0.15)", text: "#bb9af7", border: "#bb9af7" };
      default:
        return { bg: "rgba(100, 149, 237, 0.15)", text: "#7aa2f7", border: "#7aa2f7" };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return { text: "CRITICAL PRIORITY", color: "#ff6b6b", bg: "rgba(255, 107, 107, 0.12)" };
      case "High":
        return { text: "HIGH PRIORITY", color: "#caff46", bg: "rgba(202, 255, 70, 0.12)" };
      default:
        return { text: "MEDIUM PRIORITY", color: "#9aa5b1", bg: "rgba(154, 165, 177, 0.12)" };
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* BREADCRUMB */}
        <div style={styles.breadcrumbRow}>
          <Link href="/" style={styles.backLink}>
            ← Home
          </Link>
          <span style={styles.crumbDivider}>/</span>
          <Link href="/projects" style={styles.backLink}>
            Projects
          </Link>
          <span style={styles.crumbDivider}>/</span>
          <span style={styles.crumbCurrent}>Upcoming AI Roadmap</span>
        </div>

        {/* HERO HEADER */}
        <header style={styles.header}>
          <div style={styles.eyebrowBadge}>
            <span style={styles.pulseDot} />
            <span>ACTIVE R&amp;D PIPELINE • UPCOMING AI PROJECTS</span>
          </div>

          <h1 style={styles.title}>
            Next-generation autonomous AI systems &amp;
            <span style={styles.titleAccent}> SaaS products in the lab.</span>
          </h1>

          <p style={styles.subhead}>
            A transparent blueprint of AI agents, realtime voice copilot platforms,
            enterprise MCP server hubs, and n8n automations currently being engineered.
            Every project follows a strict production standard: Authentication, Dark Mode,
            Stripe Billing, Database Architecture, RBAC, and Cloud Deployment.
          </p>

          {/* ROADMAP STATS STRIP */}
          <div style={styles.statsStrip}>
            <div style={styles.statBox}>
              <div style={styles.statNum}>
                {projects.length < 10 ? `0${projects.length}` : projects.length}
              </div>
              <div style={styles.statLabel}>Pipelines in Flight</div>
            </div>

            <div style={styles.statBox}>
              <div style={styles.statNum}>
                {inDevCount < 10 ? `0${inDevCount}` : inDevCount}
              </div>
              <div style={styles.statLabel}>Active Builds &amp; Betas</div>
            </div>

            <div style={styles.statBox}>
              <div style={styles.statNum}>{avgProgress}%</div>
              <div style={styles.statLabel}>Average Build Velocity</div>
            </div>

            <div style={styles.statBox}>
              <div style={styles.statNum}>100%</div>
              <div style={styles.statLabel}>Production Architecture</div>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div style={styles.controlsRow}>
            {/* CATEGORY TABS */}
            <div style={styles.categoryTabs}>
              {UPCOMING_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === "All"
                    ? projects.length
                    : projects.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      ...styles.catButton,
                      background: isSelected ? "#caff46" : "#141815",
                      color: isSelected ? "#0c0e0d" : "#c4cbc4",
                      borderColor: isSelected ? "#caff46" : "#283329",
                      fontWeight: isSelected ? "700" : "500",
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      style={{
                        ...styles.catCount,
                        background: isSelected
                          ? "rgba(12, 14, 13, 0.2)"
                          : "rgba(202, 255, 70, 0.12)",
                        color: isSelected ? "#0c0e0d" : "#caff46",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SEARCH INPUT */}
            <div style={styles.searchWrapper}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7a857b"
                strokeWidth="2"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI stack, keywords, or title..."
                style={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={styles.clearSearchBtn}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </header>

        {/* PROJECTS GRID */}
        <section style={styles.gridSection}>
          {filteredProjects.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={{ color: "#8a948c", fontSize: "16px", margin: "0 0 12px" }}>
                No upcoming projects found matching &ldquo;{searchQuery || selectedCategory}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                style={styles.resetButton}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                  ? "1fr 1fr"
                  : "repeat(3, 1fr)",
                gap: "24px",
              }}
            >
              {filteredProjects.map((project) => {
                const statusStyle = getStatusColor(project.status);
                const priorityBadge = getPriorityBadge(project.priority);
                const isHovered = hoveredCard === project.slug;

                return (
                  <article
                    key={project.slug}
                    style={{
                      ...styles.card,
                      borderColor: isHovered ? "#caff46" : "#222a24",
                      transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                      boxShadow: isHovered
                        ? "0 20px 45px rgba(0,0,0,0.5), 0 0 25px rgba(202,255,70,0.14)"
                        : "0 8px 24px rgba(0,0,0,0.25)",
                    }}
                    onMouseEnter={() => setHoveredCard(project.slug)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* CARD HEADER */}
                    <div style={styles.cardHeader}>
                      <div style={styles.cardHeaderLeft}>
                        <span style={styles.cardNum}>{project.number}</span>
                        <span style={styles.cardCategory}>{project.category}</span>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                        }}
                      >
                        <span
                          style={{
                            ...styles.statusDot,
                            background: statusStyle.text,
                          }}
                        />
                        {project.status}
                      </span>
                    </div>

                    {/* CARD TITLE & DESCRIPTION */}
                    <h2 style={styles.cardTitle}>{project.title}</h2>

                    <p style={styles.cardDesc} className="line-clamp-3">
                      {project.description}
                    </p>

                    {/* PROGRESS BAR & TARGET RELEASE */}
                    <div style={styles.progressContainer}>
                      <div style={styles.progressMeta}>
                        <span style={styles.progressLabel}>
                          Development Progress
                        </span>
                        <span style={styles.progressValue}>
                          {project.progress}%
                        </span>
                      </div>
                      <div style={styles.progressBarBg}>
                        <div
                          style={{
                            ...styles.progressBarFill,
                            width: `${project.progress}%`,
                            background:
                              project.progress >= 80
                                ? "linear-gradient(90deg, #caff46 0%, #7ed957 100%)"
                                : "linear-gradient(90deg, #ffb347 0%, #caff46 100%)",
                          }}
                        />
                      </div>
                      <div style={styles.releaseRow}>
                        <span style={styles.releaseText}>
                          Target: <strong>{project.targetRelease}</strong>
                        </span>
                        <span
                          style={{
                            ...styles.priorityTag,
                            color: priorityBadge.color,
                            background: priorityBadge.bg,
                          }}
                        >
                          {priorityBadge.text}
                        </span>
                      </div>
                    </div>

                    {/* TECH STACK CHIPS */}
                    <div style={styles.techChipsRow}>
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} style={styles.techChip}>
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span style={styles.techChipMore}>
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* CORE FEATURES CHECKLIST PREVIEW */}
                    <div style={styles.featuresPreviewBox}>
                      <div style={styles.featuresBoxTitle}>CORE SAAS STACK:</div>
                      <div style={styles.featureChipsStrip}>
                        <span style={styles.featureCheck}>✓ Auth</span>
                        <span style={styles.featureCheck}>✓ Stripe</span>
                        <span style={styles.featureCheck}>✓ AI Agent</span>
                        <span style={styles.featureCheck}>✓ Postgres</span>
                        <span style={styles.featureCheck}>✓ RBAC</span>
                      </div>
                    </div>

                    {/* CARD ACTION BUTTON */}
                    <div style={styles.cardFooter}>
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        style={styles.blueprintBtn}
                      >
                        <span>View Blueprint &amp; Details</span>
                        <span style={{ color: "#caff46" }}>↗</span>
                      </button>

                      <Link
                        href={`/contact?service=${project.slug}`}
                        style={styles.requestSimilarLink}
                      >
                        Request This Build ↗
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* BLUEPRINT DETAIL MODAL */}
        {selectedProject && (
          <div
            style={styles.modalOverlay}
            onClick={() => setSelectedProject(null)}
          >
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div style={styles.modalHeader}>
                <div>
                  <div style={styles.modalEyebrow}>
                    {selectedProject.number} / {selectedProject.category} •{" "}
                    <span style={{ color: "#caff46" }}>
                      {selectedProject.status} ({selectedProject.progress}% Ready)
                    </span>
                  </div>
                  <h2 style={styles.modalTitle}>{selectedProject.title}</h2>
                  <div style={styles.modalTarget}>
                    Target Release:{" "}
                    <strong style={{ color: "#ffffff" }}>
                      {selectedProject.targetRelease}
                    </strong>{" "}
                    • Priority:{" "}
                    <span style={{ color: "#caff46", fontWeight: "700" }}>
                      {selectedProject.priority}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  style={styles.modalCloseBtn}
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              {/* MODAL BODY */}
              <div style={styles.modalBody}>
                {/* DESCRIPTION */}
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>01 / PROJECT OVERVIEW</h3>
                  <p style={styles.modalText}>{selectedProject.description}</p>
                </div>

                {/* PROBLEM & SOLUTION DUAL COLUMNS */}
                <div style={styles.modalGrid2}>
                  <div style={styles.modalBox}>
                    <div style={styles.boxLabel}>THE CHALLENGE</div>
                    <p style={styles.boxText}>{selectedProject.problem}</p>
                  </div>
                  <div style={styles.modalBoxAccent}>
                    <div style={styles.boxLabelAccent}>THE AI ARCHITECTURE</div>
                    <p style={styles.boxText}>{selectedProject.solution}</p>
                  </div>
                </div>

                {/* 10 CORE FEATURES CHECKLIST */}
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>
                    02 / FULL PRODUCTION SPECIFICATION (10 CHECKPOINTS)
                  </h3>
                  <div style={styles.checklistGrid}>
                    {[
                      "Authentication & User Sessions (Supabase / NextAuth)",
                      "Operations Dashboard & Live Analytics",
                      "Full Administrative Panel & Configuration Controls",
                      "Dark Glassmorphic UI with Fluid Responsive Layouts",
                      "Stripe Subscriptions, Invoicing & Customer Portal",
                      "Autonomous AI Engine (OpenAI / LangChain / RAG)",
                      "PostgreSQL Database with Prisma ORM & Connection Pooling",
                      "Role Based Access Control (RBAC) & Team Workspaces",
                      "Multi-Carrier Webhooks & n8n Event Pipelines",
                      "Production Cloud Deployment with Sub-Second Vercel Edge",
                    ].map((feat) => (
                      <div key={feat} style={styles.checkItem}>
                        <span style={styles.greenCheck}>✓</span>
                        <span style={styles.checkText}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TECHNOLOGY STACK */}
                <div style={styles.modalSection}>
                  <h3 style={styles.modalSectionTitle}>03 / PLANNED TECH STACK</h3>
                  <div style={styles.modalTagsRow}>
                    {selectedProject.techStack.map((tech) => (
                      <span key={tech} style={styles.modalTechPill}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DELIVERABLES & HIGHLIGHTS */}
                {selectedProject.deliverables &&
                  selectedProject.deliverables.length > 0 && (
                    <div style={styles.modalSection}>
                      <h3 style={styles.modalSectionTitle}>
                        04 / TARGET DELIVERABLES &amp; MILESTONES
                      </h3>
                      <ul style={styles.modalList}>
                        {selectedProject.deliverables.map((item) => (
                          <li key={item} style={styles.modalListItem}>
                            <span style={styles.bulletDot}>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* ACTION CALLOUT */}
                <div style={styles.modalCtaBox}>
                  <div>
                    <h4 style={styles.modalCtaHeading}>
                      Want this system deployed for your business?
                    </h4>
                    <p style={styles.modalCtaDesc}>
                      I build bespoke instances of this architecture tailored to your specific APIs, team workflows, and data sources.
                    </p>
                  </div>

                  <Link
                    href={`/contact?service=${encodeURIComponent(
                      selectedProject.title
                    )}`}
                    style={styles.modalCtaBtn}
                    onClick={() => setSelectedProject(null)}
                  >
                    Request Custom Build ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION CTA */}
        <div style={styles.divider} />
        <ContactSection />
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0c0e0d",
    color: "#f5f5f5",
    fontFamily: "Arial, Helvetica, sans-serif",
    paddingTop: "100px",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px 80px",
    boxSizing: "border-box",
  },
  breadcrumbRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    marginBottom: "36px",
    flexWrap: "wrap",
  },
  backLink: {
    color: "#929a93",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  crumbDivider: {
    color: "#3f4641",
  },
  crumbCurrent: {
    color: "#caff46",
    fontWeight: "600",
  },
  header: {
    marginBottom: "50px",
  },
  eyebrowBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#caff46",
    background: "rgba(202, 255, 70, 0.08)",
    border: "1px solid rgba(202, 255, 70, 0.22)",
    padding: "6px 14px",
    borderRadius: "20px",
    letterSpacing: "1px",
    marginBottom: "20px",
  },
  pulseDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#caff46",
    boxShadow: "0 0 10px #caff46",
  },
  title: {
    fontSize: "clamp(34px, 5vw, 56px)",
    fontWeight: "400",
    lineHeight: "1.1",
    margin: "0 0 20px",
    letterSpacing: "-1.5px",
    color: "#ffffff",
  },
  titleAccent: {
    color: "#caff46",
    display: "inline",
  },
  subhead: {
    fontSize: "17px",
    color: "#b0b8b2",
    lineHeight: "1.65",
    maxWidth: "840px",
    margin: "0 0 36px",
  },
  statsStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    padding: "20px 24px",
    background: "rgba(20, 24, 21, 0.7)",
    border: "1px solid #232c25",
    borderRadius: "14px",
    marginBottom: "36px",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statNum: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "-1px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#8e9890",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontWeight: "600",
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  categoryTabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  catButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  catCount: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "1px 6px",
    borderRadius: "10px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#141815",
    border: "1px solid #283329",
    padding: "8px 14px",
    borderRadius: "8px",
    minWidth: "260px",
    maxWidth: "360px",
    flex: "1 1 auto",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "13px",
    width: "100%",
  },
  clearSearchBtn: {
    background: "transparent",
    border: "none",
    color: "#7e8880",
    cursor: "pointer",
    fontSize: "12px",
  },
  gridSection: {
    marginBottom: "60px",
  },
  emptyState: {
    padding: "80px 24px",
    textAlign: "center",
    background: "rgba(18, 22, 19, 0.4)",
    border: "1px dashed #273028",
    borderRadius: "14px",
  },
  resetButton: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "8px 18px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  card: {
    background:
      "linear-gradient(160deg, rgba(23, 29, 24, 0.95) 0%, rgba(14, 18, 15, 0.95) 100%)",
    border: "1px solid #222a24",
    borderRadius: "16px",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
    boxSizing: "border-box",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    gap: "8px",
  },
  cardHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardNum: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#caff46",
  },
  cardCategory: {
    fontSize: "12px",
    color: "#8e9890",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: "1.3",
    margin: "0 0 12px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#a6b0a8",
    lineHeight: "1.6",
    margin: "0 0 20px",
    flex: "1 0 auto",
  },
  progressContainer: {
    background: "rgba(12, 16, 13, 0.8)",
    border: "1px solid #1f2721",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "18px",
  },
  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
    marginBottom: "8px",
  },
  progressLabel: {
    color: "#8a948c",
  },
  progressValue: {
    color: "#caff46",
    fontWeight: "800",
  },
  progressBarBg: {
    width: "100%",
    height: "6px",
    background: "#18201a",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.4s ease",
  },
  releaseRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "11px",
  },
  releaseText: {
    color: "#9aa39c",
  },
  priorityTag: {
    fontSize: "10px",
    fontWeight: "800",
    padding: "2px 7px",
    borderRadius: "4px",
    letterSpacing: "0.5px",
  },
  techChipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "16px",
  },
  techChip: {
    fontSize: "11px",
    color: "#c4cdc6",
    background: "#151b17",
    border: "1px solid #232c25",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  techChipMore: {
    fontSize: "11px",
    color: "#caff46",
    background: "rgba(202, 255, 70, 0.08)",
    border: "1px solid rgba(202, 255, 70, 0.2)",
    padding: "3px 7px",
    borderRadius: "4px",
    fontWeight: "700",
  },
  featuresPreviewBox: {
    background: "rgba(10, 14, 11, 0.6)",
    border: "1px solid #1c241e",
    borderRadius: "8px",
    padding: "10px 12px",
    marginBottom: "20px",
  },
  featuresBoxTitle: {
    fontSize: "10px",
    color: "#6f7971",
    letterSpacing: "1px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  featureChipsStrip: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    fontSize: "11px",
    color: "#8fda58",
    fontWeight: "600",
  },
  featureCheck: {
    whiteSpace: "nowrap",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "auto",
    paddingTop: "14px",
    borderTop: "1px solid #1c241e",
    flexWrap: "wrap",
  },
  blueprintBtn: {
    background: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 0",
  },
  requestSimilarLink: {
    fontSize: "12px",
    color: "#caff46",
    textDecoration: "none",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(12px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalContent: {
    background: "#111613",
    border: "1px solid #2e3b31",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "840px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.8), 0 0 40px rgba(202, 255, 70, 0.15)",
    boxSizing: "border-box",
  },
  modalHeader: {
    padding: "28px 32px",
    borderBottom: "1px solid #212a23",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  modalEyebrow: {
    fontSize: "12px",
    color: "#8a948c",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  modalTitle: {
    fontSize: "26px",
    color: "#ffffff",
    fontWeight: "600",
    lineHeight: "1.2",
    margin: "0 0 10px",
  },
  modalTarget: {
    fontSize: "13px",
    color: "#9aa39c",
  },
  modalCloseBtn: {
    background: "#1e2620",
    border: "1px solid #334235",
    color: "#ffffff",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modalBody: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  modalSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  modalSectionTitle: {
    fontSize: "11px",
    letterSpacing: "1.4px",
    fontWeight: "800",
    color: "#caff46",
    margin: 0,
  },
  modalText: {
    fontSize: "15px",
    color: "#c5cdc6",
    lineHeight: "1.65",
    margin: 0,
  },
  modalGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  modalBox: {
    background: "#151b17",
    border: "1px solid #253027",
    borderRadius: "12px",
    padding: "20px",
  },
  boxLabel: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#e05656",
    marginBottom: "10px",
  },
  boxText: {
    fontSize: "14px",
    color: "#b0b8b2",
    lineHeight: "1.6",
    margin: 0,
  },
  modalBoxAccent: {
    background: "rgba(202, 255, 70, 0.04)",
    border: "1px solid rgba(202, 255, 70, 0.25)",
    borderRadius: "12px",
    padding: "20px",
  },
  boxLabelAccent: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#caff46",
    marginBottom: "10px",
  },
  checklistGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "10px",
    marginTop: "6px",
  },
  checkItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    fontSize: "13px",
    color: "#d0d8d2",
  },
  greenCheck: {
    color: "#caff46",
    fontWeight: "800",
  },
  checkText: {
    lineHeight: "1.4",
  },
  modalTagsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  modalTechPill: {
    fontSize: "12px",
    color: "#ffffff",
    background: "#1a221c",
    border: "1px solid #2f3e32",
    padding: "5px 12px",
    borderRadius: "6px",
  },
  modalList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  modalListItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "14px",
    color: "#c5cdc6",
    lineHeight: "1.5",
  },
  bulletDot: {
    color: "#caff46",
    fontWeight: "700",
  },
  modalCtaBox: {
    background: "linear-gradient(145deg, #18221a 0%, #101612 100%)",
    border: "1px solid #2f3e32",
    borderRadius: "14px",
    padding: "24px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  modalCtaHeading: {
    fontSize: "18px",
    color: "#ffffff",
    fontWeight: "700",
    margin: "0 0 6px",
  },
  modalCtaDesc: {
    fontSize: "13px",
    color: "#9aa39c",
    margin: 0,
    maxWidth: "460px",
  },
  modalCtaBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    textDecoration: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },
  divider: {
    height: "1px",
    background: "#1f2621",
    margin: "60px 0",
  },
};
