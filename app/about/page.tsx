"use client";

import ContactSection from "@/components/MainPage/ContactSection";
import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

export default function AboutPage() {
  const [width, setWidth] = useState(1440);

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
  const isTablet = width > 700 && width <= 1024;

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#0c0e0d",
      color: "#ffffff",
    },

    container: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
      padding: isMobile
        ? "120px 20px 80px"
        : isTablet
        ? "140px 32px 90px"
        : "150px 48px 100px",
      boxSizing: "border-box",
    },

    label: {
      color: "#caff46",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: "24px",
    },

    hero: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "1fr"
        : "1.15fr 0.85fr",
      gap: isMobile ? "36px" : "70px",
      alignItems: "end",
    },

    heading: {
      margin: 0,
      fontSize: isMobile
        ? "42px"
        : isTablet
        ? "52px"
        : "60px",
      lineHeight: "1.03",
      fontWeight: "400",
      letterSpacing: isMobile ? "0" : "0",
      maxWidth: "680px",
    },

    accent: {
      color: "#caff46",
      display: "block",
      marginTop: "6px",
    },

    intro: {
      margin: 0,
      color: "#b9bfba",
      fontSize: isMobile ? "15px" : "17px",
      lineHeight: "1.7",
      maxWidth: "430px",
    },

    divider: {
      width: "100%",
      height: "1px",
      background: "#303530",
      margin: isMobile
        ? "60px 0"
        : "80px 0",
    },

    sectionGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "1fr"
        : "0.75fr 1.25fr",
      gap: isMobile ? "28px" : "70px",
      alignItems: "start",
    },

    sectionTitle: {
      margin: 0,
      fontSize: isMobile ? "28px" : "34px",
      fontWeight: "400",
      lineHeight: "1.2",
    },

    body: {
      color: "#c1c7c2",
      fontSize: isMobile ? "14px" : "16px",
      lineHeight: "1.8",
    },

    bodyStrong: {
      color: "#ffffff",
      fontWeight: "500",
    },

    infoGrid: {
      marginTop: "28px",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "1fr 1fr",
      gap: "16px",
    },

    infoCard: {
      borderTop: "1px solid #303530",
      paddingTop: "18px",
    },

    infoLabel: {
      color: "#8d958e",
      fontSize: "10px",
      letterSpacing: "1px",
      marginBottom: "7px",
    },

    infoValue: {
      color: "#ffffff",
      fontSize: "14px",
      lineHeight: "1.6",
    },

    tools: {
      marginTop: "24px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    },

    tool: {
      padding: "8px 11px",
      border: "1px solid #3a403a",
      borderRadius: "20px",
      fontSize: "12px",
      color: "#ffffff",
    },

    codingskillup: {
      padding: isMobile
        ? "28px 22px"
        : "34px",
      border: "1px solid #35452b",
      borderRadius: "12px",
      background:
        "linear-gradient(145deg, #182215 0%, #10150e 100%)",
    },

    codingTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "24px" : "28px",
      fontWeight: "400",
    },

    codingText: {
      margin: "14px 0 0",
      color: "#b6c1af",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
    },

    codingTag: {
      marginTop: "18px",
      color: "#caff46",
      fontSize: "12px",
      fontWeight: "600",
    },

    cta: {
      marginTop: isMobile
        ? "70px"
        : "90px",
      paddingTop: isMobile
        ? "36px"
        : "48px",
      borderTop: "1px solid #303530",
      display: "flex",
      flexDirection: isMobile
        ? "column"
        : "row",
      justifyContent: "space-between",
      alignItems: isMobile
        ? "flex-start"
        : "center",
      gap: "24px",
    },

    ctaTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "28px" : "36px",
      fontWeight: "400",
      lineHeight: "1.2",
    },

    ctaText: {
      margin: "10px 0 0",
      color: "#aeb5af",
      fontSize: "14px",
      lineHeight: "1.7",
    },

    ctaLink: {
      color: "#caff46",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: "600",
      paddingBottom: "7px",
      borderBottom: "1px solid #caff46",
      whiteSpace: "nowrap",
    },
  };

  const tools = [
    "Next.js",
    "React",
    "TypeScript",
    "Supabase",
    "OpenAI",
    "n8n",
    "HubSpot",
    "Smartlead",
  ];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.label}>
          ABOUT / ZOHAIB
        </div>

        <section style={styles.hero}>
          <h1 style={styles.heading}>
            I build useful digital products.
            <span style={styles.accent}>
              And the systems behind them.
            </span>
          </h1>

          <p style={styles.intro}>
            I&apos;m Zohaib, a web developer and AI builder based in
            Bahawalpur, Punjab, Pakistan. I work remotely with clients and
            teams on web applications, AI features, automation and connected
            workflows.
          </p>
        </section>

        <div style={styles.divider} />

        <section style={styles.sectionGrid}>
          <div>
            <div style={styles.label}>
              01 / WHAT I DO
            </div>

            <h2 style={styles.sectionTitle}>
              One developer.
              <br />
              The whole picture.
            </h2>
          </div>

          <div>
            <p style={styles.body}>
              I like working across the full product flow, from the interface
              people use to the data, APIs and automation running behind it.
              That means I can think about the product as one connected system
              instead of separate pieces.
            </p>

            <p style={styles.body}>
              My work includes{" "}
              <span style={styles.bodyStrong}>
                web apps, AI agents, integrations, automation and operational
                workflows
              </span>
              . I focus on practical solutions that save time, reduce manual
              work and make products easier to use.
            </p>

            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>
                  ROLE
                </div>

                <div style={styles.infoValue}>
                  Web Developer &amp; AI Builder
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>
                  LOCATION
                </div>

                <div style={styles.infoValue}>
                  Bahawalpur, Punjab, Pakistan
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>
                  WORKING STYLE
                </div>

                <div style={styles.infoValue}>
                  Remote and direct communication
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>
                  ALSO
                </div>

                <div style={styles.infoValue}>
                  Founder of Codingskillup
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={styles.divider} />

        <section style={styles.sectionGrid}>
          <div>
            <div style={styles.label}>
              02 / HOW I WORK
            </div>

            <h2 style={styles.sectionTitle}>
              Clear scope.
              <br />
              Visible progress.
            </h2>
          </div>

          <div>
            <p style={styles.body}>
              I prefer simple communication and clear decisions. We define the
              problem, agree on the scope, then build in visible steps so you
              can review progress and give feedback while there is still room
              to adjust.
            </p>

            <p style={styles.body}>
              You work directly with me from the first conversation through
              delivery. There is no handoff between sales, project management
              and development.
            </p>
          </div>
        </section>

        <div style={styles.divider} />

        <section style={styles.sectionGrid}>
          <div>
            <div style={styles.label}>
              03 / TOOLS
            </div>

            <h2 style={styles.sectionTitle}>
              Tools I work with.
            </h2>
          </div>

          <div>
            <p style={styles.body}>
              I choose tools based on the problem, but these are some of the
              technologies and platforms I regularly work with.
            </p>

            <div style={styles.tools}>
              {tools.map((tool) => (
                <span key={tool} style={styles.tool}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div style={styles.divider} />

        <section style={styles.sectionGrid}>
          <div>
            <div style={styles.label}>
              04 / CODINGSKILLUP
            </div>

            <h2 style={styles.sectionTitle}>
              Learn.
              <br />
              Build.
              <br />
              Repeat.
            </h2>
          </div>

          <div style={styles.codingskillup}>
            <h3 style={styles.codingTitle}>
              Founder of Codingskillup
            </h3>

            <p style={styles.codingText}>
              Codingskillup is where I share programming, web development, AI
              and automation content. It&apos;s also a place for documenting
              what I learn while building.
            </p>

            <div style={styles.codingTag}>
              Learn. Build. Repeat.
            </div>
          </div>
        </section>

        <div style={styles.cta}>
          <div>
            <h2 style={styles.ctaTitle}>
              Have something in mind?
            </h2>

            <p style={styles.ctaText}>
              Tell me what you&apos;re trying to build or improve.
            </p>
          </div>

          <Link href="/contact" style={styles.ctaLink}>
            Let&apos;s work together ↗
          </Link>
        </div>
      </div>
      <ContactSection/>
    </main>
  );
}