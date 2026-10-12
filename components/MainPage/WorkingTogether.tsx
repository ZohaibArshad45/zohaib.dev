"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import type { SiteSettings } from "@/lib/settings";

type Step = {
  number: string;
  label: string;
  title: string;
  description: string;
};

export default function WorkingTogether({ settings }: { settings?: SiteSettings }) {
  const [width, setWidth] = useState<number>(1440);

  const [hoveredStep, setHoveredStep] = useState<
    string | null
  >(null);

  const [hoveredLink, setHoveredLink] = useState<
    string | null
  >(null);

  useEffect(() => {
    const handleResize = (): void => {
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

  const steps: Step[] = [
    {
      number: "01",
      label: "DISCOVER",
      title: "Start with the problem.",
      description:
        "We discuss your users, current tools and the result you need. Then we agree on a focused scope and the best way forward.",
    },
    {
      number: "02",
      label: "BUILD",
      title: "See the work take shape.",
      description:
        "You review working progress, share feedback and make decisions while there is still room to adjust.",
    },
    {
      number: "03",
      label: "DELIVER",
      title: "Launch with clarity.",
      description:
        "We review the finished work together, confirm what is complete and leave you with clear next steps for your product.",
    },
  ];

  const styles: Record<string, CSSProperties> = {
    section: {
      width: "100%",
      background: "#0c0e0d",
      color: "#ffffff",
      padding: isMobile
        ? "75px 20px 80px"
        : isTablet
        ? "95px 32px 95px"
        : "105px 48px 105px",
      boxSizing: "border-box",
    },

    container: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
    },

    topHeader: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "1.5fr 0.5fr",
      gap: isMobile ? "26px" : "55px",
      alignItems: "end",
    },

    label: {
      color: "#caff46",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: isMobile ? "22px" : "26px",
      lineHeight: "1.5",
    },

    heading: {
      margin: 0,
      color: "#f4f5f3",
      fontSize: isMobile
        ? "40px"
        : isTablet
        ? "50px"
        : "58px",
      lineHeight: "1.03",
      fontWeight: "400",
      letterSpacing: isMobile ? "-1px" : "-2px",
    },

    intro: {
      maxWidth: "270px",
      justifySelf: isMobile ? "start" : "end",
      margin: 0,
      color: "#b9bfba",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
    },

    steps: {
      marginTop: isMobile ? "46px" : "56px",
      display: "grid",
      gridTemplateColumns:
        isMobile || isTablet
          ? "1fr"
          : "repeat(3, 1fr)",
      gap: isMobile
        ? "28px"
        : isTablet
        ? "30px"
        : "36px",
    },

    step: {
      borderTop: "1px solid #303530",
      paddingTop: isMobile ? "22px" : "26px",
      transition:
        "border-color 0.25s ease, transform 0.25s ease",
    },

    stepLabel: {
      color: "#caff46",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.8px",
      marginBottom: "22px",
      transition: "color 0.25s ease",
    },

    stepTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "22px" : "24px",
      fontWeight: "400",
      lineHeight: "1.2",
    },

    stepText: {
      margin: "16px 0 0",
      color: "#b9bfba",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
      maxWidth: "350px",
    },

    reassurance: {
      marginTop: isMobile ? "34px" : "42px",
      display: "flex",
      flexWrap: "wrap",
      gap: isMobile ? "12px 18px" : "16px 24px",
      color: "#aeb5af",
      fontSize: isMobile ? "12px" : "13px",
    },

    reassuranceItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    reassuranceDot: {
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      background: "#caff46",
      flexShrink: 0,
    },

    divider: {
      width: "100%",
      height: "1px",
      background: "#303530",
      margin: isMobile
        ? "70px 0"
        : "90px 0 70px",
    },

    about: {
      display: "grid",
      gridTemplateColumns:
        isMobile || isTablet
          ? "1fr"
          : "1fr 1fr",
      gap: isMobile
        ? "42px"
        : isTablet
        ? "52px"
        : "76px",
      alignItems: "start",
    },

    aboutHeading: {
      margin: 0,
      color: "#f4f5f3",
      fontSize: isMobile
        ? "40px"
        : isTablet
        ? "50px"
        : "58px",
      lineHeight: "1.03",
      fontWeight: "400",
      letterSpacing: isMobile ? "-1px" : "-2px",
    },

    signature: {
      marginTop: isMobile ? "30px" : "38px",
    },

    name: {
      color: "#ffffff",
      fontSize: isMobile ? "22px" : "24px",
      fontWeight: "700",
      marginBottom: "8px",
    },

    role: {
      color: "#c9ceca",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: "1.5",
    },

    availability: {
      marginTop: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#b8beb9",
      fontSize: isMobile ? "12px" : "13px",
    },

    availabilityDot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "#caff46",
      flexShrink: 0,
    },

    aboutText: {
      paddingTop: isMobile ? "0" : "4px",
    },

    mainText: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "16px" : "18px",
      lineHeight: "1.65",
      fontWeight: "500",
    },

    secondaryText: {
      margin: "20px 0 0",
      color: "#aeb5af",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
    },

    directText: {
      margin: "20px 0 0",
      color: "#d5d9d5",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
    },

    accent: {
      color: "#caff46",
      textDecoration: "none",
    },

    buttonRow: {
      marginTop: isMobile ? "28px" : "32px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? "18px" : "24px",
    },

    aboutLink: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "500",
      paddingBottom: "7px",
      borderBottom: "1px solid #69705f",
      width: "fit-content",
      transition:
        "color 0.2s ease, border-color 0.2s ease",
    },

    contactLink: {
      color: "#caff46",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "600",
      paddingBottom: "7px",
      borderBottom: "1px solid #caff46",
      width: "fit-content",
    },
  };

  const getStepStyle = (
    stepNumber: string
  ): CSSProperties => ({
    ...styles.step,

    borderTop:
      hoveredStep === stepNumber
        ? "1px solid #caff46"
        : "1px solid #303530",

    transform:
      hoveredStep === stepNumber
        ? "translateY(-3px)"
        : "translateY(0)",
  });

  const getAboutLinkStyle = (): CSSProperties => ({
    ...styles.aboutLink,

    color:
      hoveredLink === "about"
        ? "#caff46"
        : "#ffffff",

    borderBottom:
      hoveredLink === "about"
        ? "1px solid #caff46"
        : "1px solid #69705f",
  });

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.topHeader}>
          <div>
            <div style={styles.label}>
              03 / WORKING TOGETHER
            </div>

            <h2 style={styles.heading}>
              Clarity at every step.
            </h2>
          </div>

          <p style={styles.intro}>
            A simple process from first conversation to final delivery.
          </p>
        </div>

        <div style={styles.steps}>
          {steps.map((step) => (
            <div
              key={step.number}
              style={getStepStyle(step.number)}
              onMouseEnter={() =>
                setHoveredStep(step.number)
              }
              onMouseLeave={() =>
                setHoveredStep(null)
              }
            >
              <div style={styles.stepLabel}>
                {step.number} / {step.label}
              </div>

              <h3 style={styles.stepTitle}>
                {step.title}
              </h3>

              <p style={styles.stepText}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div style={styles.reassurance}>
          <div style={styles.reassuranceItem}>
            <span style={styles.reassuranceDot} />
            <span>Clear scope</span>
          </div>

          <div style={styles.reassuranceItem}>
            <span style={styles.reassuranceDot} />
            <span>Regular updates</span>
          </div>

          <div style={styles.reassuranceItem}>
            <span style={styles.reassuranceDot} />
            <span>Direct communication</span>
          </div>

          <div style={styles.reassuranceItem}>
            <span style={styles.reassuranceDot} />
            <span>Clear handover</span>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.about}>
          <div>
            <div style={styles.label}>
              04 / THE PERSON BEHIND THE WORK
            </div>

            <h2 style={styles.aboutHeading}>
              One developer.
              <br />
              The whole picture.
            </h2>

            <div style={styles.signature}>
              <div style={styles.name}>
                Zohaib
              </div>

              <div style={styles.role}>
                {settings?.founderTitle || "Web Developer • AI Builder • Pakistan / Remote"}
              </div>

              <div style={styles.availability}>
                <span style={styles.availabilityDot} />
                <span>
                  {settings?.availabilityStatus || "Available for selected projects"}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.aboutText}>
            <p style={styles.mainText}>
              {settings?.bioSnippet ? (
                <>I&apos;m Zohaib. {settings.bioSnippet}</>
              ) : (
                <>
                  I&apos;m Zohaib, a web developer and AI builder focused on
                  practical products, useful automation and connected workflows.
                  I work across web apps, AI integrations, APIs and the systems
                  that keep day to day work moving.
                </>
              )}
            </p>

            <p style={styles.directText}>
              You work directly with me from the first conversation through
              development and delivery, so there is less back and forth and a
              clearer view of the whole project.
            </p>

            <p style={styles.secondaryText}>
              I also run{" "}
              <Link
                href="/about"
                style={styles.accent}
              >
                Codingskillup
              </Link>
              , where I share what I learn while building. Learn, build,
              repeat.
            </p>

            <div style={styles.buttonRow}>
              <Link
                href="/about"
                style={getAboutLinkStyle()}
                onMouseEnter={() =>
                  setHoveredLink("about")
                }
                onMouseLeave={() =>
                  setHoveredLink(null)
                }
              >
                More about me ↗ 
              </Link>

              <Link
                href="/contact"
                style={styles.contactLink}
              >
                Let&apos;s work together ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}