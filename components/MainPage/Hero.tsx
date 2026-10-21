"use client";

import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/settings";

export default function Hero({ settings }: { settings?: SiteSettings }) {
  const [width, setWidth] = useState(1200);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

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

  const isMobile = width <= 768;
  const isTablet = width <= 1050;

  const styles: Record<string, CSSProperties> = {
    section: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: isMobile
        ? "125px 20px 64px"
        : isTablet
        ? "150px 32px 76px"
        : "165px 56px 100px",
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: isTablet ? "1fr" : "1.15fr 0.85fr",
      gap: isTablet ? "60px" : "88px",
      alignItems: "center",
      minHeight: isTablet ? "auto" : "780px",
    },

    left: {
      maxWidth: "650px",
    },

    eyebrow: {
      color: "#caff46",
      fontSize: isMobile ? "12px" : "14px",
      letterSpacing: isMobile ? "0.6px" : "0.8px",
      fontWeight: "600",
      marginBottom: isMobile ? "26px" : "30px",
      lineHeight: "1.5",
    },

    title: {
      margin: 0,
      fontSize: isMobile ? "48px" : isTablet ? "64px" : "78px",
      lineHeight: "0.98",
      fontWeight: "400",
      letterSpacing: isMobile ? "-2px" : "-4px",
      color: "#ffffff",
    },

    titleAccent: {
      color: "#caff46",
      display: "block",
      marginTop: "8px",
    },

    description: {
      marginTop: isMobile ? "26px" : "34px",
      color: "#c3c7c4",
      fontSize: isMobile ? "16px" : "18px",
      lineHeight: "1.7",
      maxWidth: "560px",
    },

    buttons: {
      marginTop: isMobile ? "28px" : "34px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: isMobile ? "16px" : "22px",
    },

    primaryButton: {
      background: "#caff46",
      color: "#111111",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: "700",
      padding: "18px 26px",
      borderRadius: "5px",
      textAlign: "center",
      display: "inline-block",
    },

    secondaryButton: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: "500",
      paddingBottom: "7px",
      borderBottom: "1px solid #747767",
      width: "fit-content",
      alignSelf: isMobile ? "center" : "auto",
    },

    tags: {
      marginTop: "30px",
      display: "flex",
      flexWrap: "wrap",
      gap: isMobile ? "14px 18px" : "16px 24px",
      fontSize: isMobile ? "12px" : "13px",
    },

    tag: {
      color: "#c5c9c6",
      textDecoration: "none",
      whiteSpace: "nowrap",
      cursor: "pointer",
      transition: "color 0.2s ease",
    },

    cardWrap: {
      display: "flex",
      justifyContent: isTablet ? "flex-start" : "flex-end",
    },

    card: {
      width: "100%",
      maxWidth: isTablet ? "520px" : "430px",
      background:
        "linear-gradient(145deg, rgba(27, 39, 22, 0.98) 0%, rgba(15, 20, 14, 0.98) 100%)",
      border: isCardHovered ? "1px solid #caff46" : "1px solid #35452b",
      borderRadius: "18px",
      padding: isMobile ? "28px 22px" : "34px",
      transform: isMobile || isTablet
        ? isCardHovered
          ? "translateY(-6px) scale(1.01)"
          : "none"
        : isCardHovered
        ? "rotate(-0.5deg) translateY(-10px) translateX(-6px) scale(1.02)"
        : "rotate(1.5deg)",
      boxSizing: "border-box",
      boxShadow: isCardHovered
        ? "0 30px 85px rgba(0, 0, 0, 0.5), 0 0 35px rgba(202, 255, 70, 0.16)"
        : "0 24px 70px rgba(0, 0, 0, 0.25)",
      transition:
        "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease",
    },

    cardLabel: {
      color: "#caff9a",
      fontSize: "11px",
      letterSpacing: "1.6px",
      fontWeight: "700",
      marginBottom: "24px",
    },

    cardRow: {
      display: "grid",
      gridTemplateColumns: "38px 1fr",
      gap: "12px",
      padding: "22px 0",
      borderBottom: "1px solid #34402e",
    },

    number: {
      color: "#a8da67",
      fontSize: "11px",
      paddingTop: "4px",
      fontWeight: "700",
    },

    rowTitle: {
      fontSize: isMobile ? "18px" : "20px",
      margin: 0,
      fontWeight: "600",
      color: "#ffffff",
    },

    rowText: {
      color: "#aac48e",
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: "1.5",
      marginTop: "7px",
    },

    profile: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      marginTop: "28px",
      textDecoration: "none",
      color: "inherit",
      cursor: "pointer",
      width: "fit-content",
    },

    avatar: {
      width: "54px",
      height: "54px",
      borderRadius: "12px",
      background: "#caff46",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#111111",
      fontSize: "27px",
      fontWeight: "800",
      flexShrink: 0,
    },

    profileName: {
      fontSize: "16px",
      fontWeight: "700",
      marginBottom: "5px",
      color: "#ffffff",
    },

    profileRole: {
      color: "#abc58d",
      fontSize: "12px",
    },
  };

  const tags = [
    "AI SaaS Development",
    "Autonomous AI Agents",
    "OpenAI & RAG",
    "n8n Automation",
    "CRM Pipelines",
    "Realtime Voice AI",
  ];

  return (
    <section style={styles.section}>
      <div style={styles.left}>
        <div style={styles.eyebrow}>
          {settings?.founderTitle || "AI SaaS Developer • Next.js • TypeScript • OpenAI • AI Agents • n8n"}
        </div>

        <h1 style={styles.title}>
          AI SaaS &amp;
          <span style={styles.titleAccent}>
            autonomous agents.
          </span>
        </h1>

        <p style={styles.description}>
          {settings?.bioSnippet ||
            "Building high-performance AI SaaS products, multi-agent autonomous workflows, enterprise RAG search engines, and resilient business automations."}
        </p>

        <div style={styles.buttons}>
          <Link href="/contact" style={styles.primaryButton}>
            Discuss your AI project ↗
          </Link>

          <Link href="/projects" style={styles.secondaryButton}>
            Explore AI projects ↓
          </Link>

          <Link
            href="/upcoming"
            style={{
              ...styles.secondaryButton,
              color: "#caff46",
              borderColor: "#caff46",
            }}
          >
            Upcoming Roadmap 🚀
          </Link>
        </div>

        <div style={styles.tags}>
          {tags.map((tag) => (
            <Link
              key={tag}
              href="/projects"
              style={{
                ...styles.tag,
                color:
                  hoveredTag === tag
                    ? "#caff46"
                    : "#c5c9c6",
              }}
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.cardWrap}>
        <div
          style={styles.card}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => {
            setIsCardHovered(false);
            setHoveredRow(null);
            setIsProfileHovered(false);
          }}
        >
          <div style={styles.cardLabel}>
            WHAT I CAN BUILD FOR YOU
          </div>

          <div
            style={{
              ...styles.cardRow,
              transform: hoveredRow === 1 ? "translateX(6px)" : "translateX(0)",
              transition: "transform 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredRow(1)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div
              style={{
                ...styles.number,
                color: hoveredRow === 1 ? "#caff46" : styles.number.color,
                transition: "color 0.2s ease",
              }}
            >
              01
            </div>

            <div>
              <h3
                style={{
                  ...styles.rowTitle,
                  color: hoveredRow === 1 ? "#caff46" : "#ffffff",
                  transition: "color 0.2s ease",
                }}
              >
                AI SaaS &amp; Web Apps
              </h3>

              <div style={styles.rowText}>
                Production Next.js platforms with Stripe billing, auth &amp; PostgreSQL.
              </div>
            </div>
          </div>

          <div
            style={{
              ...styles.cardRow,
              transform: hoveredRow === 2 ? "translateX(6px)" : "translateX(0)",
              transition: "transform 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredRow(2)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div
              style={{
                ...styles.number,
                color: hoveredRow === 2 ? "#caff46" : styles.number.color,
                transition: "color 0.2s ease",
              }}
            >
              02
            </div>

            <div>
              <h3
                style={{
                  ...styles.rowTitle,
                  color: hoveredRow === 2 ? "#caff46" : "#ffffff",
                  transition: "color 0.2s ease",
                }}
              >
                Autonomous AI Agents
              </h3>

              <div style={styles.rowText}>
                Multi-agent tool-calling, RAG vector retrieval &amp; realtime voice bots.
              </div>
            </div>
          </div>

          <div
            style={{
              ...styles.cardRow,
              transform: hoveredRow === 3 ? "translateX(6px)" : "translateX(0)",
              transition: "transform 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredRow(3)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div
              style={{
                ...styles.number,
                color: hoveredRow === 3 ? "#caff46" : styles.number.color,
                transition: "color 0.2s ease",
              }}
            >
              03
            </div>

            <div>
              <h3
                style={{
                  ...styles.rowTitle,
                  color: hoveredRow === 3 ? "#caff46" : "#ffffff",
                  transition: "color 0.2s ease",
                }}
              >
                n8n &amp; CRM Automation
              </h3>

              <div style={styles.rowText}>
                Event-driven pipelines, webhook triage &amp; autonomous lead syncing.
              </div>
            </div>
          </div>

          <Link
            href="/contact"
            style={{
              ...styles.profile,
              transform: isProfileHovered ? "translateX(4px)" : "none",
              transition: "transform 0.25s ease",
            }}
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <div
              style={{
                ...styles.avatar,
                boxShadow: isProfileHovered
                  ? "0 0 24px rgba(202, 255, 70, 0.6)"
                  : isCardHovered
                  ? "0 0 14px rgba(202, 255, 70, 0.3)"
                  : "none",
                transform: isProfileHovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              Z.
            </div>

            <div>
              <div
                style={{
                  ...styles.profileName,
                  color: isProfileHovered ? "#caff46" : "#ffffff",
                  transition: "color 0.2s ease",
                }}
              >
                Zohaib
              </div>

              <div style={styles.profileRole}>
                {settings?.founderTitle || "Web Developer & AI Builder"}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
