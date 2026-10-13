"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { type Project, PROJECTS } from "@/lib/projects";

export default function SelectedWork({
  projects: propProjects,
}: {
  projects?: Project[];
}) {
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
      padding: "10px 14px",
      background: "rgba(202, 255, 70, 0.04)",
      borderLeft: "2px solid #caff46",
      borderRadius: "0 6px 6px 0",
      color: "#d7dbd7",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: "1.6",
      maxWidth: "100%",
    },

    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "18px",
    },

    tag: {
      padding: "5px 12px",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "20px",
      fontSize: "11px",
      color: "#e2e8e3",
      background: "rgba(255, 255, 255, 0.03)",
    },

    projectLink: {
      color: "#ffffff",
      textDecoration: "none",
      width: "fit-content",
      paddingBottom: "3px",
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

  const displayProjects =
    propProjects && propProjects.length > 0
      ? propProjects
      : PROJECTS;

  const renderInboxPreview = () => (
    <div style={styles.previewOne}>
      <div style={styles.inbox}>
        <div style={styles.inboxTop}>
          <span style={styles.inboxTitle}>inbox / assistant</span>
          <span style={styles.inboxSmall}>PRODUCT PREVIEW</span>
        </div>

        <div style={styles.inboxBody}>
          <div style={styles.inboxHeading}>Your day, in focus.</div>
          <div style={styles.inboxText}>
            The conversations that need your attention.
          </div>

          <div style={styles.inboxRow}>
            <div style={styles.inboxCircle}>B</div>
            <div>
              <div style={styles.inboxRowTitle}>Project feedback</div>
              <div style={styles.inboxRowText}>
                The next version is ready for review.
              </div>
            </div>
            <div style={styles.badge}>Priority</div>
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
              <div style={styles.inboxRowTitle}>You were mentioned</div>
              <div style={styles.inboxRowText}>
                A question for you in the latest thread.
              </div>
            </div>
            <div style={styles.badge}>Mention</div>
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
              <div style={styles.inboxRowTitle}>Weekly product update</div>
              <div style={styles.inboxRowText}>
                Your team&apos;s progress, in one place.
              </div>
            </div>
            <div style={styles.badge}>Update</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutomationPreview = () => (
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
          <div style={styles.toolName}>HubSpot</div>
          <div style={styles.toolDesc}>New deal</div>
        </div>

        <div style={styles.arrow}>→</div>

        <div style={styles.toolBox}>
          <div
            style={{
              ...styles.toolIcon,
              color: "#ff7171",
            }}
          >
            n8n
          </div>
          <div style={styles.toolName}>Automation</div>
          <div style={styles.toolDesc}>Map deal details</div>
        </div>

        <div style={styles.arrow}>→</div>

        <div style={styles.toolBox}>
          <div
            style={{
              ...styles.toolIcon,
              color: "#ef73bb",
            }}
          >
            A
          </div>
          <div style={styles.toolName}>Asana</div>
          <div style={styles.toolDesc}>Create task</div>
        </div>
      </div>

      <div style={styles.workflowBottom}>
        A connected workflow, from deal to delivery.
      </div>
    </div>
  );

  const renderDashboardPreview = () => (
    <div style={styles.previewThree}>
      <div style={styles.dashboard}>
        <div style={styles.dashboardTop}>
          <div style={styles.dashboardLogo}>project / workspace</div>
          <div style={styles.dashboardUser}>TEAM DASHBOARD</div>
        </div>

        <div style={styles.dashboardBody}>
          <div style={styles.dashboardTitle}>Work in motion.</div>
          <div style={styles.dashboardText}>
            Track progress, requests and active updates.
          </div>

          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Open tasks</div>
              <div style={styles.statValue}>18</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>In progress</div>
              <div style={styles.statValue}>6</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Completed</div>
              <div style={styles.statValue}>42</div>
            </div>
          </div>

          <div style={styles.taskList}>
            <div style={styles.task}>
              <div>
                <div style={styles.taskTitle}>Website launch</div>
                <div style={styles.taskText}>
                  Final review and deployment
                </div>
              </div>
              <div style={styles.taskStatus}>In progress</div>
            </div>

            <div style={styles.task}>
              <div>
                <div style={styles.taskTitle}>Client portal</div>
                <div style={styles.taskText}>
                  Dashboard and account access
                </div>
              </div>
              <div style={styles.taskStatus}>Review</div>
            </div>

            <div style={styles.task}>
              <div>
                <div style={styles.taskTitle}>Reporting</div>
                <div style={styles.taskText}>
                  Weekly performance summary
                </div>
              </div>
              <div style={styles.taskStatus}>Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGenericPreview = (project: Project) => (
    <div
      style={{
        minHeight: isMobile ? "320px" : "420px",
        background: "linear-gradient(135deg, #18221b 0%, #0e1510 100%)",
        padding: isMobile ? "24px 18px" : "36px 32px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(18, 22, 19, 0.95)",
          borderRadius: "10px",
          border: "1px solid #2d382e",
          boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #232d24",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#111713",
          }}
        >
          <div style={{ display: "flex", gap: "6px" }}>
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#ff5f56",
              }}
            />
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            />
            <span
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#27c93f",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "#8a948c",
              fontFamily: "monospace",
            }}
          >
            {project.slug}.ts
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "#caff46",
              fontWeight: "700",
            }}
          >
            SYSTEM
          </span>
        </div>

        <div style={{ padding: "20px 22px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#caff46",
              fontWeight: "700",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            {`${project.number || "01"} // ${project.categories?.join(" • ") || "CUSTOM SYSTEM"}`}
          </div>
          <div
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: "700",
              color: "#f5f6f4",
              marginBottom: "8px",
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#9ca59e",
              lineHeight: "1.6",
              marginBottom: "16px",
            }}
          >
            {project.subhead || project.description.slice(0, 110) + "..."}
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(
                  project.metrics.length,
                  2
                )}, 1fr)`,
                gap: "10px",
                paddingTop: "12px",
                borderTop: "1px solid #232d24",
              }}
            >
              {project.metrics.slice(0, 2).map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "#121814",
                    border: "1px solid #283329",
                    borderRadius: "6px",
                    padding: "8px 10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#caff46",
                    }}
                  >
                    {m.value}
                  </div>
                  <div style={{ fontSize: "10px", color: "#8a948c" }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjectPreview = (project: Project) => {
    if (project.images && project.images.length > 0 && project.images[0]) {
      return (
        <div
          style={{
            minHeight: isMobile ? "280px" : "400px",
            background: "linear-gradient(145deg, #121713 0%, #171d18 100%)",
            padding: isMobile ? "16px 14px" : "24px 22px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: "absolute",
              width: "260px",
              height: "260px",
              background: "radial-gradient(circle, rgba(202, 255, 70, 0.08) 0%, transparent 70%)",
              top: "10%",
              left: "15%",
              pointerEvents: "none",
            }}
          />

          {/* Browser / App Window Mockup */}
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#161b17",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 22px 50px rgba(0, 0, 0, 0.55), 0 0 20px rgba(202, 255, 70, 0.04)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.35s ease, border-color 0.35s ease",
              transform: hoveredProject === project.slug ? "scale(1.02)" : "scale(1)",
            }}
          >
            {/* Window Title Bar */}
            <div
              style={{
                height: "32px",
                background: "#1c231e",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ff5f56", display: "inline-block" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#27c93f", display: "inline-block" }} />
              </div>

              {/* URL / System Pill */}
              <div
                style={{
                  fontSize: "10px",
                  color: "#9ca59e",
                  fontFamily: "monospace",
                  background: "rgba(0, 0, 0, 0.25)",
                  padding: "2px 12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  maxWidth: "180px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.demoUrl ? project.demoUrl.replace(/^https?:\/\//, "") : `${project.slug}.app`}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#caff46" }} />
                <span style={{ fontSize: "9px", color: "#caff46", fontWeight: "600", letterSpacing: "0.5px" }}>LIVE</span>
              </div>
            </div>

            {/* Screenshot Screen Container */}
            <div
              style={{
                width: "100%",
                aspectRatio: "16 / 10",
                maxHeight: "340px",
                overflow: "hidden",
                position: "relative",
                background: "#0d100e",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.images[0]}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top left",
                  display: "block",
                  transition: "transform 0.4s ease",
                  transform: hoveredProject === project.slug ? "scale(1.03)" : "scale(1)",
                }}
              />
            </div>
          </div>

          {/* Overlay Badges */}
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "10px" : "16px",
              left: isMobile ? "12px" : "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 3,
            }}
          >
            <span
              style={{
                fontSize: "11px",
                background: "rgba(12, 14, 13, 0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(202, 255, 70, 0.35)",
                color: "#caff46",
                padding: "4px 11px",
                borderRadius: "20px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              {project.number || "01"} • SHOWCASE
            </span>
            {project.images.length > 1 && (
              <span
                style={{
                  fontSize: "11px",
                  background: "rgba(12, 14, 13, 0.85)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#e0e6e1",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                +{project.images.length - 1} photos
              </span>
            )}
          </div>
        </div>
      );
    }

    if (project.previewType === "inbox" || project.slug === "inbox") {
      return renderInboxPreview();
    }

    if (
      project.previewType === "automation" ||
      project.slug === "automation"
    ) {
      return renderAutomationPreview();
    }

    if (
      project.previewType === "dashboard" ||
      project.slug === "dashboard"
    ) {
      return renderDashboardPreview();
    }

    return renderGenericPreview(project);
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
            A closer look at products, systems and workflows built around
            practical business needs.
          </p>
        </div>

        <div style={styles.projects}>
          {displayProjects.length === 0 ? (
            <div
              style={{
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
                No projects published yet in the database.
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
                + Add Your First Project in Admin ↗
              </Link>
            </div>
          ) : (
            displayProjects.slice(0, 4).map((project) => (
              <article
                key={project.slug}
                style={getCardStyle(project.slug)}
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
              >
              {renderProjectPreview(project)}

              <div style={styles.content}>
                <div style={styles.status}>
                  {project.status.toUpperCase()}
                </div>

                <h3 style={styles.projectTitle}>
                  {project.headline || project.title}
                </h3>

                <p style={styles.description}>
                  {project.description}
                </p>

                {project.outcome && (
                  <div style={styles.outcome}>
                    {project.outcome}
                  </div>
                )}

                {project.tags && project.tags.length > 0 && (
                  <div style={styles.tags}>
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
                  <Link
                    href={`/projects/${project.slug}`}
                    style={getProjectLinkStyle(project.slug)}
                    onMouseEnter={() => setHoveredLink(project.slug)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    Explore Case Study ↗
                  </Link>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#caff46",
                        textDecoration: "none",
                        paddingBottom: "4px",
                      }}
                    >
                      Live Demo ↗
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#a4aca6",
                        textDecoration: "none",
                        paddingBottom: "4px",
                      }}
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          )))}
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
