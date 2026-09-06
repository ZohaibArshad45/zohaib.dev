"use client";

import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";

export default function Hero() {
  const [width, setWidth] = useState(1200);

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
        ? "125px 20px 60px"
        : isTablet
        ? "150px 32px 70px"
        : "160px 48px 90px",
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: isTablet ? "1fr" : "1.15fr 0.85fr",
      gap: isTablet ? "60px" : "80px",
      alignItems: "center",
      
    },

    left: {
      maxWidth: "620px",
    },

    eyebrow: {
      color: "#caff46",
      fontSize: isMobile ? "10px" : "11px",
      letterSpacing: "2px",
      fontWeight: "700",
      marginBottom: isMobile ? "28px" : "32px",
      lineHeight: "1.6",
    },

    title: {
      margin: 0,
      fontSize: isMobile ? "48px" : isTablet ? "64px" : "76px",
      lineHeight: "0.99",
      fontWeight: "400",
      letterSpacing: isMobile ? "-2px" : "-4px",
    },

    titleAccent: {
      color: "#caff46",
      display: "block",
      marginTop: "8px",
    },

    description: {
      marginTop: isMobile ? "26px" : "32px",
      color: "#c3c7c4",
      fontSize: isMobile ? "16px" : "17px",
      lineHeight: "1.7",
      maxWidth: "540px",
    },

    buttons: {
      marginTop: "30px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: "20px",
    },

    primaryButton: {
      background: "#caff46",
      color: "#111",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "700",
      padding: "18px 24px",
      borderRadius: "4px",
      textAlign: "center",
    },

    secondaryButton: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "14px",
      paddingBottom: "7px",
      borderBottom: "1px solid #747767",
      width: "fit-content",
      alignSelf: isMobile ? "center" : "auto",
    },

    tags: {
      marginTop: "28px",
      display: "flex",
      flexWrap: "wrap",
      gap: isMobile ? "16px" : "22px",
      color: "#c5c9c6",
      fontSize: "12px",
    },

    cardWrap: {
      display: "flex",
      justifyContent: isTablet ? "flex-start" : "flex-end",
    },

    card: {
      width: "100%",
      maxWidth: "420px",
      background: "linear-gradient(145deg, #182215 0%, #10150e 100%)",
      border: "1px solid #35452b",
      borderRadius: "16px",
      padding: isMobile ? "28px 22px" : "32px",
      transform: isMobile || isTablet ? "none" : "rotate(2deg)",
      boxSizing: "border-box",
    },

    cardLabel: {
      color: "#caff9a",
      fontSize: "11px",
      letterSpacing: "2px",
      fontWeight: "700",
      marginBottom: "26px",
    },

    cardRow: {
      display: "grid",
      gridTemplateColumns: "34px 1fr",
      gap: "10px",
      padding: "22px 0",
      borderBottom: "1px solid #34402e",
    },

    number: {
      color: "#a8da67",
      fontSize: "11px",
      paddingTop: "3px",
    },

    rowTitle: {
      fontSize: isMobile ? "17px" : "18px",
      margin: 0,
      fontWeight: "500",
    },

    rowText: {
      color: "#aac48e",
      fontSize: "13px",
      marginTop: "8px",
    },

    profile: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      marginTop: "26px",
    },

    avatar: {
      width: "52px",
      height: "52px",
      borderRadius: "11px",
      background: "#caff46",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#111",
      fontSize: "28px",
      fontWeight: "800",
    },

    profileName: {
      fontSize: "15px",
      fontWeight: "700",
      marginBottom: "5px",
    },

    profileRole: {
      color: "#abc58d",
      fontSize: "11px",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.left}>
        <div style={styles.eyebrow}>
          INDEPENDENT DEVELOPER • PAKISTAN / REMOTE
        </div>

        <h1 style={styles.title}>
          Your next idea.
          <span style={styles.titleAccent}>Built to work.</span>
        </h1>

        <p style={styles.description}>
          I help founders and teams turn ideas into web apps, add useful AI
          features and automate the work that slows them down.
        </p>

        <div style={styles.buttons}>
          <Link href="/contact" style={styles.primaryButton}>
            Discuss your project ↗
          </Link>

          <Link href="/work" style={styles.secondaryButton}>
            Explore selected work ↓
          </Link>
        </div>

        <div style={styles.tags}>
          <span>Web applications</span>
          <span>AI integrations</span>
          <span>Automation</span>
        </div>
      </div>

      <div style={styles.cardWrap}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>
            YOUR PRODUCT, CONNECTED
          </div>

          <div style={styles.cardRow}>
            <div style={styles.number}>01</div>
            <div>
              <h3 style={styles.rowTitle}>The experience</h3>
              <div style={styles.rowText}>Clear interfaces</div>
            </div>
          </div>

          <div style={styles.cardRow}>
            <div style={styles.number}>02</div>
            <div>
              <h3 style={styles.rowTitle}>The intelligence</h3>
              <div style={styles.rowText}>Useful AI features</div>
            </div>
          </div>

          <div style={styles.cardRow}>
            <div style={styles.number}>03</div>
            <div>
              <h3 style={styles.rowTitle}>The workflow</h3>
              <div style={styles.rowText}>Tools working together</div>
            </div>
          </div>

          <div style={styles.profile}>
            <div style={styles.avatar}>Z.</div>

            <div>
              <div style={styles.profileName}>Zohaib</div>
              <div style={styles.profileRole}>
                Web Developer & AI Builder
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}