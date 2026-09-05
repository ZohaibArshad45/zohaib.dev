"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

export default function SelectedWork() {
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
    section: {
      width: "100%",
      background: "#0c0e0d",
      color: "#ffffff",
      padding: isMobile
        ? "75px 20px 70px"
        : isTablet
        ? "100px 32px 90px"
        : "120px 48px 100px",
      boxSizing: "border-box",
    },

    container: {
      width: "100%",
      maxWidth: "1280px",
      margin: "0 auto",
    },

    top: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "1.5fr 0.5fr",
      gap: isMobile ? "30px" : "60px",
      alignItems: "end",
      marginBottom: isMobile ? "45px" : "55px",
    },

    label: {
      color: "#caff46",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "1.5px",
      marginBottom: "24px",
    },

    heading: {
      margin: 0,
      maxWidth: "600px",
      color: "#f6f6f4",
      fontSize: isMobile
        ? "42px"
        : isTablet
        ? "52px"
        : "60px",
      lineHeight: "1.02",
      letterSpacing: isMobile ? "0px" : "1px",
      fontWeight: "400",
    },

    intro: {
      maxWidth: "230px",
      margin: 0,
      color: "#b8beb9",
      fontSize: "13px",
      lineHeight: "1.7",
      justifySelf: isMobile ? "start" : "end",
    },

    projects: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },

    card: {
      width: "100%",
      display: "grid",
      gridTemplateColumns:
        isMobile || isTablet ? "1fr" : "1.1fr 0.9fr",
      border: "1px solid #303630",
      borderRadius: "10px",
      overflow: "hidden",
      background: "#121512",
    },

    previewOne: {
      minHeight: isMobile ? "330px" : "430px",
      background: "#c9dbb6",
      padding: isMobile ? "18px" : "38px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    inbox: {
      width: "100%",
      maxWidth: "560px",
      background: "#f9faf6",
      borderRadius: "7px",
      overflow: "hidden",
      color: "#111411",
      boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
    },

    inboxTop: {
      padding: "18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #daddd5",
    },

    inboxTitle: {
      fontSize: "13px",
      fontWeight: "700",
    },

    inboxSmall: {
      fontSize: "8px",
      letterSpacing: "0.7px",
    },

    inboxBody: {
      padding: "22px 18px 14px",
    },

    inboxHeading: {
      fontSize: isMobile ? "19px" : "21px",
      marginBottom: "5px",
    },

    inboxText: {
      color: "#777c75",
      fontSize: "10px",
      marginBottom: "14px",
    },

    inboxRow: {
      display: "grid",
      gridTemplateColumns: "32px 1fr auto",
      gap: "10px",
      alignItems: "center",
      padding: "13px 0",
      borderBottom: "1px solid #e0e4dc",
    },

    inboxCircle: {
      width: "27px",
      height: "27px",
      borderRadius: "50%",
      background: "#e7efd7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "9px",
      fontWeight: "700",
    },

    inboxRowTitle: {
      fontSize: "10px",
      fontWeight: "700",
      marginBottom: "3px",
    },

    inboxRowText: {
      fontSize: "8px",
      color: "#8b9089",
    },

    badge: {
      fontSize: "7px",
      padding: "5px 7px",
      borderRadius: "20px",
      background: "#edf3dd",
    },

    content: {
      padding: isMobile
        ? "30px 22px 34px"
        : "44px 42px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },

    status: {
      color: "#b5df78",
      fontSize: "10px",
      letterSpacing: "1px",
      marginBottom: "18px",
    },

    projectTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "25px" : "30px",
      fontWeight: "400",
      lineHeight: "1.15",
    },

    description: {
      margin: "18px 0 0",
      color: "#bac0bb",
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: "1.7",
      maxWidth: "460px",
    },

    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "20px",
    },

    tag: {
      padding: "7px 10px",
      border: "1px solid #3b413c",
      borderRadius: "20px",
      fontSize: "10px",
      color: "#ffffff",
    },

    projectLink: {
      color: "#ffffff",
      textDecoration: "none",
      width: "fit-content",
      marginTop: "28px",
      paddingBottom: "8px",
      borderBottom: "1px solid #76805e",
      fontSize: "12px",
    },

    previewTwo: {
      minHeight: isMobile ? "330px" : "390px",
      background: "#181e25",
      padding: isMobile ? "34px 22px" : "45px 38px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },

    workflowLabel: {
      color: "#8794a3",
      fontSize: "8px",
      letterSpacing: "2px",
      marginBottom: isMobile ? "30px" : "38px",
    },

    workflow: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "1fr auto 1fr auto 1fr",
      gap: isMobile ? "22px" : "18px",
      alignItems: "center",
      textAlign: "center",
    },

    toolBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    toolIcon: {
      width: "52px",
      height: "52px",
      borderRadius: "10px",
      border: "1px solid #53606c",
      background: "#202832",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "12px",
    },

    toolName: {
      fontSize: "11px",
      fontWeight: "600",
      marginBottom: "5px",
    },

    toolDesc: {
      fontSize: "8px",
      color: "#8ea0b0",
    },

    arrow: {
      color: "#7890a0",
      fontSize: "22px",
      display: isMobile ? "none" : "block",
    },

    workflowBottom: {
      marginTop: "30px",
      color: "#7d8d9a",
      fontSize: "9px",
      textAlign: "center",
    },

    bottom: {
      marginTop: isMobile ? "60px" : "80px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },

    line: {
      width: "1px",
      height: "70px",
      background: "#3b403c",
    },

    circle: {
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      border: "1px solid #caff46",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      color: "#ffffff",
      marginBottom: "18px",
    },

    viewLink: {
      color: "#c9cfca",
      textDecoration: "none",
      fontSize: "10px",
      letterSpacing: "2.5px",
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.top}>
          <div>
            <div style={styles.label}>
              01 / SELECTED WORK
            </div>

            <h2 style={styles.heading}>
              Real problems.
              <br />
              Thoughtful solutions.
            </h2>
          </div>

          <p style={styles.intro}>
            A closer look at what I build and how I approach it.
          </p>
        </div>

        <div style={styles.projects}>
          <article style={styles.card}>
            <div style={styles.previewOne}>
              <div style={styles.inbox}>
                <div style={styles.inboxTop}>
                  <span style={styles.inboxTitle}>
                    inbox / assistant
                  </span>

                  <span style={styles.inboxSmall}>
                    CONCEPT PREVIEW
                  </span>
                </div>

                <div style={styles.inboxBody}>
                  <div style={styles.inboxHeading}>
                    Your day, in focus.
                  </div>

                  <div style={styles.inboxText}>
                    The conversations that need your attention.
                  </div>

                  <div style={styles.inboxRow}>
                    <div style={styles.inboxCircle}>
                      B
                    </div>

                    <div>
                      <div style={styles.inboxRowTitle}>
                        Project feedback
                      </div>

                      <div style={styles.inboxRowText}>
                        The next version is ready for review.
                      </div>
                    </div>

                    <div style={styles.badge}>
                      Priority
                    </div>
                  </div>

                  <div style={styles.inboxRow}>
                    <div
                      style={{
                        ...styles.inboxCircle,
                        background: "#deebf1",
                      }}
                    >
                      T
                    </div>

                    <div>
                      <div style={styles.inboxRowTitle}>
                        You were mentioned
                      </div>

                      <div style={styles.inboxRowText}>
                        A question for you in the latest thread.
                      </div>
                    </div>

                    <div style={styles.badge}>
                      Mention
                    </div>
                  </div>

                  <div style={styles.inboxRow}>
                    <div
                      style={{
                        ...styles.inboxCircle,
                        background: "#eadff0",
                      }}
                    >
                      D
                    </div>

                    <div>
                      <div style={styles.inboxRowTitle}>
                        Weekly product update
                      </div>

                      <div style={styles.inboxRowText}>
                        Your team's progress, in one place.
                      </div>
                    </div>

                    <div style={styles.badge}>
                      Update
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.content}>
              <div style={styles.status}>
                In development
              </div>

              <h3 style={styles.projectTitle}>
                An inbox that knows what matters.
              </h3>

              <p style={styles.description}>
                A personal project bringing multiple email accounts
                into one focused workspace, with AI sorting for
                keywords, important messages and mentions.
              </p>

              <div style={styles.tags}>
                <span style={styles.tag}>
                  Next.js
                </span>

                <span style={styles.tag}>
                  Supabase
                </span>

                <span style={styles.tag}>
                  AI
                </span>
              </div>

              <Link
                href="/work/inbox"
                style={styles.projectLink}
              >
                Explore the project ↗
              </Link>
            </div>
          </article>

          <article style={styles.card}>
            <div style={styles.previewTwo}>
              <div style={styles.workflowLabel}>
                LESS REPETITION. MORE PROGRESS.
              </div>

              <div style={styles.workflow}>
                <div style={styles.toolBox}>
                  <div
                    style={{
                      ...styles.toolIcon,
                      color: "#ff755e",
                    }}
                  >
                    H
                  </div>

                  <div style={styles.toolName}>
                    HubSpot
                  </div>

                  <div style={styles.toolDesc}>
                    New deal
                  </div>
                </div>

                <div style={styles.arrow}>
                  →
                </div>

                <div style={styles.toolBox}>
                  <div
                    style={{
                      ...styles.toolIcon,
                      color: "#ff7171",
                    }}
                  >
                    n8n
                  </div>

                  <div style={styles.toolName}>
                    Automation
                  </div>

                  <div style={styles.toolDesc}>
                    Map deal details
                  </div>
                </div>

                <div style={styles.arrow}>
                  →
                </div>

                <div style={styles.toolBox}>
                  <div
                    style={{
                      ...styles.toolIcon,
                      color: "#ef73bb",
                    }}
                  >
                    A
                  </div>

                  <div style={styles.toolName}>
                    Asana
                  </div>

                  <div style={styles.toolDesc}>
                    Create task
                  </div>
                </div>
              </div>

              <div style={styles.workflowBottom}>
                A connected workflow, from deal to delivery.
              </div>
            </div>

            <div style={styles.content}>
              <div style={styles.status}>
                Workflow project
              </div>

              <h3 style={styles.projectTitle}>
                From a new deal to the next task.
              </h3>

              <p style={styles.description}>
                Connecting HubSpot deal information with Asana tasks
                through n8n, so project details follow the work.
              </p>

              <div style={styles.tags}>
                <span style={styles.tag}>
                  n8n
                </span>

                <span style={styles.tag}>
                  HubSpot
                </span>

                <span style={styles.tag}>
                  Asana
                </span>
              </div>

              <Link
                href="/work/automation"
                style={styles.projectLink}
              >
                Explore the project ↗
              </Link>
            </div>
          </article>
        </div>

        <div style={styles.bottom}>
          <div style={styles.line} />

          <Link
            href="/work"
            style={{
              textDecoration: "none",
            }}
          >
            <div style={styles.circle}>
              ↓
            </div>
          </Link>

          <Link
            href="/work"
            style={styles.viewLink}
          >
            VIEW OTHER PROJECTS
          </Link>
        </div>
      </div>
    </section>
  );
}