"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import ProjectPreviewCard from "@/components/Projects/ProjectPreviewCard";
import type { Project } from "@/lib/projects";

export default function SelectedWork({
  projects: propProjects,
}: {
  projects?: Project[];
}) {
  const [width, setWidth] = useState(1440);
  const [projectList, setProjectList] = useState<Project[]>(
    propProjects && propProjects.length > 0 ? propProjects : []
  );
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Refresh dynamic projects from Supabase / API so admin updates reflect immediately
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjectList(data.projects);
        }
      })
      .catch((err) => console.warn("Failed to fetch dynamic projects for homepage:", err));

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (propProjects && propProjects.length > 0) {
      setProjectList(propProjects);
    }
  }, [propProjects]);

  const isMobile = width <= 768;
  const isTablet = width > 768 && width <= 1024;

  const styles: Record<string, CSSProperties> = {
    section: {
      width: "100%",
      background: "#ffffff",
      color: "#202329",
      padding: isMobile
        ? "54px 18px 58px"
        : isTablet
        ? "68px 28px 68px"
        : "78px 40px 76px",
      boxSizing: "border-box",
    },

    container: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
    },

    top: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.5fr 0.5fr",
      gap: isMobile ? "20px" : "45px",
      alignItems: "end",
      marginBottom: isMobile ? "28px" : "36px",
    },

    label: {
      color: "#315bc7",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: "16px",
      lineHeight: "1.5",
    },

    heading: {
      margin: 0,
      maxWidth: "680px",
      color: "#202329",
      fontSize: isMobile ? "34px" : isTablet ? "44px" : "50px",
      lineHeight: "1.06",
      fontWeight: "400",
    },

    intro: {
      maxWidth: "300px",
      margin: 0,
      color: "#727882",
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: "1.65",
      justifySelf: isMobile ? "start" : "end",
    },

    projects: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
      gap: isMobile ? "20px" : "24px",
    },

    card: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "18px",
      overflow: "hidden",
      background: "var(--surface)",
      boxSizing: "border-box",
      cursor: "pointer",
      border: "1px solid var(--line)",
      boxShadow: "0 10px 30px rgba(28, 35, 52, 0.045)",
      transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
      position: "relative",
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
      background: "#f0f2f8",
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
      padding: isMobile ? "18px" : "22px 24px",
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
      color: "#315bc7",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: "8px",
      display: "flex",
      gap: "6px",
    },

    projectTitle: {
      margin: 0,
      fontSize: "clamp(19px, 2vw, 23px)",
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
      borderLeft: "2px solid #dfe6fb",
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
      color: "#315bc7",
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
      padding: "5px 9px",
      borderRadius: "999px",
      border: "1px solid #e2dfd5",
      fontSize: "10px",
      color: "#202329",
      background: "#f5f6fa",
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
      paddingBottom: "2px",
      transition: "color 0.2s ease, border-color 0.2s ease",
    },

    clientMeta: {
      fontSize: "11px",
      color: "#727882",
      letterSpacing: "0.4px",
    },

    bottom: {
      marginTop: isMobile ? "50px" : "65px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },

    line: {
      width: "1px",
      height: isMobile ? "40px" : "50px",
      background: "#eeece5",
    },

    circle: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      border: "1px solid #dfe6fb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      color: "#202329",
      marginBottom: "14px",
      transition: "transform 0.2s ease, background 0.2s ease",
    },

    viewLink: {
      color: "#48505a",
      textDecoration: "none",
      fontSize: "11px",
      letterSpacing: "1.6px",
      fontWeight: "600",
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

    roadmapCallout: {
      marginTop: "48px",
      background: "var(--surface)",
      border: "1px solid #e2dfd5",
      borderRadius: "14px",
      padding: isMobile ? "24px 20px" : "28px 34px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "24px",
      flexWrap: "wrap",
    },

    roadmapTag: {
      display: "inline-block",
      fontSize: "10px",
      color: "#315bc7",
      fontWeight: "800",
      letterSpacing: "1px",
      background: "rgba(49, 91, 199, 0.08)",
      padding: "3px 8px",
      borderRadius: "4px",
      marginBottom: "8px",
    },

    roadmapTitle: {
      fontSize: isMobile ? "18px" : "20px",
      color: "#202329",
      fontWeight: "600",
      margin: "0 0 6px",
    },

    roadmapSub: {
      fontSize: "13px",
      color: "#727882",
      margin: 0,
      maxWidth: "520px",
      lineHeight: "1.5",
    },

    roadmapBtn: {
      background: "#315bc7",
      color: "#ffffff",
      textDecoration: "none",
      padding: "12px 22px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "800",
      whiteSpace: "nowrap",
      transition: "transform 0.2s ease",
    },
  };

  const getCardStyle = (slug: string): CSSProperties => ({
    ...styles.card,
    border:
      hoveredProject === slug ? "1px solid var(--accent)" : "1px solid var(--line)",
    transform:
      hoveredProject === slug ? "translateY(-2px)" : "translateY(0)",
      boxShadow:
      hoveredProject === slug
        ? "0 18px 38px rgba(28, 35, 52, 0.1)"
        : "0 8px 24px rgba(28, 35, 52, 0.04)",
  });

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.top}>
          <div>
            <div style={styles.label}>SELECTED WORK</div>
            <h2 style={styles.heading}>Selected work.</h2>
          </div>

          <p style={styles.intro}>
            Recent products and systems, built around real needs.
          </p>
        </div>

        <div style={styles.projects}>
          {projectList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                border: "1px dashed #d8d5cc",
                borderRadius: "10px",
                background: "#f4f6f2",
              }}
            >
              <p
                style={{
                  color: "#727882",
                  fontSize: "15px",
                  margin: "0 0 16px",
                }}
              >
                New work will be added here soon.
              </p>
            </div>
          ) : (
            projectList.slice(-3).reverse().map((project) => (
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
                    <Image src={project.images[0]} alt={`${project.title || project.headline} interface`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" unoptimized style={styles.projectImage} />
                  ) : (
                    <ProjectPreviewCard project={project} isMobile={isMobile} />
                  )}
                </div>

                {/* CONTENT CONTAINER */}
                <div style={styles.contentContainer}>
                  <div style={styles.projectEyebrow}>
                    <span>{project.number || "01"}</span>
                    <span>/</span>
                    <span>{project.status || "Web Apps"}</span>
                  </div>

                  <h3 style={styles.projectTitle}>
                    {project.title || project.headline}
                  </h3>

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

                  {/* ACTION LINKS & META */}
                  <div style={styles.actionsRow}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          ...styles.projectLink,
                          color:
                            hoveredProject === project.slug
                              ? "var(--accent)"
                              : "var(--text)",
                          borderBottom:
                            hoveredProject === project.slug
                              ? "1px solid var(--accent)"
                              : "1px solid #8f9aad",
                        }}
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

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--text-soft)",
                            textDecoration: "none",
                            paddingBottom: "2px",
                            pointerEvents: "auto",
                          }}
                        >
                          GitHub ↗
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div style={styles.bottom}>
          <div style={styles.line} />

          <Link
            href="/projects"
            style={{
              textDecoration: "none",
            }}
          >
            <div style={styles.circle}>↓</div>
          </Link>

          <Link href="/projects" style={styles.viewLink}>
            VIEW ALL PROJECTS
          </Link>
        </div>
      </div>
    </section>
  );
}
