"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import ContactSection from "@/components/MainPage/ContactSection";
import ProjectPreviewCard from "@/components/Projects/ProjectPreviewCard";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  nextProject?: Project;
};

export default function ProjectDetailClient({ project, nextProject }: Props) {
  const [width, setWidth] = useState<number>(1440);
  const [selectedImgIdx, setSelectedImgIdx] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = width <= 700;

  const validImages = (project.images || []).filter(
    (img) => typeof img === "string" && img.trim().length > 0
  );
  const hasImages = validImages.length > 0;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* BREADCRUMB */}
        <div style={styles.breadcrumbRow}>
          <Link href="/projects" style={styles.backLink}>
            ← All Projects
          </Link>
          <span style={styles.crumbDivider}>/</span>
          <span style={styles.crumbCurrent}>{project.shortTitle}</span>
        </div>

        {/* HERO HEADER */}
        <header style={styles.header}>
          <div style={styles.statusEyebrow}>
            {project.number} / {project.status}
          </div>

          <h1 style={styles.title}>{project.title}</h1>

          <p style={styles.subhead}>{project.subhead}</p>

          {/* PROJECT INFO GRID */}
          <div style={styles.metaGrid}>
            <div style={styles.metaCard}>
              <div style={styles.metaLabel}>CLIENT / SCOPE</div>
              <div style={styles.metaValue}>{project.client || "Direct Project"}</div>
            </div>

            <div style={styles.metaCard}>
              <div style={styles.metaLabel}>ROLE</div>
              <div style={styles.metaValue}>{project.role || "Lead Engineer"}</div>
            </div>

            <div style={styles.metaCard}>
              <div style={styles.metaLabel}>TIMELINE</div>
              <div style={styles.metaValue}>{project.timeline || "Completed"}</div>
            </div>

            <div style={styles.metaCard}>
              <div style={styles.metaLabel}>CATEGORIES</div>
              <div style={styles.metaValue}>
                {Array.isArray(project.categories) && project.categories.length > 0
                  ? project.categories.join(", ")
                  : project.status || "Web Apps"}
              </div>
            </div>
          </div>
        </header>

        {/* PREVIEW CONTAINER / 3-IMAGE GALLERY */}
        <section style={styles.previewSection}>
          {hasImages ? (
            <div style={styles.galleryWrapper}>
              <div style={styles.mainImageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={validImages[selectedImgIdx] || validImages[0]}
                  alt={project.title}
                  style={styles.mainImage}
                />
                <div style={styles.galleryBadge}>
                  Screenshot {selectedImgIdx + 1} of {validImages.length}
                </div>
              </div>

              {validImages.length > 1 && (
                <div style={styles.thumbnailRow}>
                  {validImages.map((img, idx) => (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => setSelectedImgIdx(idx)}
                      style={{
                        ...styles.thumbBtn,
                        borderColor:
                          selectedImgIdx === idx ? "#caff46" : "#28342a",
                        transform:
                          selectedImgIdx === idx ? "scale(1.02)" : "scale(1)",
                        boxShadow:
                          selectedImgIdx === idx
                            ? "0 0 12px rgba(202, 255, 70, 0.25)"
                            : "none",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Screenshot ${idx + 1}`}
                        style={styles.thumbImg}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <ProjectPreviewCard project={project} isMobile={isMobile} />
          )}
        </section>

        {/* IMPACT METRICS */}
        {project.metrics && project.metrics.length > 0 && (
          <section style={styles.metricsBanner}>
            <div style={styles.metricsLabel}>KEY IMPACT &amp; MEASURED RESULTS</div>
            <div style={styles.metricsGrid}>
              {project.metrics.map((metric) => (
                <div key={metric.label} style={styles.metricItem}>
                  <div style={styles.metricValue}>{metric.value}</div>
                  <div style={styles.metricName}>{metric.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CORE CONTENT: PROBLEM & SOLUTION */}
        {(Boolean(project.problem) || Boolean(project.solution)) && (
          <section style={styles.sectionGrid}>
            {project.problem && (
              <div style={styles.sectionCol}>
                <div style={styles.label}>01 / THE CHALLENGE</div>
                <h2 style={styles.sectionHeading}>The Problem</h2>
                <p style={styles.bodyText}>{project.problem}</p>
              </div>
            )}

            {project.solution && (
              <div style={styles.sectionCol}>
                <div style={styles.label}>02 / THE APPROACH</div>
                <h2 style={styles.sectionHeading}>The Solution</h2>
                <p style={styles.bodyText}>{project.solution}</p>
              </div>
            )}
          </section>
        )}

        {(Boolean(project.problem) || Boolean(project.solution)) && (
          <div style={styles.divider} />
        )}

        {/* ARCHITECTURE HIGHLIGHTS */}
        {project.architectureHighlights && project.architectureHighlights.length > 0 && (
          <>
            <section style={styles.deepDiveSection}>
              <div style={styles.label}>03 / SYSTEM ARCHITECTURE</div>
              <h2 style={styles.sectionHeading}>Engineering &amp; Technical Highlights</h2>
              <p style={styles.bodyIntro}>
                Engineered with a focus on low latency, observable data flows, and
                fault-tolerant execution.
              </p>

              <div style={styles.archGrid}>
                {project.architectureHighlights.map((highlight, index) => (
                  <div key={highlight + index} style={styles.archCard}>
                    <div style={styles.archNum}>0{index + 1}</div>
                    <p style={styles.archText}>{highlight}</p>
                  </div>
                ))}
              </div>
            </section>
            <div style={styles.divider} />
          </>
        )}

        {/* DELIVERABLES & TECH STACK */}
        <section style={styles.sectionGrid}>
          {project.deliverables && project.deliverables.length > 0 && (
            <div>
              <div style={styles.label}>04 / DELIVERABLES</div>
              <h2 style={styles.sectionHeading}>What Was Built</h2>
              <ul style={styles.deliverablesList}>
                {project.deliverables.map((item) => (
                  <li key={item} style={styles.deliverableItem}>
                    <span style={styles.checkIcon}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div style={styles.label}>05 / TECHNOLOGY STACK</div>
            <h2 style={styles.sectionHeading}>Tools &amp; Frameworks</h2>
            <p style={styles.bodyText}>
              Selected strictly for reliability, developer ergonomics, and
              operational performance:
            </p>
            <div style={styles.tagsContainer}>
              {project.tags.map((tag) => (
                <span key={tag} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            {project.outcome && (
              <div style={styles.outcomeHighlight}>
                <strong>Primary Takeaway:</strong> {project.outcome}
              </div>
            )}
          </div>
        </section>

        <div style={styles.divider} />

        {/* NEXT PROJECT CARD */}
        {nextProject && (
          <section style={styles.nextProjectBanner}>
            <div>
              <div style={styles.nextLabel}>NEXT CASE STUDY</div>
              <h3 style={styles.nextTitle}>{nextProject.title}</h3>
              <p style={styles.nextSub}>{nextProject.headline}</p>
            </div>

            <Link href={`/projects/${nextProject.slug}`} style={styles.nextButton}>
              View Project ↗
            </Link>
          </section>
        )}
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
    maxWidth: "1140px",
    margin: "0 auto",
    padding: "130px 24px 80px",
    boxSizing: "border-box",
  },
  breadcrumbRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    marginBottom: "36px",
  },
  backLink: {
    color: "#caff46",
    textDecoration: "none",
    fontWeight: "600",
  },
  crumbDivider: {
    color: "#4a534c",
  },
  crumbCurrent: {
    color: "#8c968e",
  },
  header: {
    marginBottom: "40px",
  },
  statusEyebrow: {
    color: "#caff46",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(34px, 4.5vw, 56px)",
    lineHeight: "1.06",
    fontWeight: "400",
    letterSpacing: "-0.5px",
    color: "#f6f6f4",
    maxWidth: "920px",
  },
  subhead: {
    margin: "18px 0 0",
    fontSize: "17px",
    color: "#bac2bc",
    lineHeight: "1.6",
    maxWidth: "760px",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginTop: "36px",
    borderTop: "1px solid #282f29",
    paddingTop: "24px",
  },
  metaCard: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "8px",
    padding: "16px 18px",
  },
  metaLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#838d85",
    letterSpacing: "0.8px",
    marginBottom: "6px",
  },
  metaValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
  },
  previewSection: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "16px",
    marginBottom: "40px",
  },
  metricsBanner: {
    background: "#121512",
    border: "1px solid #caff46",
    borderRadius: "10px",
    padding: "24px 28px",
    marginBottom: "60px",
    boxShadow: "0 8px 30px rgba(202, 255, 70, 0.06)",
  },
  metricsLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#caff46",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  metricItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  metricValue: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#ffffff",
  },
  metricName: {
    fontSize: "12px",
    color: "#9aa39c",
  },
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "48px",
  },
  sectionCol: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: "#caff46",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "12px",
  },
  sectionHeading: {
    margin: "0 0 16px",
    fontSize: "26px",
    fontWeight: "400",
    color: "#f6f6f4",
  },
  bodyText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#b4bcb5",
  },
  bodyIntro: {
    margin: "0 0 28px",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#9fa8a1",
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#282f29",
    margin: "64px 0",
  },
  deepDiveSection: {
    width: "100%",
  },
  archGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },
  archCard: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "8px",
    padding: "20px",
  },
  archNum: {
    color: "#caff46",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  archText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#c0c8c1",
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
    lineHeight: "1.5",
    color: "#c0c8c1",
  },
  checkIcon: {
    color: "#caff46",
    fontWeight: "700",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "24px",
  },
  tag: {
    padding: "6px 12px",
    borderRadius: "16px",
    border: "1px solid #363e37",
    background: "#161b17",
    fontSize: "12px",
    color: "#ffffff",
  },
  outcomeHighlight: {
    padding: "16px",
    borderRadius: "8px",
    background: "#161b17",
    borderLeft: "3px solid #caff46",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#dce3dc",
  },
  nextProjectBanner: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "12px",
    padding: "36px 32px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
  },
  nextLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#caff46",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  nextTitle: {
    margin: "0 0 6px",
    fontSize: "22px",
    fontWeight: "500",
    color: "#ffffff",
  },
  nextSub: {
    margin: 0,
    fontSize: "13px",
    color: "#8a948c",
  },
  nextButton: {
    background: "#caff46",
    color: "#0c0e0d",
    padding: "14px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  // 3-Image Gallery Styles
  galleryWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
  },
  mainImageContainer: {
    position: "relative",
    width: "100%",
    maxHeight: "600px",
    minHeight: "360px",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#0c0e0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainImage: {
    width: "100%",
    height: "auto",
    maxHeight: "600px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  galleryBadge: {
    position: "absolute",
    bottom: "16px",
    right: "16px",
    background: "rgba(10, 14, 12, 0.85)",
    backdropFilter: "blur(6px)",
    color: "#caff46",
    border: "1px solid rgba(202, 255, 70, 0.3)",
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  thumbnailRow: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "4px",
  },
  thumbBtn: {
    background: "#141815",
    border: "2px solid #28342a",
    borderRadius: "8px",
    padding: "4px",
    cursor: "pointer",
    width: "120px",
    height: "76px",
    overflow: "hidden",
    flexShrink: 0,
    transition: "all 0.2s ease",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "4px",
  },
};
