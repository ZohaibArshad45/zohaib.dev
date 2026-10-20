"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import ContactSection from "@/components/MainPage/ContactSection";
import ProjectPreviewCard from "@/components/Projects/ProjectPreviewCard";
import { type Project } from "@/lib/projects";

type Props = {
  initialProjects?: Project[];
  initialCategories?: string[];
};

export default function ProjectsClient({ initialProjects, initialCategories }: Props) {
  const [projectList, setProjectList] = useState<Project[]>(
    initialProjects || []
  );
  const [categoriesList, setCategoriesList] = useState<string[]>(
    initialCategories && initialCategories.length > 0
      ? ["All", ...initialCategories]
      : ["All", "Web Apps", "AI Systems", "Automation & Workflows", "Internal Tools"]
  );
  const [width, setWidth] = useState<number>(1440);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Refresh dynamic projects from Supabase / API
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects)) {
          setProjectList(data.projects);
        }
      })
      .catch((err) => console.warn("Failed to fetch dynamic projects:", err));

    // Refresh dynamic categories from Supabase / API
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoriesList(["All", ...data.categories]);
        }
      })
      .catch((err) => console.warn("Failed to fetch dynamic categories:", err));

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = width <= 700;

  const filteredProjects = projectList.filter((project) => {
    if (activeCategory === "All") return true;
    return (
      project.status === activeCategory ||
      (Array.isArray(project.categories) &&
        project.categories.includes(activeCategory))
    );
  });

  const getCardStyle = (slug: string): CSSProperties => ({
    ...styles.card,
    border:
      hoveredProject === slug
        ? "1px solid #caff46"
        : "1px solid #282f29",
    transform:
      hoveredProject === slug ? "translateY(-4px)" : "translateY(0)",
    boxShadow:
      hoveredProject === slug
        ? "0 22px 50px rgba(0, 0, 0, 0.45)"
        : "0 10px 30px rgba(0, 0, 0, 0.2)",
    transition:
      "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
  });

  const getLinkStyle = (slug: string): CSSProperties => ({
    ...styles.projectLink,
    color: hoveredLink === slug ? "#caff46" : "#ffffff",
    borderColor: hoveredLink === slug ? "#caff46" : "#76805e",
  });

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* HERO SECTION */}
        <header style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <div style={styles.label}>01 / ALL WORK &amp; CASE STUDIES</div>
            <h1 style={styles.heading}>
              Products, systems &amp;
              <span style={styles.headingAccent}> intelligent workflows.</span>
            </h1>
          </div>

          <div style={styles.heroRight}>
            <p style={styles.intro}>
              A comprehensive showcase of web applications, AI integrations,
              internal tooling, and event-driven automation engineered for real
              business operations.
            </p>
          </div>
        </header>

        {/* METRICS STRIP */}
        <section style={styles.metricsStrip}>
          <div style={styles.metricItem}>
            <div style={styles.metricVal}>
              {projectList.length < 10
                ? `0${projectList.length}`
                : `${projectList.length}`}
              {projectList.length > 1 ? "+" : ""}
            </div>
            <div style={styles.metricDesc}>
              {projectList.length === 1
                ? "Production System Built"
                : "Production Systems Built"}
            </div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricVal}>
              {categoriesList.filter((c) => c !== "All").length < 10
                ? `0${categoriesList.filter((c) => c !== "All").length}`
                : `${categoriesList.filter((c) => c !== "All").length}`}
            </div>
            <div style={styles.metricDesc}>Core Solution Domains</div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricVal}>100%</div>
            <div style={styles.metricDesc}>Production Tested &amp; Typed</div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricVal}>99.9%</div>
            <div style={styles.metricDesc}>System Reliability &amp; Uptime</div>
          </div>
        </section>

        {/* CATEGORY FILTER TABS */}
        <nav aria-label="Project categories" style={styles.filterBar}>
          <div style={styles.filterTabs}>
            {categoriesList.map((category) => {
              const isSelected = activeCategory === category;
              const count =
                category === "All"
                  ? projectList.length
                  : projectList.filter(
                      (p) =>
                        p.status === category ||
                        (Array.isArray(p.categories) &&
                          p.categories.includes(category))
                    ).length;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  style={{
                    ...styles.tabButton,
                    background: isSelected ? "#caff46" : "#171b18",
                    color: isSelected ? "#0c0e0d" : "#c4cbc4",
                    borderColor: isSelected ? "#caff46" : "#2a322b",
                    fontWeight: isSelected ? "700" : "500",
                  }}
                >
                  <span>{category}</span>
                  <span
                    style={{
                      ...styles.tabCount,
                      background: isSelected
                        ? "rgba(12, 14, 13, 0.15)"
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
        </nav>

        {/* PROJECTS GRID / LIST */}
        <section style={styles.projectsList}>
          {filteredProjects.length === 0 ? (
            <div
              style={{
                padding: "80px 24px",
                border: "1px dashed #273028",
                borderRadius: "14px",
                textAlign: "center",
                background: "rgba(18, 22, 19, 0.4)",
              }}
            >
              <p
                style={{
                  color: "#8a948c",
                  fontSize: "16px",
                  margin: "0 0 16px",
                }}
              >
                No projects published yet in the database.
              </p>
              <Link
                href="/admin"
                style={{
                  display: "inline-block",
                  color: "#caff46",
                  border: "1px solid #caff46",
                  padding: "9px 22px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                + Add Project in Admin ↗
              </Link>
            </div>
          ) : (
            filteredProjects.map((project: Project) => (
              <article
                key={project.slug}
                style={getCardStyle(project.slug)}
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
              >
              {/* PREVIEW CONTAINER */}
              <div style={styles.previewContainer}>
                <ProjectPreviewCard project={project} isMobile={isMobile} />
              </div>

              {/* CONTENT CONTAINER */}
              <div style={styles.contentContainer}>
                <div style={styles.projectEyebrow}>
                  <span>{project.number}</span>
                  <span>/</span>
                  <span>{project.status}</span>
                </div>

                <h2 style={styles.projectTitle}>{project.title || project.headline}</h2>

                {project.subhead && (
                  <p style={styles.projectSubhead}>{project.subhead}</p>
                )}

                <p className="line-clamp-3" style={styles.projectDescription}>
                  {project.description}
                </p>

                {project.outcome && (
                  <div className="line-clamp-3" style={styles.outcomeBox}>
                    <strong style={{ color: "#caff46" }}>Outcome:</strong> {project.outcome}
                  </div>
                )}

                {/* METRICS PILLS */}
                {project.metrics && project.metrics.length > 0 && (
                  <div style={styles.metricsRow}>
                    {project.metrics.slice(0, 3).map((m) => (
                      <div key={m.label} style={styles.metricPill}>
                        <span style={styles.metricPillVal}>{m.value}</span>
                        <span style={styles.metricPillLabel}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAGS */}
                {project.tags && project.tags.length > 0 && (
                  <div style={styles.tagsRow}>
                    {project.tags.slice(0, 5).map((tag) => (
                      <span key={tag} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* ACTION LINKS */}
                <div style={styles.actionsRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <Link
                      href={`/projects/${project.slug}`}
                      style={getLinkStyle(project.slug)}
                      onMouseEnter={() => setHoveredLink(project.slug)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      Explore Case Study ↗
                    </Link>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#caff46",
                          textDecoration: "none",
                          paddingBottom: "2px",
                        }}
                      >
                        Live Demo ↗
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#a4aca6",
                          textDecoration: "none",
                          paddingBottom: "2px",
                        }}
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>

                  {[project.client, project.timeline].filter(Boolean).length > 0 && (
                    <span style={styles.clientMeta}>
                      {[project.client, project.timeline].filter(Boolean).join(" • ")}
                    </span>
                  )}
                </div>
              </div>
            </article>
          )))}
        </section>

        <div style={styles.divider} />

        {/* ENGINEERING PRINCIPLES */}
        <section style={styles.principlesSection}>
          <div style={styles.principlesLeft}>
            <div style={styles.label}>02 / ENGINEERING STANDARDS</div>
            <h2 style={styles.principlesTitle}>
              How every system
              <br />
              is built to last.
            </h2>
            <p style={styles.principlesIntro}>
              Software shouldn&apos;t just look impressive on launch day. It
              needs to run reliably when real business data is flowing through
              it at scale.
            </p>
          </div>

          <div style={styles.principlesGrid}>
            <div style={styles.principleCard}>
              <div style={styles.principleNum}>01</div>
              <h3 style={styles.principleHeading}>Direct &amp; Unified Delivery</h3>
              <p style={styles.principleText}>
                No layers of account managers or outsourced handoffs. You work
                directly with the engineer architecting your code from scoping to
                production rollout.
              </p>
            </div>

            <div style={styles.principleCard}>
              <div style={styles.principleNum}>02</div>
              <h3 style={styles.principleHeading}>Grounded, Practical AI</h3>
              <p style={styles.principleText}>
                No probabilistic guesswork where accuracy matters. All AI agents
                are anchored to strict schemas, verifiable vector embeddings, and
                deterministic fallbacks.
              </p>
            </div>

            <div style={styles.principleCard}>
              <div style={styles.principleNum}>03</div>
              <h3 style={styles.principleHeading}>Idempotent Automations</h3>
              <p style={styles.principleText}>
                Workflows handle retries, rate limits, schema anomalies, and
                edge drops gracefully with automatic audit logging and zero
                silent failures.
              </p>
            </div>

            <div style={styles.principleCard}>
              <div style={styles.principleNum}>04</div>
              <h3 style={styles.principleHeading}>High-Density, Fast UIs</h3>
              <p style={styles.principleText}>
                Clean interfaces focused on clarity and velocity. Zero lag,
                accessible contrast ratios, responsive on all displays, and
                keyboard-efficient navigation.
              </p>
            </div>
          </div>
        </section>

        <div style={styles.divider} />

        {/* TECH STACK SECTION */}
        <section style={styles.techSection}>
          <div>
            <div style={styles.label}>03 / TECHNICAL CAPABILITIES</div>
            <h2 style={styles.principlesTitle}>
              Core tools &amp; frameworks.
            </h2>
          </div>

          <div style={styles.techGrid}>
            <div style={styles.techCategory}>
              <div style={styles.techCatTitle}>WEB &amp; FULL-STACK</div>
              <div style={styles.techCatTags}>
                <span style={styles.techPill}>Next.js 16</span>
                <span style={styles.techPill}>React 19</span>
                <span style={styles.techPill}>TypeScript</span>
                <span style={styles.techPill}>Tailwind CSS</span>
                <span style={styles.techPill}>Node.js</span>
              </div>
            </div>

            <div style={styles.techCategory}>
              <div style={styles.techCatTitle}>DATA &amp; CLOUD</div>
              <div style={styles.techCatTags}>
                <span style={styles.techPill}>PostgreSQL</span>
                <span style={styles.techPill}>Supabase</span>
                <span style={styles.techPill}>Vercel</span>
                <span style={styles.techPill}>Redis</span>
                <span style={styles.techPill}>Docker</span>
              </div>
            </div>

            <div style={styles.techCategory}>
              <div style={styles.techCatTitle}>AI &amp; AGENTS</div>
              <div style={styles.techCatTags}>
                <span style={styles.techPill}>OpenAI GPT-4o</span>
                <span style={styles.techPill}>Claude 3.5</span>
                <span style={styles.techPill}>LangChain</span>
                <span style={styles.techPill}>Pinecone</span>
                <span style={styles.techPill}>RAG Pipelines</span>
              </div>
            </div>

            <div style={styles.techCategory}>
              <div style={styles.techCatTitle}>AUTOMATION &amp; APIS</div>
              <div style={styles.techCatTags}>
                <span style={styles.techPill}>n8n</span>
                <span style={styles.techPill}>HubSpot API</span>
                <span style={styles.techPill}>Asana API</span>
                <span style={styles.techPill}>Webhooks</span>
                <span style={styles.techPill}>REST / GraphQL</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <div style={styles.ctaBox}>
          <div>
            <div style={styles.label}>HAVE A PROJECT IN MIND?</div>
            <h2 style={styles.ctaHeading}>Let&apos;s build something exceptional.</h2>
            <p style={styles.ctaSub}>
              Whether you need a full web product, a custom AI integration, or an
              automated workflow system, let&apos;s discuss the problem and find the
              best path forward.
            </p>
          </div>

          <Link href="/contact" style={styles.ctaButton}>
            Start a conversation ↗
          </Link>
        </div>
      </div>

      {/* FOOTER CONTACT FORM */}
      <ContactSection />
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0c0e0d",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "1220px",
    margin: "0 auto",
    padding: "135px 24px 80px",
    boxSizing: "border-box",
  },
  label: {
    color: "#caff46",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  heroSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    alignItems: "flex-end",
    marginBottom: "50px",
  },
  heroLeft: {
    maxWidth: "700px",
  },
  heading: {
    margin: 0,
    fontSize: "clamp(38px, 5vw, 62px)",
    lineHeight: "1.04",
    fontWeight: "400",
    letterSpacing: "-0.5px",
    color: "#f6f6f4",
  },
  headingAccent: {
    color: "#caff46",
    display: "block",
    marginTop: "4px",
  },
  heroRight: {
    maxWidth: "440px",
  },
  intro: {
    margin: 0,
    color: "#b8beb9",
    fontSize: "16px",
    lineHeight: "1.7",
  },
  metricsStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "10px",
    padding: "24px 28px",
    marginBottom: "50px",
  },
  metricItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metricVal: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#caff46",
    letterSpacing: "-0.5px",
  },
  metricDesc: {
    fontSize: "11px",
    color: "#8e968f",
    fontWeight: "600",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  },
  filterBar: {
    marginBottom: "40px",
  },
  filterTabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  tabButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "24px",
    fontSize: "13px",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "all 0.2s ease",
  },
  tabCount: {
    fontSize: "11px",
    padding: "2px 7px",
    borderRadius: "12px",
    fontWeight: "700",
  },
  projectsList: {
    display: "flex",
    flexDirection: "column",
    gap: "36px",
  },
  card: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#121512",
    boxSizing: "border-box",
  },
  previewContainer: {
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "rgba(0,0,0,0.25)",
    boxSizing: "border-box",
  },
  contentContainer: {
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  projectEyebrow: {
    color: "#caff46",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "8px",
    display: "flex",
    gap: "6px",
  },
  projectTitle: {
    margin: 0,
    fontSize: "clamp(20px, 2.2vw, 25px)",
    lineHeight: "1.2",
    fontWeight: "500",
    color: "#ffffff",
  },
  projectSubhead: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#9da49e",
    fontWeight: "600",
  },
  projectDescription: {
    margin: "8px 0 0",
    fontSize: "13px",
    lineHeight: "1.55",
    color: "#bac0bb",
  },
  outcomeBox: {
    margin: "10px 0 0",
    paddingLeft: "10px",
    borderLeft: "2px solid #caff46",
    fontSize: "12px",
    lineHeight: "1.55",
    color: "#d7dbd7",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  metricsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  metricPill: {
    background: "#181d19",
    border: "1px solid #2e372f",
    borderRadius: "6px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  metricPillVal: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#caff46",
  },
  metricPillLabel: {
    fontSize: "10px",
    color: "#8a948c",
  },
  tagsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "12px",
  },
  tag: {
    padding: "4px 9px",
    borderRadius: "14px",
    border: "1px solid #363d37",
    fontSize: "10px",
    color: "#ffffff",
    background: "#151916",
  },
  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid #252b26",
  },
  projectLink: {
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    paddingBottom: "5px",
    borderBottom: "1px solid #76805e",
    transition: "color 0.2s ease, border-color 0.2s ease",
  },
  clientMeta: {
    fontSize: "11px",
    color: "#7e8880",
    letterSpacing: "0.4px",
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#282e29",
    margin: "80px 0",
  },
  principlesSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "50px",
  },
  principlesLeft: {
    maxWidth: "460px",
  },
  principlesTitle: {
    margin: 0,
    fontSize: "clamp(30px, 4vw, 44px)",
    lineHeight: "1.1",
    fontWeight: "400",
    color: "#f6f6f4",
  },
  principlesIntro: {
    margin: "18px 0 0",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#b0b8b1",
  },
  principlesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  principleCard: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "10px",
    padding: "24px",
    boxSizing: "border-box",
  },
  principleNum: {
    color: "#caff46",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  principleHeading: {
    margin: "0 0 8px",
    fontSize: "17px",
    fontWeight: "600",
    color: "#ffffff",
  },
  principleText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.65",
    color: "#9da59f",
  },
  techSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
  },
  techGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
  },
  techCategory: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "8px",
    padding: "18px",
  },
  techCatTitle: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#caff46",
    marginBottom: "12px",
  },
  techCatTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  techPill: {
    background: "#1a1f1b",
    border: "1px solid #2d362e",
    color: "#e2e8e2",
    fontSize: "11px",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  ctaBox: {
    marginTop: "80px",
    background: "#121512",
    border: "1px solid #caff46",
    borderRadius: "12px",
    padding: "44px 38px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "28px",
    boxShadow: "0 10px 40px rgba(202, 255, 70, 0.08)",
  },
  ctaHeading: {
    margin: "6px 0 10px",
    fontSize: "clamp(24px, 3.5vw, 36px)",
    fontWeight: "400",
    color: "#ffffff",
  },
  ctaSub: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#b0b8b1",
    maxWidth: "560px",
  },
  ctaButton: {
    background: "#caff46",
    color: "#0c0e0d",
    padding: "16px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
};
