"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import SiteFooter from "@/components/MainPage/SiteFooter";
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

  const visibleCategories = categoriesList.filter(
    (category) =>
      category === "All" ||
      projectList.some(
        (project) =>
          project.status === category ||
          (Array.isArray(project.categories) &&
            project.categories.includes(category))
      )
  );

  const getCardStyle = (slug: string): CSSProperties => ({
    ...styles.card,
    border:
      hoveredProject === slug
        ? "1px solid var(--accent)"
        : "1px solid var(--line)",
    transform:
      hoveredProject === slug ? "translateY(-2px)" : "translateY(0)",
    boxShadow:
      hoveredProject === slug
        ? "0 16px 34px rgba(28, 35, 52, 0.1)"
        : "0 8px 24px rgba(28, 35, 52, 0.04)",
    transition:
      "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
  });

  const getLinkStyle = (slug: string): CSSProperties => ({
    ...styles.projectLink,
    color: hoveredLink === slug ? "var(--accent)" : "var(--text)",
    borderColor: hoveredLink === slug ? "var(--accent)" : "#727882",
  });

  return (
    <main id="top" style={styles.page}>
      <div style={styles.container}>
        {/* HERO SECTION */}
        <header style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <div style={styles.label}>PROJECTS</div>
            <h1 style={styles.heading}>
              Selected work and
              <span style={styles.headingAccent}> case studies.</span>
            </h1>
          </div>

          <div style={styles.heroRight}>
            <p style={styles.intro}>A few recent products, tools and systems built around real needs.</p>
          </div>
        </header>

        {/* CATEGORY FILTER TABS */}
        <nav aria-label="Project categories" style={styles.filterBar}>
          <div style={styles.filterTabs}>
            {visibleCategories.map((category) => {
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
                    background: isSelected ? "#527d13" : "#fffefa",
                    color: isSelected ? "#ffffff" : "#4b5059",
                    borderColor: isSelected ? "#527d13" : "#e2dfd5",
                    fontWeight: isSelected ? "700" : "500",
                  }}
                >
                  <span>{category}</span>
                  <span
                    style={{
                      ...styles.tabCount,
                      background: isSelected
                        ? "rgba(255, 255, 255, 0.18)"
                        : "rgba(82, 125, 19, 0.08)",
                      color: isSelected ? "#ffffff" : "#527d13",
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
                border: "1px dashed #d8d5cc",
                borderRadius: "14px",
                textAlign: "center",
                background: "#fffefa",
              }}
            >
              <p
                style={{
                  color: "#727882",
                  fontSize: "16px",
                  margin: "0 0 16px",
                }}
              >
                New work will be added here soon.
              </p>
            </div>
          ) : (
            filteredProjects.map((project: Project) => (
              <article
                key={project.slug}
                style={getCardStyle(project.slug)}
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
              >
              {project.slug ? (
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`Open case study: ${project.title || project.headline || project.slug}`}
                  style={styles.cardHit}
                />
              ) : null}
              {/* PREVIEW CONTAINER */}
              <div style={styles.previewContainer}>
                {project.images?.[0] ? (
                  <Image src={project.images[0]} alt={`${project.title || project.headline} interface`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" unoptimized style={{ ...styles.projectImage, transform: hoveredProject === project.slug ? "scale(1.035)" : "scale(1)", transition: "transform 350ms ease" }} />
                ) : (
                  <ProjectPreviewCard project={project} />
                )}
              </div>

              {/* CONTENT CONTAINER */}
              <div style={styles.contentContainer}>
                <div style={styles.projectEyebrow}>
                  <span>{project.status}</span>
                </div>

                <h2 style={styles.projectTitle}>{project.title || project.headline}</h2>

                <p style={styles.projectDescription}>
                  {project.subhead || project.description}
                </p>

                {/* TAGS */}
                {project.tags && project.tags.length > 0 && (
                  <div style={styles.tagsRow}>
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* ACTION LINKS */}
                <div style={styles.actionsRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <span
                      style={getLinkStyle(project.slug)}
                      onMouseEnter={() => setHoveredLink(project.slug)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      Open case study
                    </span>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "var(--accent)",
                          textDecoration: "none",
                          paddingBottom: "2px",
                          pointerEvents: "auto",
                        }}
                      >
                        Live Demo ↗
                      </a>
                    )}

                  </div>
                </div>
              </div>
            </article>
          )))}
        </section>

        {/* BOTTOM CTA BANNER */}
        <div style={styles.ctaBox}>
          <div>
            <div style={styles.label}>HAVE A PROJECT IN MIND?</div>
            <h2 style={styles.ctaHeading}>Have a project in mind?</h2>
            <p style={styles.ctaSub}>
              Share the problem you want to solve. We can work out the next step together.
            </p>
          </div>

          <Link href="/contact" style={styles.ctaButton}>
            Start a conversation ↗
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--page-atmosphere)",
    color: "var(--text)",
  },
  container: {
    width: "100%",
    maxWidth: "1220px",
    margin: "0 auto",
    padding: "112px 24px 88px",
    boxSizing: "border-box",
  },
  label: {
    color: "#527d13",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  heroSection: {
    display: "grid",
    gridTemplateColumns: "0.95fr 1.05fr",
    gap: "40px",
    alignItems: "flex-end",
    marginBottom: "42px",
  },
  heroLeft: {
    maxWidth: "700px",
  },
  heading: {
    margin: 0,
    fontSize: "clamp(38px, 5vw, 62px)",
    lineHeight: "1.04",
    fontWeight: "600",
    letterSpacing: "-1.8px",
    color: "#202329",
  },
  headingAccent: {
    color: "#527d13",
    display: "block",
    marginTop: "4px",
  },
  heroRight: {
    maxWidth: "440px",
  },
  intro: {
    margin: 0,
    color: "#48505a",
    fontSize: "16px",
    lineHeight: "1.7",
  },
  metricsStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    background: "#f4f6f2",
    border: "1px solid #e2dfd5",
    borderRadius: "14px",
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
    color: "#527d13",
    letterSpacing: "-0.5px",
  },
  metricDesc: {
    fontSize: "11px",
    color: "#727882",
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
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
    alignItems: "stretch",
    gap: "24px",
  },
  card: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "18px",
    overflow: "hidden",
    background: "var(--surface)",
    boxSizing: "border-box",
    position: "relative",
    cursor: "pointer",
  },
  cardHit: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
  },
  previewContainer: {
    padding: 0,
    aspectRatio: "16 / 9",
    overflow: "hidden",
    background: "#f4f6f2",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 1,
    pointerEvents: "none",
  },
  projectImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    display: "block",
  },
  contentContainer: {
    padding: "22px 22px 18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1,
    boxSizing: "border-box",
    position: "relative",
    zIndex: 1,
    pointerEvents: "none",
  },
  projectEyebrow: {
    color: "#527d13",
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
    color: "#202329",
  },
  projectSubhead: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#727882",
    fontWeight: "600",
  },
  projectDescription: {
    margin: "12px 0 0",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "var(--text-soft)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  outcomeBox: {
    margin: "10px 0 0",
    paddingLeft: "10px",
    borderLeft: "2px solid #edf4e5",
    fontSize: "12px",
    lineHeight: "1.55",
    color: "#3f4a40",
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
    background: "#ffffff",
    border: "1px solid #e2dfd5",
    borderRadius: "6px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  metricPillVal: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#527d13",
  },
  metricPillLabel: {
    fontSize: "10px",
    color: "#727882",
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
    border: "1px solid #e2dfd5",
    fontSize: "10px",
    color: "#202329",
    background: "#f4f6f2",
  },
  featuresStrip: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px 10px",
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    padding: "8px 10px",
    borderRadius: "6px",
    marginTop: "12px",
    fontSize: "10px",
    color: "#727882",
  },
  featureItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    whiteSpace: "nowrap",
  },
  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid var(--line)",
    position: "relative",
    zIndex: 3,
    pointerEvents: "none",
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
    color: "#727882",
    letterSpacing: "0.4px",
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#eeece5",
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
    color: "#202329",
  },
  principlesIntro: {
    margin: "18px 0 0",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#727882",
  },
  principlesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  principleCard: {
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    borderRadius: "10px",
    padding: "24px",
    boxSizing: "border-box",
  },
  principleNum: {
    color: "#527d13",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  principleHeading: {
    margin: "0 0 8px",
    fontSize: "17px",
    fontWeight: "600",
    color: "#202329",
  },
  principleText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.65",
    color: "#727882",
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
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    borderRadius: "8px",
    padding: "18px",
  },
  techCatTitle: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#527d13",
    marginBottom: "12px",
  },
  techCatTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  techPill: {
    background: "#eeece5",
    border: "1px solid #2d362e",
    color: "#e2e8e2",
    fontSize: "11px",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  ctaBox: {
    marginTop: "80px",
    background: "#eeece5",
    border: "1px solid #edf4e5",
    borderRadius: "12px",
    padding: "44px 38px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "28px",
    boxShadow: "0 10px 32px rgba(82, 125, 19, 0.08)",
  },
  ctaHeading: {
    margin: "6px 0 10px",
    fontSize: "clamp(24px, 3.5vw, 36px)",
    fontWeight: "400",
    color: "#202329",
  },
  ctaSub: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#727882",
    maxWidth: "560px",
  },
  ctaButton: {
    background: "#527d13",
    color: "#ffffff",
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
