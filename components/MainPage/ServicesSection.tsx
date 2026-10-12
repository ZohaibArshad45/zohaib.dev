"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

import { type Service, INITIAL_SERVICES } from "@/lib/services";

export default function ServicesSection({
  services: propServices,
}: {
  services?: Service[];
}) {
  const [width, setWidth] = useState<number>(1440);

  const [hoveredCard, setHoveredCard] = useState<
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
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const isMobile = width <= 700;
  const isTablet = width > 700 && width <= 1024;

  const services: Service[] =
    propServices && propServices.length > 0 ? propServices : INITIAL_SERVICES;

  const styles: Record<string, CSSProperties> = {
    section: {
      width: "100%",
      background: "#0c0e0d",
      color: "#ffffff",
      padding: isMobile
        ? "75px 20px 75px"
        : isTablet
        ? "95px 32px 90px"
        : "105px 48px 100px",
      boxSizing: "border-box",
    },

    container: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
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
      color: "#f3f4f2",
      fontSize: isMobile
        ? "40px"
        : isTablet
        ? "50px"
        : "58px",
      lineHeight: "1.03",
      fontWeight: "400",
      letterSpacing: isMobile ? "-1px" : "-2px",
      maxWidth: "700px",
    },

    intro: {
      margin: isMobile
        ? "20px 0 0"
        : "24px 0 0",
      maxWidth: "620px",
      color: "#b8beb9",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: "1.7",
    },

    cards: {
      marginTop: isMobile ? "44px" : "54px",
      display: "grid",
      gridTemplateColumns:
        isMobile || isTablet
          ? "1fr"
          : "repeat(3, 1fr)",
      gap: isMobile
        ? "18px"
        : isTablet
        ? "20px"
        : "18px",
    },

    card: {
      minHeight: isMobile ? "auto" : "455px",
      background: "#141814",
      borderRadius: "10px",
      padding: isMobile
        ? "26px 22px"
        : "30px 26px 26px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },

    cardTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      marginBottom: "28px",
    },

    number: {
      color: "#caff46",
      fontSize: "11px",
      fontWeight: "700",
    },

    category: {
      color: "#868d86",
      fontSize: "9px",
      fontWeight: "700",
      letterSpacing: "1.4px",
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
      minHeight:
        isMobile || isTablet ? "auto" : "102px",
    },

    list: {
      marginTop: "18px",
    },

    listItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 0",
      borderBottom: "1px solid #2c332c",
      color: "#f1f2f0",
      fontSize: "13px",
    },

    check: {
      color: "#caff46",
      fontSize: "14px",
      flexShrink: 0,
    },

    bestFor: {
      marginTop: "20px",
      color: "#adb4ae",
      fontSize: "12px",
      lineHeight: "1.6",
    },

    bestForLabel: {
      color: "#ffffff",
      fontWeight: "600",
    },

    toolsLabel: {
      marginTop: "22px",
      color: "#7f877f",
      fontSize: "9px",
      fontWeight: "700",
      letterSpacing: "1.3px",
    },

    stack: {
      marginTop: "7px",
      color: "#e1e4e1",
      fontSize: "11px",
      lineHeight: "1.6",
    },

    linkWrap: {
      marginTop: "auto",
      paddingTop: isMobile ? "30px" : "34px",
    },

    link: {
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: "500",
      paddingBottom: "7px",
      width: "fit-content",
      display: "inline-block",
      transition:
        "color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
    },

    bottomCta: {
      marginTop: isMobile ? "54px" : "68px",
      paddingTop: isMobile ? "32px" : "40px",
      borderTop: "1px solid #2c312d",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      gap: "24px",
    },

    bottomTextWrap: {
      maxWidth: "650px",
    },

    bottomTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "22px" : "28px",
      lineHeight: "1.3",
      fontWeight: "400",
    },

    bottomText: {
      margin: "10px 0 0",
      color: "#aeb4af",
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: "1.7",
    },

    bottomLink: {
      color: "#caff46",
      textDecoration: "none",
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: "600",
      paddingBottom: "7px",
      borderBottom: "1px solid #caff46",
      whiteSpace: "nowrap",
    },
  };

  const getCardStyle = (
    serviceNumber: string
  ): CSSProperties => ({
    ...styles.card,

    border:
      hoveredCard === serviceNumber
        ? "1px solid #caff46"
        : "1px solid #323832",

    transform:
      hoveredCard === serviceNumber
        ? "translateY(-4px)"
        : "translateY(0)",

    boxShadow:
      hoveredCard === serviceNumber
        ? "0 18px 45px rgba(0,0,0,0.2)"
        : "none",

    transition:
      "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
  });

  const getLinkStyle = (
    serviceNumber: string
  ): CSSProperties => ({
    ...styles.link,

    color:
      hoveredLink === serviceNumber
        ? "#caff46"
        : "#ffffff",

    borderBottom:
      hoveredLink === serviceNumber
        ? "1px solid #caff46"
        : "1px solid #69705f",

    transform:
      hoveredLink === serviceNumber
        ? "translateX(4px)"
        : "translateX(0)",
  });

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.label}>
          02 / HOW I CAN HELP
        </div>

        <h2 style={styles.heading}>
          What can I build
          <br />
          for you?
        </h2>

        <p style={styles.intro}>
          From full web applications to AI features and connected
          workflows, I help turn business problems into practical
          products and systems.
        </p>

        <div style={styles.cards}>
          {services.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "60px 24px",
                border: "1px dashed #273028",
                borderRadius: "12px",
                textAlign: "center",
                background: "rgba(18, 22, 19, 0.4)",
              }}
            >
              <p
                style={{
                  color: "#8a948c",
                  fontSize: "15px",
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
                  padding: "8px 18px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                + Add Services in Admin ↗
              </Link>
            </div>
          ) : (
            services.map((service) => (
              <article
                key={service.slug || service.id || service.number}
                style={getCardStyle(service.number)}
                onMouseEnter={() =>
                  setHoveredCard(service.number)
                }
                onMouseLeave={() =>
                  setHoveredCard(null)
                }
              >
              <div style={styles.cardTop}>
                <div style={styles.number}>
                  {service.number}
                </div>

                <div style={styles.category}>
                  {service.category}
                </div>
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

                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div style={styles.bestFor}>
                <span style={styles.bestForLabel}>
                  Best for:
                </span>{" "}
                {service.bestFor}
              </div>

              <div style={styles.toolsLabel}>
                TOOLS I USE
              </div>

              <div style={styles.stack}>
                {service.stack}
              </div>

              <div style={styles.linkWrap}>
                <Link
                  href={service.href}
                  style={getLinkStyle(service.number)}
                  onMouseEnter={() =>
                    setHoveredLink(service.number)
                  }
                  onMouseLeave={() =>
                    setHoveredLink(null)
                  }
                >
                  {service.cta}
                </Link>
              </div>
            </article>
          )))}
        </div>

        <div style={styles.bottomCta}>
          <div style={styles.bottomTextWrap}>
            <h3 style={styles.bottomTitle}>
              Not sure which service fits?
            </h3>

            <p style={styles.bottomText}>
              Tell me what you&apos;re trying to improve or build. I can
              help you figure out the right approach.
            </p>
          </div>

          <Link
            href="/contact"
            style={styles.bottomLink}
          >
            Start a conversation ↗
          </Link>
        </div>
      </div>
    </section>
  );
}