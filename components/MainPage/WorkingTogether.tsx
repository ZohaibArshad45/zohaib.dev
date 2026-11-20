"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

type Step = {
  number: string;
  label: string;
  title: string;
  description: string;
};

export default function WorkingTogether() {
  const [width, setWidth] = useState<number>(1440);

  const [hoveredStep, setHoveredStep] = useState<
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
        "We agree on the goal, scope and the right way forward.",
    },
    {
      number: "02",
      label: "BUILD",
      title: "See the work take shape.",
      description:
        "Review progress and guide decisions as the product takes shape.",
    },
    {
      number: "03",
      label: "DELIVER",
      title: "Launch with clarity.",
      description:
        "Launch with a clear handover and practical next steps.",
    },
  ];

  const styles: Record<string, CSSProperties> = {
    section: {
      width: "100%",
      background: "linear-gradient(180deg, #f6f9f1 0%, #ffffff 100%)",
      color: "#202329",
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
      color: "#527d13",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: isMobile ? "22px" : "26px",
      lineHeight: "1.5",
    },

    heading: {
      margin: 0,
      color: "#202329",
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
      color: "#48505a",
        fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.65",
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
      border: "1px solid #e2dfd5",
      borderRadius: "16px",
      padding: isMobile ? "20px 18px" : "24px 22px",
      background: "#ffffff",
      boxShadow: "0 10px 28px rgba(31, 42, 27, 0.035)",
      minHeight: isMobile ? "auto" : "172px",
      boxSizing: "border-box",
      transition:
        "border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
    },

    stepLabel: {
      color: "#527d13",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.8px",
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 9px",
      borderRadius: "999px",
      background: "#edf4e5",
      marginBottom: "18px",
      transition: "color 0.25s ease",
    },

    stepTitle: {
      margin: 0,
      color: "#202329",
      fontSize: isMobile ? "22px" : "24px",
      fontWeight: "400",
      lineHeight: "1.2",
    },

    stepText: {
      margin: "16px 0 0",
      color: "#48505a",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
      maxWidth: "350px",
    },

    reassurance: {
      marginTop: isMobile ? "34px" : "42px",
      display: "flex",
      flexWrap: "wrap",
      gap: isMobile ? "12px 18px" : "16px 24px",
      color: "#727882",
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
      background: "#edf4e5",
      flexShrink: 0,
    },

    finalCta: {
      marginTop: isMobile ? "40px" : "54px",
      padding: isMobile ? "20px" : "26px 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "22px",
      flexWrap: "wrap",
      border: "1px solid #e2dfd5",
      borderRadius: "16px",
      background: "#fffefa",
    },
    finalCtaText: {
      margin: 0,
      color: "#48505a",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.6",
    },
    finalCtaLink: {
      flexShrink: 0,
      padding: "11px 16px",
      borderRadius: "8px",
      background: "#527d13",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "650",
      textDecoration: "none",
    },
  };

  const getStepStyle = (
    stepNumber: string
  ): CSSProperties => ({
    ...styles.step,

    border:
      hoveredStep === stepNumber
        ? "1px solid #c8dcae"
        : "1px solid #e2dfd5",

    transform:
      hoveredStep === stepNumber
        ? "translateY(-3px)"
        : "translateY(0)",
    boxShadow:
      hoveredStep === stepNumber
        ? "0 16px 34px rgba(31, 42, 27, 0.08)"
        : "0 10px 28px rgba(31, 42, 27, 0.035)",
  });

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.topHeader}>
          <div>
            <div style={styles.label}>
              HOW I WORK
            </div>

            <h2 style={styles.heading}>
              Clarity at every step.
            </h2>
          </div>

          <p style={styles.intro}>Straightforward, collaborative, and focused on the result.</p>
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

        <div style={styles.finalCta}>
          <p style={styles.finalCtaText}>Have a product or workflow that could work better?</p>
          <Link href="/contact" style={styles.finalCtaLink}>Tell me about it ↗</Link>
        </div>
      </div>
    </section>
  );
}
