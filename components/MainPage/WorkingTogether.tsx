"use client";

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
        "We discuss your users, existing tools and the outcome you need. Then we agree on a focused scope.",
    },
    {
      number: "02",
      label: "BUILD",
      title: "See the work take shape.",
      description:
        "Review working progress, give feedback and make decisions while there is room to adjust.",
    },
    {
      number: "03",
      label: "HAND OVER",
      title: "Know what comes next.",
      description:
        "Review the finished scope together, with a clear handover and next steps for your project.",
    },
  ];

  const styles: Record<string, CSSProperties> = {
    section: {
      width: "100%",
      background: "#0c0e0d",
      color: "#ffffff",
      padding: isMobile
        ? "80px 20px"
        : isTablet
        ? "100px 32px"
        : "120px 48px",
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
      gap: isMobile ? "26px" : "60px",
      alignItems: "end",
    },

    label: {
      color: "#caff46",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "1.8px",
      marginBottom: isMobile ? "24px" : "28px",
    },

    heading: {
      margin: 0,
      color: "#f4f5f3",
      fontSize: isMobile
        ? "44px"
        : isTablet
        ? "56px"
        : "64px",
      lineHeight: "1.02",
      fontWeight: "400",
      letterSpacing: isMobile ? "0px" : "1px",
    },

    intro: {
      maxWidth: "240px",
      justifySelf: isMobile ? "start" : "end",
      margin: 0,
      color: "#b9bfba",
      fontSize: "13px",
      lineHeight: "1.7",
    },

    steps: {
      marginTop: isMobile ? "48px" : "58px",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "1fr"
        : "repeat(3, 1fr)",
      gap: isMobile ? "36px" : isTablet ? "32px" : "40px",
    },

    step: {
      borderTop: "1px solid #303530",
      paddingTop: isMobile ? "24px" : "28px",
    },

    stepLabel: {
      color: "#caff46",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.7px",
      marginBottom: "24px",
    },

    stepTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "23px" : "25px",
      fontWeight: "400",
      lineHeight: "1.2",
    },

    stepText: {
      margin: "18px 0 0",
      color: "#b9bfba",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
      maxWidth: "350px",
    },

    divider: {
      width: "100%",
      height: "1px",
      background: "#303530",
      margin: isMobile
        ? "70px 0"
        : "100px 0 70px",
    },

    about: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "1fr"
        : "1fr 1fr",
      gap: isMobile ? "45px" : isTablet ? "55px" : "80px",
      alignItems: "start",
    },

    aboutHeading: {
      margin: 0,
      color: "#f4f5f3",
      fontSize: isMobile
        ? "44px"
        : isTablet
        ? "56px"
        : "62px",
      lineHeight: "1.02",
      fontWeight: "400",
      letterSpacing: isMobile ? "0px" : "1px",
    },

    signature: {
      marginTop: isMobile ? "32px" : "42px",
    },

    name: {
      color: "#ffffff",
      fontSize: "23px",
      fontWeight: "700",
      marginBottom: "8px",
    },

    tagline: {
      color: "#c9ceca",
      fontSize: "10px",
      letterSpacing: "1.4px",
    },

    aboutText: {
      paddingTop: isMobile ? "0" : "6px",
    },

    mainText: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "17px" : "19px",
      lineHeight: "1.6",
      fontWeight: "500",
    },

    secondaryText: {
      margin: "22px 0 0",
      color: "#aeb5af",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
    },

    accent: {
      color: "#caff46",
    },
  };

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
            A practical way to move
            <br />
            from conversation to delivery.
          </p>
        </div>

        <div style={styles.steps}>
          {steps.map((step) => (
            <div key={step.number} style={styles.step}>
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

              <div style={styles.tagline}>
                / Learn. Build. Repeat.
              </div>
            </div>
          </div>

          <div style={styles.aboutText}>
            <p style={styles.mainText}>
              I’m Zohaib, a freelance web developer based in
              Pakistan. I connect the interface, the data and the
              everyday workflows behind a product. My work spans
              web apps, AI integrations and email operations with
              Smartlead and Hypertide.
            </p>

            <p style={styles.secondaryText}>
              I also share programming content through{" "}
              <span style={styles.accent}>
                Codingskillup
              </span>
              . Learn, build, repeat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
