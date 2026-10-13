"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Service } from "@/lib/services";

type Props = {
  initialServices: Service[];
};

export default function ServicesClient({ initialServices }: Props) {
  const [services] = useState<Service[]>(initialServices);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [hoveredCta, setHoveredCta] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = services.filter((s) => {
    if (selectedCategory === "All") return true;
    return s.category === selectedCategory;
  });

  const getServiceCardStyle = (key: string): CSSProperties => {
    const isHovered = hoveredService === key;
    return {
      ...styles.serviceCard,
      borderColor: isHovered ? "#caff46" : "#242c25",
      transform: isHovered ? "translateY(-6px)" : "translateY(0)",
      boxShadow: isHovered
        ? "0 22px 48px rgba(0, 0, 0, 0.5), 0 0 25px rgba(202, 255, 70, 0.14)"
        : "0 4px 14px rgba(0, 0, 0, 0.2)",
      transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
    };
  };

  const getCtaStyle = (key: string): CSSProperties => {
    const isHovered = hoveredCta === key;
    return {
      ...styles.ctaButton,
      background: isHovered ? "#d4ff66" : "#caff46",
      transform: isHovered ? "scale(1.02)" : "scale(1)",
      boxShadow: isHovered ? "0 0 16px rgba(202, 255, 70, 0.3)" : "none",
      transition: "all 0.2s ease",
    };
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
          <span style={styles.crumbCurrent}>Services</span>
        </div>

        {/* HERO HEADER */}
        <header style={styles.header}>
          <div style={styles.eyebrowBadge}>ENGINEERING CAPABILITIES &amp; SPECIALTIES</div>
          <h1 style={styles.title}>
            Software engineered for real business speed and measurable impact.
          </h1>
          <p style={styles.subhead}>
            From high-converting full-stack web applications to autonomous AI agent workflows and custom business integrations. Every engagement is delivered with clean architecture, modern typography, and rapid turnaround.
          </p>

          {/* CATEGORY FILTER CHIPS */}
          <div style={styles.filterRow}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.filterChip,
                  background: selectedCategory === cat ? "#caff46" : "#141815",
                  color: selectedCategory === cat ? "#0c0e0d" : "#c5cdc5",
                  borderColor: selectedCategory === cat ? "#caff46" : "#283329",
                  fontWeight: selectedCategory === cat ? "700" : "500",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* SERVICES GRID */}
        <section style={styles.servicesGrid}>
          {filteredServices.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
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
                No services published yet in the database.
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
                + Add Services in Admin ↗
              </Link>
            </div>
          ) : (
            filteredServices.map((service) => {
              const cardKey = service.id || service.slug || service.title;
              return (
                <div
                  key={cardKey}
                  style={getServiceCardStyle(cardKey)}
                  onMouseEnter={() => setHoveredService(cardKey)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div style={styles.cardTopRow}>
                    <span style={styles.serviceNum}>{service.number}</span>
                    <span style={styles.categoryPill}>{service.category}</span>
                  </div>

                  <h2 style={styles.serviceTitle}>{service.title}</h2>
                  <p style={styles.serviceDesc}>{service.description}</p>

                  {/* DELIVERABLES / CAPABILITIES CHECKLIST */}
                  <div style={styles.checklistSection}>
                    <div style={styles.checklistHeader}>WHAT IS DELIVERED:</div>
                    <ul style={styles.checklist}>
                      {service.items.map((item) => (
                        <li key={item} style={styles.checkItem}>
                          <span style={styles.checkIcon}>✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TARGET AUDIENCE / BEST FOR */}
                  {service.bestFor && (
                    <div style={styles.bestForBox}>
                      <span style={styles.bestForLabel}>BEST SUITED FOR:</span>
                      <div style={styles.bestForText}>{service.bestFor}</div>
                    </div>
                  )}

                  {/* TECH STACK */}
                  {service.stack && (
                    <div style={styles.stackBox}>
                      <span style={styles.stackLabel}>TOOLS &amp; STACK:</span>
                      <div style={styles.stackTags}>
                        {service.stack.split(/[,/]/).map((tool) => (
                          <span key={tool.trim()} style={styles.stackTag}>
                            {tool.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FOOTER: TIMELINE & CTA */}
                  <div style={styles.cardFooter}>
                    <div style={styles.metaCol}>
                      {service.timeline && (
                        <div style={styles.metaItem}>
                          <span style={styles.metaDim}>Turnaround:</span>{" "}
                          <span style={styles.metaBold}>{service.timeline}</span>
                        </div>
                      )}
                      {service.startingPrice && (
                        <div style={styles.metaItem}>
                          <span style={styles.metaDim}>Starting:</span>{" "}
                          <span style={styles.metaPrice}>{service.startingPrice}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={service.href || "/contact"}
                      style={getCtaStyle(cardKey)}
                      onMouseEnter={() => setHoveredCta(cardKey)}
                      onMouseLeave={() => setHoveredCta(null)}
                    >
                      {service.cta || "Get in touch ↗"}
                    </Link>
                  </div>
                </div>
              );
            }))}
        </section>

        {/* PROCESS / HOW IT WORKS */}
        <section style={styles.processSection}>
          <div style={styles.eyebrowBadge}>ENGAGEMENT BLUEPRINT</div>
          <h2 style={styles.processTitle}>How we partner from day one to launch</h2>
          <p style={styles.processSub}>
            Transparent sprints, daily asynchronous updates, and zero corporate overhead.
          </p>

          <div style={styles.processStepsGrid}>
            <div style={styles.processStepCard}>
              <div style={styles.stepNum}>01</div>
              <h3 style={styles.stepTitle}>Scope &amp; Architecture</h3>
              <p style={styles.stepText}>
                We align on core outcomes, wireframe critical user flows, and select the optimal technology stack with measurable delivery milestones.
              </p>
            </div>

            <div style={styles.processStepCard}>
              <div style={styles.stepNum}>02</div>
              <h3 style={styles.stepTitle}>Rapid Sprint Execution</h3>
              <p style={styles.stepText}>
                Full-stack engineering with daily GitHub commits, interactive preview URLs on Vercel, and direct communication in Slack or WhatsApp.
              </p>
            </div>

            <div style={styles.processStepCard}>
              <div style={styles.stepNum}>03</div>
              <h3 style={styles.stepTitle}>Launch &amp; Knowledge Handover</h3>
              <p style={styles.stepText}>
                Cloud database migration, performance audits, video walkthrough documentation, and smooth production deployment with ongoing support.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section style={styles.bottomCtaBanner}>
          <div>
            <h2 style={styles.bannerHeading}>Have a project or problem in mind?</h2>
            <p style={styles.bannerSub}>
              Tell me about your product vision, timeline, and current bottlenecks. I usually reply within a few hours.
            </p>
          </div>
          <Link href="/contact" style={styles.bannerBtn}>
            Let&apos;s Build Together ↗
          </Link>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0c0e0d",
    color: "#ffffff",
    paddingTop: "110px",
    paddingBottom: "100px",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    boxSizing: "border-box",
  },
  breadcrumbRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    marginBottom: "28px",
  },
  backLink: {
    color: "#8fa191",
    textDecoration: "none",
    fontWeight: "500",
  },
  crumbDivider: {
    color: "#465248",
  },
  crumbCurrent: {
    color: "#caff46",
    fontWeight: "600",
  },
  header: {
    marginBottom: "56px",
    maxWidth: "960px",
  },
  eyebrowBadge: {
    color: "#caff46",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    marginBottom: "14px",
  },
  title: {
    margin: "0 0 20px 0",
    fontSize: "clamp(32px, 4.5vw, 54px)",
    lineHeight: "1.1",
    fontWeight: "500",
    letterSpacing: "-0.5px",
    color: "#ffffff",
  },
  subhead: {
    margin: 0,
    fontSize: "clamp(15px, 1.8vw, 18px)",
    color: "#a4b0a5",
    lineHeight: "1.6",
    maxWidth: "800px",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "32px",
  },
  filterChip: {
    border: "1px solid #283329",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "24px",
    marginBottom: "80px",
  },
  serviceCard: {
    background: "#121613",
    border: "1px solid #252e26",
    borderRadius: "14px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease, transform 0.3s ease",
  },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceNum: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#caff46",
    fontFamily: "monospace",
  },
  categoryPill: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#9db09f",
    letterSpacing: "1px",
    background: "#18201a",
    padding: "4px 10px",
    borderRadius: "12px",
    border: "1px solid #2e3a2f",
  },
  serviceTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: "1.3",
  },
  serviceDesc: {
    margin: 0,
    fontSize: "14px",
    color: "#99a79a",
    lineHeight: "1.6",
  },
  checklistSection: {
    borderTop: "1px solid #212922",
    paddingTop: "16px",
  },
  checklistHeader: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#caff46",
    letterSpacing: "1px",
    marginBottom: "12px",
  },
  checklist: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  checkItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "13px",
    color: "#d1dbd2",
    lineHeight: "1.4",
  },
  checkIcon: {
    color: "#caff46",
    fontWeight: "800",
    flexShrink: 0,
  },
  bestForBox: {
    background: "#161b17",
    border: "1px solid #273329",
    borderRadius: "8px",
    padding: "12px 14px",
  },
  bestForLabel: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#7e8f81",
    letterSpacing: "0.8px",
    display: "block",
    marginBottom: "4px",
  },
  bestForText: {
    fontSize: "12px",
    color: "#d8e2d9",
    lineHeight: "1.4",
  },
  stackBox: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  stackLabel: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#7e8f81",
    letterSpacing: "0.8px",
  },
  stackTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  stackTag: {
    fontSize: "11px",
    background: "#1a211b",
    color: "#cbd5cc",
    border: "1px solid #2a382c",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid #212922",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  metaCol: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metaItem: {
    fontSize: "11px",
  },
  metaDim: {
    color: "#7e8f81",
  },
  metaBold: {
    color: "#ffffff",
    fontWeight: "600",
  },
  metaPrice: {
    color: "#caff46",
    fontWeight: "700",
  },
  ctaButton: {
    background: "#caff46",
    color: "#0c0e0d",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "700",
    transition: "transform 0.2s ease, filter 0.2s ease",
  },
  processSection: {
    background: "#101412",
    border: "1px solid #232c24",
    borderRadius: "16px",
    padding: "48px 36px",
    marginBottom: "80px",
    boxSizing: "border-box",
  },
  processTitle: {
    margin: "0 0 10px 0",
    fontSize: "clamp(24px, 3vw, 36px)",
    fontWeight: "500",
    color: "#ffffff",
  },
  processSub: {
    margin: "0 0 36px 0",
    fontSize: "15px",
    color: "#919f92",
    maxWidth: "600px",
    lineHeight: "1.5",
  },
  processStepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  processStepCard: {
    background: "#151b16",
    border: "1px solid #273329",
    borderRadius: "10px",
    padding: "24px",
  },
  stepNum: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#caff46",
    fontFamily: "monospace",
    marginBottom: "12px",
  },
  stepTitle: {
    margin: "0 0 8px 0",
    fontSize: "17px",
    fontWeight: "600",
    color: "#ffffff",
  },
  stepText: {
    margin: 0,
    fontSize: "13px",
    color: "#97a698",
    lineHeight: "1.6",
  },
  bottomCtaBanner: {
    background: "linear-gradient(135deg, #151d16 0%, #101511 100%)",
    border: "1px solid #caff46",
    borderRadius: "16px",
    padding: "44px 36px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    boxShadow: "0 10px 40px rgba(202, 255, 70, 0.08)",
  },
  bannerHeading: {
    margin: "0 0 8px 0",
    fontSize: "26px",
    fontWeight: "600",
    color: "#ffffff",
  },
  bannerSub: {
    margin: 0,
    fontSize: "14px",
    color: "#a4b2a5",
    maxWidth: "600px",
    lineHeight: "1.5",
  },
  bannerBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
};
