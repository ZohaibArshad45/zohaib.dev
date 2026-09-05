"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

type Service = {
  number: string;
  title: string;
  description: string;
  items: string[];
  stack: string;
};

export default function ServicesSection() {
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

  const services: Service[] = [
    {
      number: "01",
      title: "Build your web app",
      description:
        "Turn a product idea into a clear, responsive application with the interface and data working together.",
      items: [
        "Responsive UI",
        "Database integration",
        "Product workflows",
      ],
      stack: "Next.js / React / TypeScript / Supabase",
    },
    {
      number: "02",
      title: "Put AI to useful work",
      description:
        "Add an assistant or focused AI feature that helps your users get something done.",
      items: [
        "AI assistants",
        "Chatbot integrations",
        "Message classification",
      ],
      stack: "OpenAI / APIs / AI workflows",
    },
    {
      number: "03",
      title: "Connect your tools",
      description:
        "Reduce repeated data entry and keep your CRM, task management and email operations connected.",
      items: [
        "CRM automation",
        "Field mapping",
        "Email workflows",
      ],
      stack: "n8n / HubSpot / Smartlead / Webhooks",
    },
  ];

  const styles: Record<string, CSSProperties> = {
    section: {
      width: "100%",
      background: "#0c0e0d",
      color: "#ffffff",
      padding: isMobile
        ? "80px 20px 80px"
        : isTablet
        ? "100px 32px 90px"
        : "120px 48px 110px",
      boxSizing: "border-box",
    },

    container: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
    },

    label: {
      color: "#caff46",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "1.8px",
      marginBottom: isMobile ? "24px" : "30px",
    },

    heading: {
      margin: 0,
      color: "#f3f4f2",
      fontSize: isMobile
        ? "44px"
        : isTablet
        ? "56px"
        : "68px",
      lineHeight: "1.02",
      fontWeight: "400",
      letterSpacing: isMobile ? "-2px" : "-3px",
      maxWidth: "700px",
    },

    cards: {
      marginTop: isMobile ? "48px" : "58px",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "1fr"
        : "repeat(3, 1fr)",
      gap: isMobile ? "18px" : isTablet ? "20px" : "18px",
    },

    card: {
      minHeight: isMobile ? "auto" : "500px",
      background: "#141814",
      border: "1px solid #323832",
      borderRadius: "8px",
      padding: isMobile
        ? "26px 22px"
        : "34px 28px 28px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },

    number: {
      color: "#caff46",
      fontSize: "11px",
      fontWeight: "700",
      marginBottom: "30px",
    },

    cardTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "24px" : "27px",
      lineHeight: "1.15",
      fontWeight: "400",
    },

    description: {
      margin: "18px 0 0",
      color: "#b9c0ba",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
      minHeight: isMobile ? "auto" : "100px",
    },

    list: {
      marginTop: "20px",
    },

    listItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "11px 0",
      borderBottom: "1px solid #2c332c",
      color: "#f1f2f0",
      fontSize: "13px",
    },

    check: {
      color: "#caff46",
      fontSize: "15px",
    },

    stack: {
      marginTop: "26px",
      color: "#f0f1ef",
      fontSize: "11px",
      lineHeight: "1.6",
    },

    linkWrap: {
      marginTop: "auto",
      paddingTop: isMobile ? "32px" : "42px",
    },

    link: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "12px",
      paddingBottom: "8px",
      borderBottom: "1px solid #69705f",
      width: "fit-content",
      display: "inline-block",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.label}>
          02 / HOW I CAN HELP
        </div>

        <h2 style={styles.heading}>
          What does your business
          <br />
          need next?
        </h2>

        <div style={styles.cards}>
          {services.map((service) => (
            <article
              key={service.number}
              style={styles.card}
            >
              <div style={styles.number}>
                {service.number}
              </div>

              <h3 style={styles.cardTitle}>
                {service.title}
              </h3>

              <p style={styles.description}>
                {service.description}
              </p>

              <div style={styles.list}>
                {service.items.map((item) => (
                  <div
                    key={item}
                    style={styles.listItem}
                  >
                    <span style={styles.check}>
                      ✓
                    </span>

                    <span>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.stack}>
                {service.stack}
              </div>

              <div style={styles.linkWrap}>
                <Link
                  href="/contact"
                  style={styles.link}
                >
                  Let's discuss it ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
