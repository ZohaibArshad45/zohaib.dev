"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { SiteSettings } from "@/lib/settings";

const capabilities = [
  {
    number: "01",
    title: "AI SaaS & web apps",
    description: "Production-ready products with thoughtful interfaces and reliable foundations.",
  },
  {
    number: "02",
    title: "Autonomous AI agents",
    description: "Useful agents, knowledge search, and voice workflows built around real tasks.",
  },
  {
    number: "03",
    title: "Automation & integrations",
    description: "Connect your tools and reduce repetitive work across the business.",
  },
];

const skills = ["Next.js", "TypeScript", "OpenAI", "AI agents", "RAG", "n8n automation"];

export default function Hero({ settings }: { settings?: SiteSettings }) {
  const [width, setWidth] = useState(1440);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const isMobile = width <= 768;
  const isTablet = width <= 1050;
  const roleLine = [
    settings?.founderTitle?.split(/[|•·]/)[0]?.trim() || "AI SaaS Developer",
    "Next.js",
    "TypeScript",
    "OpenAI",
    "AI Agents",
    "n8n",
  ];

  const styles: Record<string, CSSProperties> = {
    section: {
      width: "100%",
      maxWidth: "1280px",
      margin: "0 auto",
      padding: isMobile ? "112px 20px 58px" : isTablet ? "126px 32px 72px" : "132px 48px 82px",
      display: "grid",
      gridTemplateColumns: isTablet ? "1fr" : "1.08fr 0.92fr",
      gap: isTablet ? "40px" : "64px",
      alignItems: "center",
      boxSizing: "border-box",
    },
    copy: { maxWidth: "680px" },
    eyebrow: {
      margin: "0 0 26px",
      color: "#507b16",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: "1.7",
      fontWeight: "700",
      letterSpacing: "0.035em",
    },
    title: {
      margin: 0,
      color: "#20251f",
      fontSize: isMobile ? "clamp(43px, 11vw, 58px)" : isTablet ? "64px" : "clamp(64px, 5.2vw, 74px)",
      fontWeight: "550",
      lineHeight: "1.01",
      letterSpacing: isMobile ? "-2.4px" : "-4px",
    },
    accent: { display: "block", color: "#527d13" },
    description: {
      maxWidth: "570px",
      margin: isMobile ? "20px 0 0" : "26px 0 0",
      color: "#59625b",
      fontSize: isMobile ? "16px" : "17px",
      lineHeight: "1.72",
    },
    buttons: {
      display: "flex",
      alignItems: "center",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "14px" : "22px",
      marginTop: "32px",
    },
    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      minHeight: "54px",
      padding: "0 23px",
      color: "#18200e",
      background: "#c8f16a",
      border: "1px solid #b7e453",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "700",
      textDecoration: "none",
      alignSelf: isMobile ? "stretch" : "auto",
      transition: "transform 0.2s ease, background 0.2s ease",
    },
    secondaryButton: {
      color: "#30362e",
      fontSize: "14px",
      fontWeight: "600",
      textDecoration: "none",
      padding: "10px 0",
      borderBottom: "1px solid #b8c4ae",
    },
    skills: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px 24px",
      marginTop: "30px",
      color: "#59625b",
      fontSize: "12px",
      lineHeight: "1.5",
    },
    card: {
      width: "100%",
      maxWidth: isTablet ? "640px" : "500px",
      justifySelf: isTablet ? "start" : "end",
      padding: isMobile ? "26px 22px 20px" : "30px 32px 24px",
      border: "1px solid #e1e6da",
      borderRadius: "20px",
      background: "#ffffff",
      boxShadow: "0 22px 60px rgba(31, 42, 27, 0.08)",
      boxSizing: "border-box",
    },
    cardEyebrow: {
      margin: "0 0 20px",
      color: "#507b16",
      fontSize: "11px",
      fontWeight: "750",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    capability: {
      display: "grid",
      gridTemplateColumns: "34px 1fr",
      columnGap: "14px",
      padding: "19px 0",
      borderBottom: "1px solid #e6e9e1",
    },
    capabilityNumber: {
      paddingTop: "3px",
      color: "#668c2f",
      fontSize: "11px",
      fontWeight: "750",
    },
    capabilityTitle: {
      margin: 0,
      color: "#222820",
      fontSize: isMobile ? "17px" : "18px",
      lineHeight: "1.3",
      fontWeight: "650",
    },
    capabilityDescription: {
      margin: "8px 0 0",
      color: "#667064",
      fontSize: "13px",
      lineHeight: "1.55",
    },
    profile: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      paddingTop: "22px",
    },
    monogram: {
      width: "50px",
      height: "50px",
      flexShrink: 0,
      display: "grid",
      placeItems: "center",
      borderRadius: "13px",
      background: "#c8f16a",
      color: "#20251f",
      fontSize: "23px",
      fontWeight: "800",
      letterSpacing: "-0.06em",
    },
    profileName: { margin: 0, color: "#222820", fontSize: "15px", fontWeight: "700" },
    profileMeta: { margin: "4px 0 0", color: "#667064", fontSize: "11px", lineHeight: "1.5" },
  };

  return (
    <section style={styles.section}>
      <div style={styles.copy}>
        <p style={styles.eyebrow}>{roleLine.join("  |  ")}</p>
        <h1 style={styles.title}>
          AI SaaS &
          <span style={styles.accent}>autonomous agents.</span>
        </h1>
        <p style={styles.description}>
          {settings?.bioSnippet ||
            "I build dependable web products, AI systems, and automations that make complex work feel simple."}
        </p>
        <div style={styles.buttons}>
          <Link href="/contact" style={styles.primaryButton}>
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/projects" style={styles.secondaryButton}>
            Explore AI projects ↓
          </Link>
        </div>
        <div style={styles.skills} aria-label="Specialties">
          {skills.map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </div>

      <aside style={styles.card} aria-label="Services">
        <p style={styles.cardEyebrow}>What I can build for you</p>
        {capabilities.map((item) => (
          <div key={item.number} style={styles.capability}>
            <span style={styles.capabilityNumber}>{item.number}</span>
            <div>
              <h2 style={styles.capabilityTitle}>{item.title}</h2>
              <p style={styles.capabilityDescription}>{item.description}</p>
            </div>
          </div>
        ))}
        <div style={styles.profile}>
          <div style={styles.monogram} aria-hidden="true">Z.</div>
          <div>
            <p style={styles.profileName}>Zohaib</p>
            <p style={styles.profileMeta}>AI SaaS Developer · Pakistan / Remote</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
