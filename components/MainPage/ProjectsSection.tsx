"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

export default function SelectedWork() {
  const [width, setWidth] = useState(1440);

  const [hoveredProject, setHoveredProject] = useState<
    string | null
  >(null);

  const [hoveredLink, setHoveredLink] = useState<
    string | null
  >(null);

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
        ? "95px 32px 85px"
        : "105px 48px 95px",
      boxSizing: "border-box",
    },

    container: {
      width: "100%",
      maxWidth: "1180px",
      margin: "0 auto",
    },

    top: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "1.5fr 0.5fr",
      gap: isMobile ? "28px" : "55px",
      alignItems: "end",
      marginBottom: isMobile ? "45px" : "55px",
    },

    label: {
      color: "#caff46",
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "700",
      letterSpacing: "1px",
      marginBottom: "22px",
      lineHeight: "1.5",
    },

    heading: {
      margin: 0,
      maxWidth: "620px",
      color: "#f6f6f4",
      fontSize: isMobile
        ? "40px"
        : isTablet
        ? "50px"
        : "58px",
      lineHeight: "1.03",
      fontWeight: "400",
    },

    intro: {
      maxWidth: "260px",
      margin: 0,
      color: "#b8beb9",
      fontSize: isMobile ? "14px" : "15px",
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
      borderRadius: "12px",
      overflow: "hidden",
      background: "#121512",
      boxSizing: "border-box",
    },

    previewOne: {
      minHeight: isMobile ? "320px" : "420px",
      background: "#c9dbb6",
      padding: isMobile ? "18px" : "34px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    inbox: {
      width: "100%",
      maxWidth: "540px",
      background: "#f9faf6",
      borderRadius: "8px",
      overflow: "hidden",
      color: "#111411",
      boxShadow: "0 18px 45px rgba(0,0,0,0.08)",
    },

    inboxTop: {
      padding: "17px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #daddd5",
      gap: "10px",
    },

    inboxTitle: {
      fontSize: "12px",
      fontWeight: "700",
    },

    inboxSmall: {
      fontSize: "8px",
      letterSpacing: "0.7px",
      color: "#6b706a",
      whiteSpace: "nowrap",
    },

    inboxBody: {
      padding: "21px 17px 14px",
    },

    inboxHeading: {
      fontSize: isMobile ? "19px" : "21px",
      marginBottom: "5px",
      fontWeight: "700",
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
      lineHeight: "1.4",
    },

    badge: {
      fontSize: "7px",
      padding: "5px 7px",
      borderRadius: "20px",
      background: "#edf3dd",
      whiteSpace: "nowrap",
    },

    content: {
      padding: isMobile
        ? "30px 22px 34px"
        : isTablet
        ? "38px 32px"
        : "42px 40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },

    status: {
      color: "#b5df78",
      fontSize: "11px",
      letterSpacing: "1px",
      marginBottom: "17px",
      fontWeight: "700",
    },

    projectTitle: {
      margin: 0,
      color: "#ffffff",
      fontSize: isMobile ? "25px" : "30px",
      fontWeight: "400",
      lineHeight: "1.15",
      maxWidth: "440px",
    },

    description: {
      margin: "18px 0 0",
      color: "#bac0bb",
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: "1.7",
      maxWidth: "460px",
    },

    outcome: {
      marginTop: "16px",
      paddingLeft: "13px",
      borderLeft: "2px solid #caff46",
      color: "#d7dbd7",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: "1.6",
      maxWidth: "450px",
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
      fontSize: "11px",
      color: "#ffffff",
    },

    projectLink: {
      color: "#ffffff",
      textDecoration: "none",
      width: "fit-content",
      marginTop: "26px",
      paddingBottom: "7px",
      fontSize: "13px",
      fontWeight: "500",
      transition:
        "color 0.2s ease, border-color 0.2s ease",
    },

    previewTwo: {
      minHeight: isMobile ? "330px" : "390px",
      background: "#181e25",
      padding: isMobile ? "34px 22px" : "42px 34px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },

    workflowLabel: {
      color: "#9ba9b6",
      fontSize: "9px",
      letterSpacing: "1.6px",
      marginBottom: isMobile ? "28px" : "36px",
      textAlign: "center",
    },

    workflow: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "1fr auto 1fr auto 1fr",
      gap: isMobile ? "22px" : "16px",
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
      fontSize: "19px",
      fontWeight: "700",
      marginBottom: "11px",
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
      fontSize: "21px",
      display: isMobile ? "none" : "block",
    },

    workflowBottom: {
      marginTop: "28px",
      color: "#91a0ac",
      fontSize: "10px",
      textAlign: "center",
      lineHeight: "1.6",
    },

    previewThree: {
      minHeight: isMobile ? "330px" : "400px",
      background: "#d8d4cb",
      padding: isMobile ? "24px 18px" : "36px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    dashboard: {
      width: "100%",
      maxWidth: "540px",
      background: "#f8f7f2",
      color: "#171917",
      borderRadius: "9px",
      overflow: "hidden",
      boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
    },

    dashboardTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 18px",
      borderBottom: "1px solid #deddd7",
    },

    dashboardLogo: {
      fontSize: "12px",
      fontWeight: "700",
    },

    dashboardUser: {
      fontSize: "9px",
      color: "#757974",
    },

    dashboardBody: {
      padding: isMobile ? "18px 16px" : "22px 20px",
    },

    dashboardTitle: {
      fontSize: isMobile ? "18px" : "21px",
      fontWeight: "700",
      marginBottom: "5px",
    },

    dashboardText: {
      fontSize: "10px",
      color: "#777b76",
      marginBottom: "20px",
    },

    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      marginBottom: "18px",
    },

    stat: {
      border: "1px solid #e0dfda",
      borderRadius: "7px",
      padding: isMobile ? "10px" : "12px",
      background: "#ffffff",
    },

    statLabel: {
      fontSize: "8px",
      color: "#8a8d88",
      marginBottom: "6px",
    },

    statValue: {
      fontSize: isMobile ? "15px" : "18px",
      fontWeight: "700",
    },

    taskList: {
      borderTop: "1px solid #e0dfda",
    },

    task: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "10px",
      padding: "12px 0",
      borderBottom: "1px solid #e0dfda",
      alignItems: "center",
    },

    taskTitle: {
      fontSize: "10px",
      fontWeight: "700",
      marginBottom: "3px",
    },

    taskText: {
      fontSize: "8px",
      color: "#8a8e89",
    },

    taskStatus: {
      fontSize: "8px",
      padding: "5px 8px",
      borderRadius: "20px",
      background: "#edf3dd",
      whiteSpace: "nowrap",
    },

    bottom: {
      marginTop: isMobile ? "60px" : "75px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },

    line: {
      width: "1px",
      height: isMobile ? "50px" : "60px",
      background: "#3b403c",
    },

    circle: {
      width: "54px",
      height: "54px",
      borderRadius: "50%",
      border: "1px solid #caff46",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      color: "#ffffff",
      marginBottom: "16px",
    },

    viewLink: {
      color: "#c9cfca",
      textDecoration: "none",
      fontSize: "11px",
      letterSpacing: "1.6px",
      fontWeight: "600",
    },
  };

  const getCardStyle = (
    project: string
  ): CSSProperties => ({
    ...styles.card,

    border:
      hoveredProject === project
        ? "1px solid #caff46"
        : "1px solid #303630",

    transform:
      hoveredProject === project
        ? "translateY(-3px)"
        : "translateY(0)",

    boxShadow:
      hoveredProject === project
        ? "0 18px 45px rgba(0,0,0,0.22)"
        : "none",

    transition:
      "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
  });

  const getProjectLinkStyle = (
    project: string
  ): CSSProperties => ({
    ...styles.projectLink,

    color:
      hoveredLink === project
        ? "#caff46"
        : "#ffffff",

    borderBottom:
      hoveredLink === project
        ? "1px solid #caff46"
        : "1px solid #76805e",
  });

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
            A closer look at products, systems and workflows built around
            practical business needs.
          </p>
        </div>

        <div style={styles.projects}>
          <article
            style={getCardStyle("inbox")}
            onMouseEnter={() =>
              setHoveredProject("inbox")
            }
            onMouseLeave={() =>
              setHoveredProject(null)
            }
          >
            <div style={styles.previewOne}>
              <div style={styles.inbox}>
                <div style={styles.inboxTop}>
                  <span style={styles.inboxTitle}>
                    inbox / assistant
                  </span>

                  <span style={styles.inboxSmall}>
                    PRODUCT PREVIEW
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
                        Your team&apos;s progress, in one place.
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
                AI PRODUCT
              </div>

              <h3 style={styles.projectTitle}>
                An inbox that knows what matters.
              </h3>

              <p style={styles.description}>
                A focused workspace that brings multiple email accounts
                together and uses AI to surface keywords, important messages
                and mentions.
              </p>

              <div style={styles.outcome}>
                Built to reduce inbox noise and help important conversations
                stand out faster.
              </div>

              <div style={styles.tags}>
                <span style={styles.tag}>Next.js</span>
                <span style={styles.tag}>Supabase</span>
                <span style={styles.tag}>AI</span>
              </div>

              <Link
                href="/projects/inbox"
                style={getProjectLinkStyle("inbox")}
                onMouseEnter={() =>
                  setHoveredLink("inbox")
                }
                onMouseLeave={() =>
                  setHoveredLink(null)
                }
              >
                Explore the project ↗
              </Link>
            </div>
          </article>

          <article
            style={getCardStyle("automation")}
            onMouseEnter={() =>
              setHoveredProject("automation")
            }
            onMouseLeave={() =>
              setHoveredProject(null)
            }
          >
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
                AUTOMATION SYSTEM
              </div>

              <h3 style={styles.projectTitle}>
                From a new deal to the next task.
              </h3>

              <p style={styles.description}>
                A workflow connecting HubSpot deal information with Asana
                tasks through n8n, so project details move automatically with
                the work.
              </p>

              <div style={styles.outcome}>
                Built to reduce manual data entry and keep sales and delivery
                information connected.
              </div>

              <div style={styles.tags}>
                <span style={styles.tag}>n8n</span>
                <span style={styles.tag}>HubSpot</span>
                <span style={styles.tag}>Asana</span>
              </div>

              <Link
                href="/projects/automation"
                style={getProjectLinkStyle("automation")}
                onMouseEnter={() =>
                  setHoveredLink("automation")
                }
                onMouseLeave={() =>
                  setHoveredLink(null)
                }
              >
                Explore the project ↗
              </Link>
            </div>
          </article>

          <article
            style={getCardStyle("dashboard")}
            onMouseEnter={() =>
              setHoveredProject("dashboard")
            }
            onMouseLeave={() =>
              setHoveredProject(null)
            }
          >
            <div style={styles.previewThree}>
              <div style={styles.dashboard}>
                <div style={styles.dashboardTop}>
                  <div style={styles.dashboardLogo}>
                    project / workspace
                  </div>

                  <div style={styles.dashboardUser}>
                    TEAM DASHBOARD
                  </div>
                </div>

                <div style={styles.dashboardBody}>
                  <div style={styles.dashboardTitle}>
                    Projects at a glance.
                  </div>

                  <div style={styles.dashboardText}>
                    Tasks, progress and priorities in one workspace.
                  </div>

                  <div style={styles.stats}>
                    <div style={styles.stat}>
                      <div style={styles.statLabel}>
                        ACTIVE
                      </div>

                      <div style={styles.statValue}>
                        08
                      </div>
                    </div>

                    <div style={styles.stat}>
                      <div style={styles.statLabel}>
                        COMPLETED
                      </div>

                      <div style={styles.statValue}>
                        24
                      </div>
                    </div>

                    <div style={styles.stat}>
                      <div style={styles.statLabel}>
                        TEAM
                      </div>

                      <div style={styles.statValue}>
                        06
                      </div>
                    </div>
                  </div>

                  <div style={styles.taskList}>
                    <div style={styles.task}>
                      <div>
                        <div style={styles.taskTitle}>
                          Website launch
                        </div>

                        <div style={styles.taskText}>
                          Final review and deployment
                        </div>
                      </div>

                      <div style={styles.taskStatus}>
                        In progress
                      </div>
                    </div>

                    <div style={styles.task}>
                      <div>
                        <div style={styles.taskTitle}>
                          Client portal
                        </div>

                        <div style={styles.taskText}>
                          Dashboard and account access
                        </div>
                      </div>

                      <div style={styles.taskStatus}>
                        Review
                      </div>
                    </div>

                    <div style={styles.task}>
                      <div>
                        <div style={styles.taskTitle}>
                          Reporting
                        </div>

                        <div style={styles.taskText}>
                          Weekly performance summary
                        </div>
                      </div>

                      <div style={styles.taskStatus}>
                        Ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.content}>
              <div style={styles.status}>
                WEB APPLICATION
              </div>

              <h3 style={styles.projectTitle}>
                A clearer way to manage the work.
              </h3>

              <p style={styles.description}>
                A responsive project dashboard designed to bring tasks,
                progress, priorities and team activity into one simple
                workspace.
              </p>

              <div style={styles.outcome}>
                Built to give teams a clearer view of what is moving, what
                needs attention and what comes next.
              </div>

              <div style={styles.tags}>
                <span style={styles.tag}>Next.js</span>
                <span style={styles.tag}>React</span>
                <span style={styles.tag}>Supabase</span>
              </div>

              <Link
                href="/projects/dashboard"
                style={getProjectLinkStyle("dashboard")}
                onMouseEnter={() =>
                  setHoveredLink("dashboard")
                }
                onMouseLeave={() =>
                  setHoveredLink(null)
                }
              >
                Explore the project ↗
              </Link>
            </div>
          </article>
        </div>

        <div style={styles.bottom}>
          <div style={styles.line} />

          <Link
            href="/projects"
            style={{
              textDecoration: "none",
            }}
          >
            <div style={styles.circle}>
              ↓
            </div>
          </Link>

          <Link
            href="/projects"
            style={styles.viewLink}
          >
            VIEW ALL PROJECTS
          </Link>
        </div>
      </div>
    </section>
  );
}
