"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarHero() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const handleResize = () => {
      setWidth(window.innerWidth);

      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    handleScroll();
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = width <= 768;
  const isTablet = width <= 1050;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0c0e0d",
      color: "#f5f5f5",
      fontFamily: "Arial, Helvetica, sans-serif",
    },

    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "rgba(12, 14, 13, 0.96)",
      backdropFilter: "blur(14px)",
    },

    navContainer: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
      padding: isMobile ? "0 20px" : isTablet ? "0 32px" : "0 48px",
      boxSizing: "border-box",
    },

    navInner: {
      height: scrolled ? "66px" : isMobile ? "74px" : "88px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #2b2e2c",
      transition: "height 0.3s ease",
    },

    logo: {
      fontSize: isMobile ? "27px" : scrolled ? "28px" : "31px",
      fontWeight: "800",
      color: "#ffffff",
      textDecoration: "none",
      letterSpacing: "-1px",
      transition: "font-size 0.3s ease",
    },

    dot: {
      color: "#caff46",
    },

    navLinks: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: isTablet ? "28px" : "38px",
    },

    navLink: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "500",
    },

    talk: {
      display: isMobile ? "none" : "inline-block",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "14px",
      paddingBottom: "8px",
      borderBottom: "1px solid #747767",
    },

    hamburger: {
      display: isMobile ? "flex" : "none",
      width: "42px",
      height: "42px",
      padding: 0,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "6px",
      position: "relative",
      zIndex: 1100,
    },

    line1: {
      width: "23px",
      height: "2px",
      background: "#fff",
      transition: "0.3s ease",
      transform: menuOpen
        ? "translateY(4px) rotate(45deg)"
        : "translateY(0) rotate(0)",
    },

    line2: {
      width: "23px",
      height: "2px",
      background: "#fff",
      transition: "0.3s ease",
      transform: menuOpen
        ? "translateY(-4px) rotate(-45deg)"
        : "translateY(0) rotate(0)",
    },

    mobileMenu: {
      position: "fixed",
      inset: 0,
      background: "#0c0e0d",
      zIndex: 999,
      display: menuOpen ? "flex" : "none",
      flexDirection: "column",
      padding: "120px 28px 40px",
    },

    mobileMenuLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },

    mobileLink: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "28px",
      fontWeight: "500",
    },

    mobileTalk: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "25px",
      marginTop: "8px",
      width: "fit-content",
      paddingBottom: "8px",
      borderBottom: "1px solid #7a7d6b",
    },

    mobileBottom: {
      marginTop: "auto",
      fontSize: "12px",
      color: "#9ea39e",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
    },

    hero: {
      maxWidth: "1180px",
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

    heroLeft: {
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
      transform: isMobile ? "none" : isTablet ? "none" : "rotate(2deg)",
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

    toolsSection: {
      borderTop: "1px solid #2b2e2c",
      borderBottom: "1px solid #2b2e2c",
    },

    tools: {
      maxWidth: "1180px",
      margin: "0 auto",
      padding: isMobile ? "26px 20px" : "28px 48px",
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr 1fr"
        : isTablet
        ? "repeat(4, 1fr)"
        : "1.2fr repeat(6, 1fr)",
      gap: isMobile ? "20px" : "26px",
      alignItems: "center",
    },

    toolsLabel: {
      color: "#b7bbb8",
      fontSize: "10px",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      gridColumn: isMobile ? "1 / 3" : "auto",
    },

    tool: {
      fontSize: isMobile ? "15px" : "18px",
      fontWeight: "700",
    },
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navInner}>
            <Link href="/" style={styles.logo}>
              zohaib<span style={styles.dot}>.</span>
            </Link>

            <div style={styles.navLinks}>
              <Link href="/work" style={styles.navLink}>
                Selected work
              </Link>

              <Link href="/services" style={styles.navLink}>
                Services
              </Link>

              <Link href="/approach" style={styles.navLink}>
                Approach
              </Link>
            </div>

            <Link href="/contact" style={styles.talk}>
              Let's talk ↗
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={styles.hamburger}
              aria-label="Toggle menu"
            >
              <span style={styles.line1} />
              <span style={styles.line2} />
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.mobileMenu}>
        <div style={styles.mobileMenuLinks}>
          <Link href="/work" onClick={closeMenu} style={styles.mobileLink}>
            Selected work
          </Link>

          <Link
            href="/services"
            onClick={closeMenu}
            style={styles.mobileLink}
          >
            Services
          </Link>

          <Link
            href="/approach"
            onClick={closeMenu}
            style={styles.mobileLink}
          >
            Approach
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            style={styles.mobileTalk}
          >
            Let's talk ↗
          </Link>
        </div>

        <div style={styles.mobileBottom}>
          Web Developer • AI Builder • Pakistan / Remote
        </div>
      </div>

      <section style={styles.hero}>
        <div style={styles.heroLeft}>
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
            <div style={styles.cardLabel}>YOUR PRODUCT, CONNECTED</div>

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

      <section style={styles.toolsSection}>
        <div style={styles.tools}>
          <div style={styles.toolsLabel}>Tools I work with</div>

          <div style={styles.tool}>Next.js</div>
          <div style={styles.tool}>React</div>
          <div style={styles.tool}>Supabase</div>
          <div style={styles.tool}>OpenAI</div>
          <div style={styles.tool}>n8n</div>
          <div style={styles.tool}>TypeScript</div>
        </div>
      </section>
    </main>
  );
}