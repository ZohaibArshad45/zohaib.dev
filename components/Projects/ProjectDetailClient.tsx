"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import SiteFooter from "@/components/MainPage/SiteFooter";
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
    <main id="top" style={styles.page}>
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

          {project.subhead && (
            <p style={styles.subhead}>{project.subhead}</p>
          )}

          {/* EXTERNAL ACTION LINKS (LIVE DEMO & GITHUB) */}
          {(project.demoUrl || project.githubUrl) && (
            <div style={styles.actionButtonsRow}>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.liveButton}
                >
                  <span style={styles.liveDot} />
                  <span>Live Preview / Website ↗</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.githubButton}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>View Source Code ↗</span>
                </a>
              )}
            </div>
          )}

        </header>

        {/* PREVIEW CONTAINER / 3-IMAGE GALLERY */}
        <section style={styles.previewSection}>
          {hasImages ? (
            <div style={styles.galleryWrapper}>
              <div style={styles.mainImageContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={validImages[selectedImgIdx] || validImages[0]}
                  alt={project.title}
                  width={1600}
                  height={900}
                  unoptimized
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
                          selectedImgIdx === idx ? "#dfe6fb" : "#28342a",
                        transform:
                          selectedImgIdx === idx ? "scale(1.02)" : "scale(1)",
                        boxShadow:
                          selectedImgIdx === idx
                            ? "0 0 12px rgba(49, 91, 199, 0.12)"
                            : "none",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <Image
                        src={img}
                        alt={`Screenshot ${idx + 1}`}
                        width={240}
                        height={152}
                        unoptimized
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

        {(project.description || project.outcome) && (
          <section style={styles.summaryStrip}>
            {project.description && <p style={styles.summaryText}>{project.description}</p>}
            {project.outcome && <p style={styles.summaryOutcome}><strong>Result</strong> {project.outcome}</p>}
          </section>
        )}

        <details className="case-study-details">
          <summary>Explore the project details</summary>
          <div className="case-study-details-content">
        {/* CORE CONTENT: PROBLEM & SOLUTION */}
        {(Boolean(project.problem) || Boolean(project.solution)) && (
          <section style={styles.sectionGrid}>
            {project.problem && (
              <div style={styles.sectionCol}>
                <div style={styles.label}>THE CHALLENGE</div>
                <h2 style={styles.sectionHeading}>The Problem</h2>
                <p style={styles.bodyText}>{project.problem}</p>
              </div>
            )}

            {project.solution && (
              <div style={styles.sectionCol}>
                <div style={styles.label}>THE APPROACH</div>
                <h2 style={styles.sectionHeading}>The Solution</h2>
                <p style={styles.bodyText}>{project.solution}</p>
              </div>
            )}
          </section>
        )}

        {(Boolean(project.problem) || Boolean(project.solution)) && (
          <div style={styles.divider} />
        )}

        {/* DELIVERABLES & TECH STACK */}
        <section style={styles.sectionGrid}>
          {project.deliverables && project.deliverables.length > 0 && (
            <div>
              <div style={styles.label}>DELIVERABLES</div>
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
            <div style={styles.label}>TECHNOLOGY</div>
            <h2 style={styles.sectionHeading}>Tools &amp; Frameworks</h2>
            <p style={styles.bodyText}>
              Selected strictly for reliability, developer ergonomics, and
              operational performance:
            </p>
            <div style={styles.tagsContainer}>
              {(project.tags || []).map((tag) => (
                <span key={tag} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </section>
          </div>
        </details>

        {nextProject?.slug ? (
          <Link href={`/projects/${nextProject.slug}`} style={styles.nextProjectBanner}>
            <div>
              <div style={styles.nextLabel}>Next project</div>
              <h3 style={styles.nextTitle}>{nextProject.title}</h3>
              {nextProject.headline ? (
                <p style={styles.nextSub}>{nextProject.headline}</p>
              ) : null}
            </div>
            <span style={styles.nextButton}>Open project</span>
          </Link>
        ) : null}
        <div style={styles.projectContactCta}>
          <div>
            <div style={styles.nextLabel}>HAVE A PROJECT IN MIND?</div>
            <h2 style={styles.nextTitle}>Let&apos;s talk about it.</h2>
          </div>
          <Link href="/contact" style={styles.nextButton}>Get in touch ↗</Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
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
    color: "#315bc7",
    textDecoration: "none",
    fontWeight: "600",
  },
  crumbDivider: {
    color: "#4a534c",
  },
  crumbCurrent: {
    color: "#727882",
  },
  header: {
    marginBottom: "40px",
  },
  statusEyebrow: {
    color: "#315bc7",
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
    color: "#202329",
    maxWidth: "920px",
  },
  subhead: {
    margin: "18px 0 0",
    fontSize: "17px",
    color: "#48505a",
    lineHeight: "1.6",
    maxWidth: "760px",
  },
  fullDescription: {
    margin: "18px 0 0",
    fontSize: "15px",
    color: "#727882",
    lineHeight: "1.75",
    maxWidth: "820px",
  },
  outcomeHighlight: {
    margin: "18px 0 0",
    padding: "12px 18px",
    background: "#f3f5fb",
    borderLeft: "3px solid #dfe6fb",
    borderRadius: "0 8px 8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#3e4b69",
    maxWidth: "820px",
  },
  actionButtonsRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
    marginTop: "22px",
  },
  liveButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#315bc7",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    textDecoration: "none",
    letterSpacing: "0.2px",
    boxShadow: "0 4px 20px rgba(49, 91, 199, 0.12)",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  liveDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#f7f6f2",
  },
  githubButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#eeece5",
    color: "#202329",
    border: "1px solid #e2dfd5",
    padding: "11px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginTop: "36px",
    borderTop: "1px solid #e2dfd5",
    paddingTop: "24px",
  },
  metaCard: {
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    borderRadius: "8px",
    padding: "16px 18px",
  },
  metaLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#727882",
    letterSpacing: "0.8px",
    marginBottom: "6px",
  },
  metaValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#202329",
  },
  previewSection: {
    background: "#eeece5",
    border: "1px solid var(--line)",
    borderRadius: "16px",
    overflow: "hidden",
    padding: "16px",
    marginBottom: "16px",
  },
  summaryStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px 34px",
    alignItems: "start",
    padding: "22px 4px 30px",
  },
  summaryText: {
    margin: 0,
    maxWidth: "720px",
    color: "var(--text-soft)",
    fontSize: "15px",
    lineHeight: "1.7",
  },
  summaryOutcome: {
    margin: 0,
    maxWidth: "420px",
    color: "var(--text)",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  imageActionStrip: {
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    borderRadius: "10px",
    padding: "18px 24px",
    marginBottom: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
  },
  imageActionInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  imageActionLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#315bc7",
    letterSpacing: "1px",
  },
  imageActionTitle: {
    fontSize: "13px",
    color: "#727882",
  },
  imageActionBtns: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  livePrimaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "#315bc7",
    color: "#ffffff",
    padding: "12px 22px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
    letterSpacing: "0.2px",
    boxShadow: "0 0 20px rgba(49, 91, 199, 0.12)",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  pulseDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#f7f6f2",
  },
  githubSecondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#eeece5",
    color: "#202329",
    border: "1px solid #e2dfd5",
    padding: "11px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
  },
  metricsBanner: {
    background: "#eeece5",
    border: "1px solid #dfe6fb",
    borderRadius: "10px",
    padding: "24px 28px",
    marginBottom: "60px",
    boxShadow: "0 8px 30px rgba(49, 91, 199, 0.06)",
  },
  metricsLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#315bc7",
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
    color: "#202329",
  },
  metricName: {
    fontSize: "12px",
    color: "#727882",
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
    color: "#315bc7",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "12px",
  },
  sectionHeading: {
    margin: "0 0 16px",
    fontSize: "26px",
    fontWeight: "400",
    color: "#202329",
  },
  bodyText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#48505a",
  },
  bodyIntro: {
    margin: "0 0 28px",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#727882",
  },
  divider: {
    width: "100%",
    height: "1px",
    background: "#e2dfd5",
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
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    borderRadius: "8px",
    padding: "20px",
  },
  archNum: {
    color: "#315bc7",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  archText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#48505a",
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
    color: "#48505a",
  },
  checkIcon: {
    color: "#315bc7",
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
    border: "1px solid #e2dfd5",
    background: "#eeece5",
    fontSize: "12px",
    color: "#202329",
  },
  nextProjectBanner: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: "16px",
    padding: "36px 32px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    marginTop: "56px",
    textDecoration: "none",
    color: "inherit",
  },
  projectContactCta: {
    marginTop: "28px",
    padding: "24px 4px 12px",
    borderTop: "1px solid var(--line)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "18px",
  },
  nextLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#315bc7",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  nextTitle: {
    margin: "0 0 6px",
    fontSize: "22px",
    fontWeight: "500",
    color: "#202329",
  },
  nextSub: {
    margin: 0,
    fontSize: "13px",
    color: "#727882",
  },
  nextButton: {
    background: "#315bc7",
    color: "#ffffff",
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
    background: "#f7f6f2",
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
    background: "rgba(32, 40, 32, 0.78)",
    backdropFilter: "blur(6px)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.3)",
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
    background: "#ffffff",
    border: "2px solid #e2dfd5",
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
  saasCapabilitiesSection: {
    marginTop: "20px",
  },
  saasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
    marginTop: "20px",
  },
  saasCard: {
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    borderRadius: "10px",
    padding: "16px 18px",
    transition: "border-color 0.2s ease",
  },
  saasCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
  },
  saasCheck: {
    fontSize: "14px",
  },
  saasCardTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#202329",
  },
  saasCardDesc: {
    fontSize: "12px",
    color: "#727882",
    lineHeight: "1.5",
    margin: 0,
  },
};
