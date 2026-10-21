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

          {project.subhead && (
            <p style={styles.subhead}>{project.subhead}</p>
          )}

          {project.description && (
            <p style={styles.fullDescription}>{project.description}</p>
          )}

          {project.outcome && (
            <div style={styles.outcomeHighlight}>
              <strong style={{ color: "#caff46" }}>Outcome:</strong> {project.outcome}
            </div>
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

          {/* PROJECT INFO GRID */}
          <div style={styles.metaGrid}>
            {project.client ? (
              <div style={styles.metaCard}>
                <div style={styles.metaLabel}>CLIENT / SCOPE</div>
                <div style={styles.metaValue}>{project.client}</div>
              </div>
            ) : null}

            {project.role ? (
              <div style={styles.metaCard}>
                <div style={styles.metaLabel}>ROLE</div>
                <div style={styles.metaValue}>{project.role}</div>
              </div>
            ) : null}

            {project.timeline ? (
              <div style={styles.metaCard}>
                <div style={styles.metaLabel}>TIMELINE</div>
                <div style={styles.metaValue}>{project.timeline}</div>
              </div>
            ) : null}

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

        {/* DIRECT ACTION BAR IMMEDIATELY BELOW THE SCREENSHOT / PREVIEW */}
        {(project.demoUrl || project.githubUrl) && (
          <div style={styles.imageActionStrip}>
            <div style={styles.imageActionInfo}>
              <span style={styles.imageActionLabel}>LIVE SYSTEM &amp; CODEBASE</span>
              <span style={styles.imageActionTitle}>
                Test the deployed product or inspect technical implementation in GitHub.
              </span>
            </div>

            <div style={styles.imageActionBtns}>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.livePrimaryBtn}
                >
                  <span style={styles.pulseDot} />
                  <span>Open Live Website ↗</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.githubSecondaryBtn}
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
                  <span>View GitHub Repository ↗</span>
                </a>
              )}
            </div>
          </div>
        )}

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

        {/* DELIVERABLES & TECH STACK */}
        <section style={styles.sectionGrid}>
          {project.deliverables && project.deliverables.length > 0 && (
            <div>
              <div style={styles.label}>03 / DELIVERABLES</div>
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
            <div style={styles.label}>04 / TECHNOLOGY STACK</div>
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

            {/* Direct Links in Tech Box */}
            {(project.demoUrl || project.githubUrl) && (
              <div style={{ marginTop: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.liveButton}
                  >
                    <span>Visit Live Site ↗</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.githubButton}
                  >
                    <span>View GitHub ↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 10 CORE PRODUCTION SAAS CAPABILITIES */}
        <div style={styles.divider} />
        <section style={styles.saasCapabilitiesSection}>
          <div style={styles.label}>05 / PRODUCTION ARCHITECTURE STANDARD</div>
          <h2 style={styles.sectionHeading}>10 Core Engineering Checkpoints Built Into This System</h2>
          <p style={styles.bodyText}>
            Every production build adheres to a complete enterprise specification guaranteeing security, observability, monetization, and fault tolerance:
          </p>

          <div style={styles.saasGrid}>
            {[
              { name: "Authentication", desc: "Secure token sessions, passwordless magic links & multi-tenant auth (Supabase / NextAuth)" },
              { name: "Operations Dashboard", desc: "Interactive command console with live system telemetry, metrics & filters" },
              { name: "Admin Panel", desc: "Full administrative controls, content management & diagnostic drawers" },
              { name: "Dark Mode UI", desc: "Handcrafted cyber-dark aesthetics with glassmorphic cards & high contrast" },
              { name: "100% Responsive", desc: "Fluid layouts optimized from 320px mobile displays to 4K ultrawide monitors" },
              { name: "Stripe Billing", desc: "Recurring subscription checkout, tiered pricing & self-serve customer portal" },
              { name: "AI Integration", desc: "OpenAI GPT-4o / Realtime API / RAG vector embeddings & autonomous agents" },
              { name: "Database Architecture", desc: "PostgreSQL relational schemas with Prisma ORM, migrations & strict RLS" },
              { name: "Role Based Access (RBAC)", desc: "Granular permissions separating Admins, Team Members, and Read-Only clients" },
              { name: "Cloud Edge Deployment", desc: "High-availability deployment on Vercel Edge with zero silent failover drops" },
            ].map((item) => (
              <div key={item.name} style={styles.saasCard}>
                <div style={styles.saasCardHeader}>
                  <span style={styles.saasCheck}>✅</span>
                  <span style={styles.saasCardTitle}>{item.name}</span>
                </div>
                <p style={styles.saasCardDesc}>{item.desc}</p>
              </div>
            ))}
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
  fullDescription: {
    margin: "18px 0 0",
    fontSize: "15px",
    color: "#a4b0a6",
    lineHeight: "1.75",
    maxWidth: "820px",
  },
  outcomeHighlight: {
    margin: "18px 0 0",
    padding: "12px 18px",
    background: "rgba(202, 255, 70, 0.05)",
    borderLeft: "3px solid #caff46",
    borderRadius: "0 8px 8px 0",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#e2e8e3",
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
    background: "#caff46",
    color: "#0c0e0d",
    padding: "11px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    textDecoration: "none",
    letterSpacing: "0.2px",
    boxShadow: "0 4px 20px rgba(202, 255, 70, 0.2)",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  liveDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#0c0e0d",
  },
  githubButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#161b17",
    color: "#ffffff",
    border: "1px solid #323d34",
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
    marginBottom: "16px",
  },
  imageActionStrip: {
    background: "#121512",
    border: "1px solid #283329",
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
    color: "#caff46",
    letterSpacing: "1px",
  },
  imageActionTitle: {
    fontSize: "13px",
    color: "#b0b8b1",
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
    background: "#caff46",
    color: "#0c0e0d",
    padding: "12px 22px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
    letterSpacing: "0.2px",
    boxShadow: "0 0 20px rgba(202, 255, 70, 0.25)",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  pulseDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#0c0e0d",
  },
  githubSecondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#161b17",
    color: "#ffffff",
    border: "1px solid #334035",
    padding: "11px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    transition: "border-color 0.2s ease, background 0.2s ease",
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
    background: "#131814",
    border: "1px solid #242f26",
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
    color: "#ffffff",
  },
  saasCardDesc: {
    fontSize: "12px",
    color: "#a4aca6",
    lineHeight: "1.5",
    margin: 0,
  },
};
