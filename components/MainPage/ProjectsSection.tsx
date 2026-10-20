"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import ProjectPreviewCard from "@/components/Projects/ProjectPreviewCard";
import type { Project } from "@/lib/projects";

export default function SelectedWork({
  projects: propProjects,
}: {
  projects?: Project[];
}) {
  const router = useRouter();
  const [width, setWidth] = useState(1440);
  const [projectList, setProjectList] = useState<Project[]>(
    propProjects && propProjects.length > 0 ? propProjects : []
  );
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

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
      background: "#0c0e0d",
      color: "#ffffff",
      padding: isMobile
        ? "60px 18px 55px"
        : isTablet
        ? "80px 28px 70px"
        : "95px 40px 80px",
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
      marginBottom: isMobile ? "35px" : "45px",
    },

    label: {
      color: "#caff46",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: "16px",
      lineHeight: "1.5",
    },

    heading: {
      margin: 0,
      maxWidth: "620px",
      color: "#f6f6f4",
      fontSize: isMobile ? "34px" : isTablet ? "44px" : "50px",
      lineHeight: "1.06",
      fontWeight: "400",
    },

    intro: {
      maxWidth: "280px",
      margin: 0,
      color: "#a6aca7",
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: "1.65",
      justifySelf: isMobile ? "start" : "end",
    },

    projects: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    card: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: isMobile || isTablet ? "1fr" : "1.05fr 0.95fr",
      borderRadius: "10px",
      overflow: "hidden",
      background: "#121512",
      boxSizing: "border-box",
      cursor: "pointer",
      border: "1px solid #282f29",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
      transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
    },

    previewContainer: {
      padding: isMobile ? "12px" : "16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "rgba(0, 0, 0, 0.2)",
      boxSizing: "border-box",
    },

    content: {
      padding: isMobile ? "18px 16px" : "24px 28px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      boxSizing: "border-box",
    },

    status: {
      color: "#caff46",
      fontSize: "10px",
      letterSpacing: "1px",
      marginBottom: "8px",
      fontWeight: "700",
      display: "flex",
      gap: "6px",
    },

    projectTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "20px" : "23px",
      fontWeight: "600",
      lineHeight: "1.25",
    },

    description: {
      margin: "10px 0 0",
      color: "#a4aca6",
      fontSize: "13px",
      lineHeight: "1.6",
    },

    outcome: {
      marginTop: "12px",
      padding: "8px 12px",
      background: "rgba(202, 255, 70, 0.05)",
      borderLeft: "2px solid #caff46",
      borderRadius: "0 4px 4px 0",
      color: "#c2ccc4",
      fontSize: "12px",
      lineHeight: "1.55",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },

    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "14px",
    },

    tag: {
      padding: "4px 10px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "20px",
      fontSize: "11px",
      color: "#d0d6d1",
      background: "rgba(255, 255, 255, 0.03)",
    },

    actionsRow: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginTop: "18px",
      flexWrap: "wrap",
    },

    projectLink: {
      fontSize: "13px",
      fontWeight: "600",
      paddingBottom: "2px",
      transition: "color 0.2s ease, border-color 0.2s ease",
    },

    demoLink: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#caff46",
      textDecoration: "none",
    },

    githubLink: {
      fontSize: "12px",
      fontWeight: "500",
      color: "#8d968f",
      textDecoration: "none",
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
      background: "#3b403c",
    },

    circle: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      border: "1px solid #caff46",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      color: "#ffffff",
      marginBottom: "14px",
      transition: "transform 0.2s ease, background 0.2s ease",
    },

    viewLink: {
      color: "#c9cfca",
      textDecoration: "none",
      fontSize: "11px",
      letterSpacing: "1.6px",
      fontWeight: "600",
    },
  };

  const getCardStyle = (slug: string): CSSProperties => ({
    ...styles.card,
    border:
      hoveredProject === slug ? "1px solid #caff46" : "1px solid #282f29",
    transform:
      hoveredProject === slug ? "translateY(-4px)" : "translateY(0)",
    boxShadow:
      hoveredProject === slug
        ? "0 20px 45px rgba(0, 0, 0, 0.55)"
        : "0 10px 25px rgba(0, 0, 0, 0.25)",
  });

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.top}>
          <div>
            <div style={styles.label}>01 / SELECTED WORK</div>
            <h2 style={styles.heading}>
              Crafted for scale, performance &amp; revenue.
            </h2>
          </div>

          <p style={styles.intro}>
            Full-stack apps, AI systems, and automated operations built for high-growth businesses.
          </p>
        </div>

        <div style={styles.projects}>
          {projectList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                border: "1px dashed #263328",
                borderRadius: "10px",
                background: "#101411",
              }}
            >
              <p
                style={{
                  color: "#8a948c",
                  fontSize: "15px",
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
                  padding: "8px 18px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                + Add Your First Project in Admin ↗
              </Link>
            </div>
          ) : (
            projectList.slice(0, 4).map((project) => (
              <article
                key={project.slug}
                style={getCardStyle(project.slug)}
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => router.push(`/projects/${project.slug}`)}
              >
                {/* PREVIEW CONTAINER */}
                <div style={styles.previewContainer}>
                  <ProjectPreviewCard project={project} isMobile={isMobile} />
                </div>

                {/* CONTENT CONTAINER */}
                <div style={styles.content}>
                  <div style={styles.status}>
                    <span>{project.number || "01"}</span>
                    <span>/</span>
                    <span>{project.status.toUpperCase()}</span>
                  </div>

                  <h3 style={styles.projectTitle}>
                    {project.title || project.headline}
                  </h3>

                  <p className="line-clamp-2" style={styles.description}>
                    {project.description}
                  </p>

                  {project.outcome && (
                    <div className="line-clamp-3" style={styles.outcome}>
                      <strong style={{ color: "#caff46" }}>Outcome:</strong>{" "}
                      {project.outcome}
                    </div>
                  )}

                  {project.tags && project.tags.length > 0 && (
                    <div style={styles.tags}>
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} style={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={styles.actionsRow}>
                    <span
                      style={{
                        ...styles.projectLink,
                        color:
                          hoveredProject === project.slug || hoveredLink === project.slug
                            ? "#caff46"
                            : "#ffffff",
                        borderBottom:
                          hoveredProject === project.slug || hoveredLink === project.slug
                            ? "1px solid #caff46"
                            : "1px solid #76805e",
                      }}
                    >
                      Explore Case Study ↗
                    </span>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={styles.demoLink}
                      >
                        Live Demo ↗
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={styles.githubLink}
                      >
                        GitHub ↗
                      </a>
                    )}
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
