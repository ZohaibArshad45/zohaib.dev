"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from "react";

type ProjectType =
  | "Web application"
  | "AI integration"
  | "Automation"
  | "Other";

type FormState = {
  name: string;
  projectType: ProjectType;
  details: string;
};

export default function ContactSection() {
  const [width, setWidth] = useState<number>(1440);
  const [copied, setCopied] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    projectType: "Web application",
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

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const brief = [
      "Project brief",
      "",
      `Name: ${form.name || "Not provided"}`,
      `Project type: ${form.projectType}`,
      "",
      "Project details:",
      form.details || "Not provided",
    ].join("\n");

    await navigator.clipboard.writeText(brief);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
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
        : "1.08fr 0.92fr",
      gap: isMobile ? "56px" : isTablet ? "70px" : "110px",
      padding: isMobile
        ? "70px 0 70px"
        : isTablet
        ? "80px 0 80px"
        : "70px 0 75px",
      alignItems: "start",
    },

    left: {
      paddingTop: isMobile ? "0" : "5px",
    },

    eyebrow: {
      color: "#caff46",
      fontSize: "10px",
      lineHeight: "1.4",
      fontWeight: "700",
      letterSpacing: "1.8px",
      textTransform: "uppercase",
      marginBottom: isMobile ? "28px" : "34px",
    },

    heading: {
      margin: 0,
      color: "#f6f6f4",
      fontSize: isMobile
        ? "48px"
        : isTablet
        ? "60px"
        : "64px",
      lineHeight: "1.07",
      fontWeight: "400",
      letterSpacing: isMobile ? "-2px" : "-3px",
    },

    headingAccent: {
      color: "#caff46",
      display: "block",
      marginTop: "6px",
    },

    intro: {
      margin: isMobile ? "24px 0 0" : "26px 0 0",
      maxWidth: "480px",
      color: "#c0c6c1",
      fontSize: isMobile ? "15px" : "16px",
      lineHeight: "1.65",
    },

    card: {
      width: "100%",
      background: "#171b16",
      border: "1px solid #343a31",
      borderRadius: "11px",
      padding: isMobile ? "24px 18px" : "28px",
      boxSizing: "border-box",
    },

    cardTitle: {
      margin: "0 0 26px",
      color: "#ffffff",
      fontSize: isMobile ? "19px" : "21px",
      lineHeight: "1.3",
      fontWeight: "400",
    },

    field: {
      marginBottom: "20px",
    },

    label: {
      display: "block",
      marginBottom: "10px",
      color: "#ffffff",
      fontSize: "13px",
    },

    input: {
      width: "100%",
      minHeight: "48px",
      background: "#11140f",
      border: "1px solid #3b4236",
      borderRadius: "6px",
      padding: "0 13px",
      color: "#ffffff",
      fontSize: "15px",
      outline: "none",
      boxSizing: "border-box",
    },

    select: {
      width: "100%",
      minHeight: "44px",
      background: "#11140f",
      border: "1px solid #3b4236",
      borderRadius: "6px",
      padding: "0 13px",
      color: "#ffffff",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
    },

    textarea: {
      width: "100%",
      minHeight: "102px",
      resize: "vertical",
      background: "#11140f",
      border: "1px solid #3b4236",
      borderRadius: "6px",
      padding: "13px",
      color: "#ffffff",
      fontSize: "15px",
      lineHeight: "1.5",
      outline: "none",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },

    button: {
      width: "100%",
      minHeight: "56px",
      border: "none",
      borderRadius: "4px",
      background: "#caff46",
      color: "#10120f",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "2px",
    },

    note: {
      margin: "13px 0 0",
      color: "#c0c6c1",
      fontSize: "11px",
      lineHeight: "1.7",
    },

    footer: {
      borderTop: "1px solid #313630",
      minHeight: "82px",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "1fr 1fr 1fr",
      alignItems: "center",
      gap: isMobile ? "16px" : "20px",
      padding: isMobile
        ? "28px 0"
        : "0",
    },

    logo: {
      color: "#ffffff",
      fontSize: "28px",
      fontWeight: "800",
      letterSpacing: "-1px",
    },

    dot: {
      color: "#caff46",
    },

    copyright: {
      textAlign: isMobile ? "left" : "center",
      color: "#d2d6d2",
      fontSize: "11px",
    },

    back: {
      textAlign: isMobile ? "left" : "right",
    },

    backLink: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "11px",
    },
  };

  return (
    <main style={styles.page} id="top">
      <div style={styles.container}>
        <div style={styles.topLine} />

        <section style={styles.content}>
          <div style={styles.left}>
            <div style={styles.eyebrow}>
              LET&apos;S TALK ABOUT YOUR PROJECT
            </div>

            <h1 style={styles.heading}>
              Bring the idea.
              <span style={styles.headingAccent}>
                Let&apos;s map the build.
              </span>
            </h1>

            <p style={styles.intro}>
              Tell me what you want to build, what&apos;s getting in the way and
              when you&apos;d like to start.
            </p>
          </div>

          <form style={styles.card} onSubmit={handleSubmit}>
            <h2 style={styles.cardTitle}>
              A good conversation starts here.
            </h2>

            <div style={styles.field}>
              <label htmlFor="name" style={styles.label}>
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
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="projectType" style={styles.label}>
                What do you need?
              </label>

              <select
                id="projectType"
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="Web application">Web application</option>
                <option value="AI integration">AI integration</option>
                <option value="Automation">Automation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.field}>
              <label htmlFor="details" style={styles.label}>
                A little about your project
              </label>

              <textarea
                id="details"
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="The idea, the challenge and your timeline..."
                style={styles.textarea}
              />
            </div>

            <button type="submit" style={styles.button}>
              {copied ? "Project brief copied ✓" : "Copy project brief ↗"}
            </button>

            <p style={styles.note}>
              Create a brief to share in your conversation with Zohaib. This form
              does not send a message.
            </p>
          </form>
        </section>

        <footer style={styles.footer}>
          <div style={styles.logo}>
            zohaib<span style={styles.dot}>.</span>
          </div>

          <div style={styles.copyright}>
            © 2026 Zohaib · Built with purpose.
          </div>

          <div style={styles.back}>
            <a href="#top" style={styles.backLink}>
              Back to top ↑
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
