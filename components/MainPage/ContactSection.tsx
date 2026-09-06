"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";

type ProjectType =
  | "Web App"
  | "AI Agents & Features"
  | "Automation & Integrations"
  | "Other";

type Timeline =
  | "ASAP"
  | "1 to 2 months"
  | "2 to 3 months"
  | "Flexible";

type FormState = {
  name: string;
  email: string;
  projectType: ProjectType;
  timeline: Timeline;
  details: string;
};

type Social = {
  name: string;
  href: string;
  short: string;
};

export default function ContactSection() {
  const [width, setWidth] = useState<number>(1440);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [buttonHover, setButtonHover] = useState(false);

  const [hoveredSocial, setHoveredSocial] = useState<
    string | null
  >(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    projectType: "Web App",
    timeline: "Flexible",
    details: "",
  });

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

  const socials: Social[] = [
    {
      name: "LinkedIn",
      href: "#",
      short: "in",
    },
    {
      name: "GitHub",
      href: "#",
      short: "GH",
    },
    {
      name: "Upwork",
      href: "#",
      short: "Up",
    },
    {
      name: "Codingskillup",
      href: "#",
      short: "CS",
    },
  ];

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setSending(true);
    setSent(false);
    setSubmitError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Unable to send message");
      }

      setSent(true);

      setForm({
        name: "",
        email: "",
        projectType: "Web App",
        timeline: "Flexible",
        details: "",
      });

      window.setTimeout(() => {
        setSent(false);
      }, 5000);
    } catch {
      setSubmitError(true);

      window.setTimeout(() => {
        setSubmitError(false);
      }, 5000);
    } finally {
      setSending(false);
    }
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#0c0e0d",
      color: "#f5f5f3",
      fontFamily: "Arial, Helvetica, sans-serif",
    },

    container: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
      padding: isMobile
        ? "24px 20px 0"
        : isTablet
        ? "24px 32px 0"
        : "24px 48px 0",
      boxSizing: "border-box",
    },

    topLine: {
      width: "100%",
      height: "1px",
      background: "#313630",
    },

    content: {
      display: "grid",

      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "1fr"
        : "1fr 1fr",

      gap: isMobile
        ? "52px"
        : isTablet
        ? "66px"
        : "72px",

      padding: isMobile
        ? "68px 0 70px"
        : isTablet
        ? "78px 0 80px"
        : "72px 0 78px",

      alignItems: "start",
    },

    left: {
      paddingTop: isMobile ? "0" : "4px",
    },

    eyebrow: {
      color: "#caff46",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: "1.5",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: isMobile ? "22px" : "26px",
    },

    heading: {
      margin: 0,
      color: "#f6f6f4",

      fontSize: isMobile
        ? "40px"
        : isTablet
        ? "50px"
        : "58px",

      lineHeight: "1.05",
      fontWeight: "400",
      letterSpacing: "0",
    },

    headingAccent: {
      color: "#caff46",
      display: "block",
      marginTop: "6px",
    },

    intro: {
      margin: isMobile
        ? "22px 0 0"
        : "24px 0 0",

      maxWidth: "450px",
      color: "#c0c6c1",

      fontSize: isMobile
        ? "14px"
        : "15px",

      lineHeight: "1.7",
    },

    profileInfo: {
      marginTop: "34px",
      paddingTop: "26px",
      borderTop: "1px solid #303530",
      maxWidth: "430px",
    },

    profileName: {
      margin: 0,
      color: "#ffffff",
      fontSize: "18px",
      fontWeight: "700",
    },

    profileRole: {
      marginTop: "7px",
      color: "#c7cdc8",
      fontSize: "13px",
      lineHeight: "1.6",
    },

    founder: {
      marginTop: "5px",
      color: "#caff46",
      fontSize: "13px",
      lineHeight: "1.6",
    },

    location: {
      marginTop: "5px",
      color: "#aeb5af",
      fontSize: "13px",
      lineHeight: "1.6",
    },

    emailLink: {
      display: "inline-block",
      marginTop: "15px",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "13px",
      paddingBottom: "5px",
      borderBottom: "1px solid #69705f",
    },

    nextSteps: {
      marginTop: "32px",
      paddingTop: "24px",
      borderTop: "1px solid #303530",
      maxWidth: "430px",
    },

    nextTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
    },

    nextList: {
      marginTop: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    nextItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#b9bfba",
      fontSize: "13px",
      lineHeight: "1.6",
    },

    nextNumber: {
      color: "#caff46",
      fontSize: "11px",
      fontWeight: "700",
      minWidth: "24px",
    },

    card: {
      width: "100%",
      background: "#171b16",
      border: "1px solid #343a31",
      borderRadius: "11px",

      padding: isMobile
        ? "22px 18px"
        : "26px",

      boxSizing: "border-box",
    },

    cardTitle: {
      margin: "0 0 22px",
      color: "#ffffff",

      fontSize: isMobile
        ? "19px"
        : "21px",

      lineHeight: "1.3",
      fontWeight: "400",
    },

    field: {
      marginBottom: "16px",
    },

    fieldRow: {
      display: "grid",

      gridTemplateColumns:
        isMobile || isTablet
          ? "1fr"
          : "1fr 1fr",

      gap: isMobile ? "0" : "14px",
    },

    label: {
      display: "block",
      marginBottom: "8px",
      color: "#ffffff",
      fontSize: "13px",
    },

    input: {
      width: "100%",
      minHeight: "46px",
      background: "#11140f",
      border: "1px solid #3b4236",
      borderRadius: "6px",
      padding: "0 13px",
      color: "#ffffff",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
    },

    select: {
      width: "100%",
      minHeight: "46px",
      background: "#11140f",
      border: "1px solid #3b4236",
      borderRadius: "6px",
      padding: "0 13px",
      color: "#ffffff",
      fontSize: "13px",
      outline: "none",
      boxSizing: "border-box",
    },

    textarea: {
      width: "100%",
      minHeight: "96px",
      resize: "vertical",
      background: "#11140f",
      border: "1px solid #3b4236",
      borderRadius: "6px",
      padding: "13px",
      color: "#ffffff",
      fontSize: "14px",
      lineHeight: "1.5",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },

    button: {
      width: "100%",
      minHeight: "52px",
      border: "none",
      borderRadius: "5px",

      background:
        buttonHover && !sending
          ? "#baf03e"
          : "#caff46",

      color: "#10120f",
      fontSize: "14px",
      fontWeight: "700",

      cursor: sending
        ? "not-allowed"
        : "pointer",

      opacity: sending ? 0.7 : 1,

      marginTop: "2px",

      transition: "0.2s ease",

      transform:
        buttonHover && !sending
          ? "translateY(1px)"
          : "translateY(0)",
    },

    note: {
      margin: "11px 0 0",
      color: "#aeb5af",
      fontSize: "10px",
      lineHeight: "1.6",
    },

    success: {
      margin: "12px 0 0",
      color: "#caff46",
      fontSize: "12px",
      lineHeight: "1.6",
    },

    error: {
      margin: "12px 0 0",
      color: "#ff8c8c",
      fontSize: "12px",
      lineHeight: "1.6",
    },

    directContact: {
      marginTop: "20px",
      paddingTop: "18px",
      borderTop: "1px solid #303530",
    },

    directTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "600",
    },

    directText: {
      margin: "6px 0 0",
      color: "#aeb5af",
      fontSize: "11px",
      lineHeight: "1.6",
    },

    footer: {
      borderTop: "1px solid #313630",

      padding: isMobile
        ? "30px 0"
        : "30px 0 26px",
    },

    footerTop: {
      display: "grid",

      gridTemplateColumns:
        isMobile
          ? "1fr"
          : "1fr auto",

      gap: isMobile
        ? "24px"
        : "30px",

      alignItems: "center",
    },

    logoArea: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },

    logo: {
      color: "#ffffff",
      fontSize: "28px",
      fontWeight: "800",
      letterSpacing: "0",
    },

    dot: {
      color: "#caff46",
    },

    footerFounder: {
      color: "#aeb5af",
      fontSize: "11px",
    },

    socials: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      alignItems: "center",
    },

    socialLink: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      textDecoration: "none",
      fontSize: "12px",
      fontWeight: "700",

      transition: "0.2s ease",
    },

    footerBottom: {
      marginTop: "26px",
      paddingTop: "22px",

      borderTop: "1px solid #242924",

      display: "grid",

      gridTemplateColumns:
        isMobile
          ? "1fr"
          : "1fr auto",

      gap: isMobile
        ? "14px"
        : "20px",

      alignItems: "center",
    },

    copyright: {
      color: "#9fa59f",
      fontSize: "11px",
      lineHeight: "1.6",
    },

    backLink: {
      color: "#d5d9d5",
      textDecoration: "none",
      fontSize: "11px",
    },
  };

  const getSocialStyle = (
    name: string
  ): CSSProperties => ({
    ...styles.socialLink,

    color:
      hoveredSocial === name
        ? "#10120f"
        : "#ffffff",

    background:
      hoveredSocial === name
        ? "#caff46"
        : "#141814",

    border:
      hoveredSocial === name
        ? "1px solid #caff46"
        : "1px solid #343a31",

    transform:
      hoveredSocial === name
        ? "translateY(2px)"
        : "translateY(0)",
  });

  return (
    <main style={styles.page} id="top">
      <div style={styles.container}>
        <div style={styles.topLine} />

        <section style={styles.content}>
          <div style={styles.left}>
            <div style={styles.eyebrow}>
              05 / LET&apos;S WORK TOGETHER
            </div>

            <h1 style={styles.heading}>
              Bring the idea.

              <span style={styles.headingAccent}>
                Let&apos;s map the build.
              </span>
            </h1>

            <p style={styles.intro}>
              Tell me what you want to build, what&apos;s getting in the way
              and when you&apos;d like to start.
            </p>

            <div style={styles.profileInfo}>
              <p style={styles.profileName}>
                Zohaib
              </p>

              <div style={styles.profileRole}>
                Web Developer &amp; AI Builder
              </div>

              <div style={styles.founder}>
                Founder of Codingskillup
              </div>

              <div style={styles.location}>
                Bahawalpur, Punjab, Pakistan
              </div>

              <a
                href="mailto:zohaibfta@gmail.com"
                style={styles.emailLink}
              >
                zohaibfta@gmail.com ↗
              </a>
            </div>

            <div style={styles.nextSteps}>
              <p style={styles.nextTitle}>
                What happens next?
              </p>

              <div style={styles.nextList}>
                <div style={styles.nextItem}>
                  <span style={styles.nextNumber}>
                    01
                  </span>

                  <span>
                    I review your project inquiry.
                  </span>
                </div>

                <div style={styles.nextItem}>
                  <span style={styles.nextNumber}>
                    02
                  </span>

                  <span>
                    We discuss scope and requirements.
                  </span>
                </div>

                <div style={styles.nextItem}>
                  <span style={styles.nextNumber}>
                    03
                  </span>

                  <span>
                    We decide the best next step.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form
            style={styles.card}
            onSubmit={handleSubmit}
          >
            <h2 style={styles.cardTitle}>
              Tell me about your project.
            </h2>

            <div style={styles.field}>
              <label
                htmlFor="name"
                style={styles.label}
              >
                Your name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label
                htmlFor="email"
                style={styles.label}
              >
                Your email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label
                  htmlFor="projectType"
                  style={styles.label}
                >
                  What do you need?
                </label>

                <select
                  id="projectType"
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Web App">
                    Web App
                  </option>

                  <option value="AI Agents & Features">
                    AI Agents &amp; Features
                  </option>

                  <option value="Automation & Integrations">
                    Automation &amp; Integrations
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div style={styles.field}>
                <label
                  htmlFor="timeline"
                  style={styles.label}
                >
                  Start time
                </label>

                <select
                  id="timeline"
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="ASAP">
                    ASAP
                  </option>

                  <option value="1 to 2 months">
                    1 to 2 months
                  </option>

                  <option value="2 to 3 months">
                    2 to 3 months
                  </option>

                  <option value="Flexible">
                    Flexible
                  </option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label
                htmlFor="details"
                style={styles.label}
              >
                A little about your project
              </label>

              <textarea
                id="details"
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="The idea, the challenge and what you want to improve..."
                style={styles.textarea}
                required
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={sending}
              onMouseEnter={() =>
                setButtonHover(true)
              }
              onMouseLeave={() =>
                setButtonHover(false)
              }
            >
              {sending
                ? "Sending..."
                : sent
                ? "Message sent ✓"
                : "Send project inquiry ↗"}
            </button>

            <p style={styles.note}>
              Your project details will be sent directly to Zohaib.
            </p>

            {sent && (
              <p style={styles.success}>
                Thanks. Your project inquiry was sent successfully.
              </p>
            )}

            {submitError && (
              <p style={styles.error}>
                Your message could not be sent. Please try again or email me
                directly.
              </p>
            )}

            <div style={styles.directContact}>
              <p style={styles.directTitle}>
                Prefer email?
              </p>

              <p style={styles.directText}>
                Send your project details directly to zohaibfta@gmail.com
              </p>
            </div>
          </form>
        </section>

        <footer style={styles.footer}>
          <div style={styles.footerTop}>
            <div style={styles.logoArea}>
              <div style={styles.logo}>
                Zohaib
                <span style={styles.dot}>
                  .
                </span>
              </div>

              <div style={styles.footerFounder}>
                Web Developer &amp; AI Builder
                {" • "}
                Founder of Codingskillup
                {" • "}
                Bahawalpur, Punjab, Pakistan
              </div>
            </div>

            <div style={styles.socials}>
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  style={getSocialStyle(social.name)}
                  onMouseEnter={() =>
                    setHoveredSocial(social.name)
                  }
                  onMouseLeave={() =>
                    setHoveredSocial(null)
                  }
                >
                  {social.short}
                </a>
              ))}
            </div>
          </div>

          <div style={styles.footerBottom}>
            <div style={styles.copyright}>
              © 2026 Zohaib. All rights reserved.
            </div>

            <a
              href="#top"
              style={styles.backLink}
            >
              Back to top ↑
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}