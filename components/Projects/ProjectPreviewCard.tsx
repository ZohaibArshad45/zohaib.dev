"use client";

import { CSSProperties } from "react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
  isMobile?: boolean;
};

export default function ProjectPreviewCard({ project, isMobile = false }: Props) {
  // If project has uploaded pictures, display the real screenshot!
  if (project.images && project.images.length > 0 && project.images[0]) {
    return (
      <div style={styles.imagePreviewWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.images[0]}
          alt={project.title}
          style={styles.imagePreviewTag}
        />
        {project.images.length > 1 && (
          <div style={styles.imageCountBadge}>
            📸 {project.images.length} Screenshots
          </div>
        )}
      </div>
    );
  }

  switch (project.previewType) {
    case "inbox":
      return (
        <div style={styles.inboxWrapper}>
          <div style={styles.inboxCard}>
            <div style={styles.inboxHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={styles.windowDotRed} />
                <span style={styles.windowDotYellow} />
                <span style={styles.windowDotGreen} />
                <span style={styles.inboxTitle}>inbox / ai-triage</span>
              </div>
              <span style={styles.badgeLime}>ACTIVE STREAM</span>
            </div>

            <div style={styles.inboxBody}>
              <div style={styles.inboxItemHighlight}>
                <div style={styles.avatarLime}>AI</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.rowBetween}>
                    <span style={styles.senderName}>Enterprise Lead (Sarah Chen)</span>
                    <span style={styles.itemTime}>Just now</span>
                  </div>
                  <div style={styles.itemSubject}>Urgent: Custom AI Integration Inquiry</div>
                  <div style={styles.itemSummary}>
                    &quot;Looking to automate support triage for 40k monthly users...&quot;
                  </div>
                </div>
                <span style={styles.badgeUrgent}>P1 • HOT LEAD</span>
              </div>

              <div style={styles.inboxItem}>
                <div style={styles.avatarGray}>MK</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.rowBetween}>
                    <span style={styles.senderName}>Marcus Vance (Fintech Ops)</span>
                    <span style={styles.itemTime}>14m ago</span>
                  </div>
                  <div style={styles.itemSubject}>API Webhook Architecture Review</div>
                  <div style={styles.itemSummary}>
                    &quot;Reviewed the n8n data schema, ready for contract signing.&quot;
                  </div>
                </div>
                <span style={styles.badgeNeutral}>DEAL STAGE</span>
              </div>

              <div style={styles.inboxItem}>
                <div style={styles.avatarGray}>JL</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.rowBetween}>
                    <span style={styles.senderName}>Julia Lin (Director)</span>
                    <span style={styles.itemTime}>1h ago</span>
                  </div>
                  <div style={styles.itemSubject}>Project Kickoff Milestone Approved</div>
                  <div style={styles.itemSummary}>
                    &quot;Sprint 1 deliverables verified and accepted.&quot;
                  </div>
                </div>
                <span style={styles.badgeDone}>VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "automation":
      return (
        <div style={styles.automationWrapper}>
          <div style={styles.automationBadge}>EVENT-DRIVEN n8n PIPELINE</div>
          <div
            style={{
              ...styles.workflowGrid,
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            }}
          >
            <div style={styles.nodeCard}>
              <div style={styles.nodeHeader}>
                <div style={{ ...styles.nodeIcon, background: "rgba(255, 117, 94, 0.15)", color: "#ff755e" }}>
                  H
                </div>
                <div>
                  <div style={styles.nodeTitle}>HubSpot CRM</div>
                  <div style={styles.nodeSub}>Deal Won Trigger</div>
                </div>
              </div>
              <div style={styles.nodePill}>Webhook: deal.closed_won</div>
            </div>

            <div style={styles.nodeCardHighlight}>
              <div style={styles.nodeHeader}>
                <div style={{ ...styles.nodeIcon, background: "rgba(202, 255, 70, 0.2)", color: "#caff46" }}>
                  ⚡
                </div>
                <div>
                  <div style={styles.nodeTitle}>n8n Engine</div>
                  <div style={styles.nodeSub}>Data Schema Parser</div>
                </div>
              </div>
              <div style={styles.nodePillLime}>100% Schema Validation</div>
            </div>

            <div style={styles.nodeCard}>
              <div style={styles.nodeHeader}>
                <div style={{ ...styles.nodeIcon, background: "rgba(240, 106, 126, 0.15)", color: "#f06a7e" }}>
                  A
                </div>
                <div>
                  <div style={styles.nodeTitle}>Asana Board</div>
                  <div style={styles.nodeSub}>Auto Project Created</div>
                </div>
              </div>
              <div style={styles.nodePill}>14 Tasks &amp; Dependencies</div>
            </div>
          </div>

          <div style={styles.flowStatusRow}>
            <span style={styles.pulseDot} />
            <span style={styles.flowStatusText}>Sync Latency: 140ms • Zero Drop Guarantee</span>
          </div>
        </div>
      );

    case "dashboard":
      return (
        <div style={styles.dashboardWrapper}>
          <div style={styles.dashboardCard}>
            <div style={styles.dashboardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={styles.windowDotRed} />
                <span style={styles.windowDotYellow} />
                <span style={styles.windowDotGreen} />
                <span style={styles.dashboardTitle}>workspace / live-ops</span>
              </div>
              <span style={styles.badgeLime}>SUPABASE REALTIME</span>
            </div>

            <div style={styles.dashboardStatsRow}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>ACTIVE SPRINTS</div>
                <div style={styles.statNumber}>08</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>COMPLETED</div>
                <div style={styles.statNumber}>24</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>SYNC DELAY</div>
                <div style={{ ...styles.statNumber, color: "#caff46" }}>12ms</div>
              </div>
            </div>

            <div style={styles.taskListing}>
              <div style={styles.taskRow}>
                <div>
                  <div style={styles.taskHeading}>Production Architecture Finalized</div>
                  <div style={styles.taskMeta}>Deployment • Next.js 16 + Supabase</div>
                </div>
                <span style={styles.badgeDone}>COMPLETED</span>
              </div>

              <div style={styles.taskRow}>
                <div>
                  <div style={styles.taskHeading}>Vector Search Retrieval Tuning</div>
                  <div style={styles.taskMeta}>AI Pipeline • Pinecone Hybrid Match</div>
                </div>
                <span style={styles.badgeLime}>IN PROGRESS</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "outreach":
      return (
        <div style={styles.outreachWrapper}>
          <div style={styles.outreachCard}>
            <div style={styles.outreachHeader}>
              <span style={styles.outreachTitle}>AGENT: PROSPECT INTELLIGENCE</span>
              <span style={styles.badgeLime}>CONFIDENCE 98.4%</span>
            </div>

            <div style={styles.agentQueryBox}>
              <div style={styles.agentStep}>
                <span style={styles.agentStepNum}>[01]</span> Crawling domain signals &amp; executive profiles...
              </div>
              <div style={styles.agentStepSuccess}>
                <span style={styles.agentStepNum}>[02]</span> Detected Stack: Next.js, HubSpot, Stripe
              </div>
              <div style={styles.agentStep}>
                <span style={styles.agentStepNum}>[03]</span> Synthesizing customized pain-point angle...
              </div>
            </div>

            <div style={styles.pitchBox}>
              <div style={styles.pitchLabel}>GENERATED OUTREACH ANGLE:</div>
              <div style={styles.pitchText}>
                &quot;Noticed your recent expansion into enterprise accounts. We automated HubSpot-to-delivery pipelines
                saving ops teams 15+ hrs/wk...&quot;
              </div>
            </div>
          </div>
        </div>
      );

    case "code":
      return (
        <div style={styles.codeWrapper}>
          <div style={styles.codeCard}>
            <div style={styles.codeHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={styles.windowDotRed} />
                <span style={styles.windowDotYellow} />
                <span style={styles.windowDotGreen} />
                <span style={styles.codeFileName}>codingskillup / agent-runtime.ts</span>
              </div>
              <span style={styles.badgeLime}>TYPE-SAFE</span>
            </div>

            <div style={styles.codeEditor}>
              <div style={styles.codeLine}>
                <span style={{ color: "#798075" }}>1</span>{" "}
                <span style={{ color: "#f07178" }}>import</span> &#123; agent &#125;{" "}
                <span style={{ color: "#f07178" }}>from</span>{" "}
                <span style={{ color: "#c3e88d" }}>&quot;@codingskillup/ai&quot;</span>;
              </div>
              <div style={styles.codeLine}>
                <span style={{ color: "#798075" }}>2</span>{" "}
                <span style={{ color: "#c792ea" }}>export async function</span>{" "}
                <span style={{ color: "#82aaff" }}>solveTask</span>(input:{" "}
                <span style={{ color: "#ffcb6b" }}>TaskPayload</span>) &#123;
              </div>
              <div style={styles.codeLine}>
                <span style={{ color: "#798075" }}>3</span>{" "}
                &nbsp;&nbsp;<span style={{ color: "#c792ea" }}>const</span> plan ={" "}
                <span style={{ color: "#c792ea" }}>await</span> agent.
                <span style={{ color: "#82aaff" }}>synthesize</span>(input);
              </div>
              <div style={styles.codeLine}>
                <span style={{ color: "#798075" }}>4</span>{" "}
                &nbsp;&nbsp;<span style={{ color: "#c792ea" }}>return</span> plan.
                <span style={{ color: "#82aaff" }}>execute</span>(&#123; zeroLatency:{" "}
                <span style={{ color: "#ff5370" }}>true</span> &#125;);
              </div>
              <div style={styles.codeLine}>
                <span style={{ color: "#798075" }}>5</span> &#125;
              </div>
            </div>

            <div style={styles.terminalBar}>
              <span style={{ color: "#caff46" }}>✓ 45 tests passed</span> • 100% coverage • 0ms cold start
            </div>
          </div>
        </div>
      );

    case "support":
      return (
        <div style={styles.supportWrapper}>
          <div style={styles.supportCard}>
            <div style={styles.supportHeader}>
              <span style={styles.supportTitle}>RAG VECTOR ENGINE • PINECONE</span>
              <span style={styles.badgeLime}>SIMILARITY 0.94</span>
            </div>

            <div style={styles.queryBubble}>
              <div style={styles.queryLabel}>CUSTOMER TICKET:</div>
              <div style={styles.queryContent}>
                &quot;How do I configure role permissions for external contractor accounts?&quot;
              </div>
            </div>

            <div style={styles.ragResultBox}>
              <div style={styles.docRef}>
                <span style={{ color: "#caff46" }}>DOC MATCH:</span> /docs/security/rbac-guide.md#L42
              </div>
              <div style={styles.aiAnswer}>
                &quot;Navigate to Settings → Workspaces → Permissions, then assign the Contractor role with
                read-only sandbox access.&quot;
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

const styles: Record<string, CSSProperties> = {
  inboxWrapper: {
    minHeight: "360px",
    background: "#161b17",
    padding: "24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  inboxCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#f8faf5",
    color: "#121512",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
    fontSize: "12px",
  },
  inboxHeader: {
    padding: "14px 18px",
    background: "#f0f4ec",
    borderBottom: "1px solid #dce2d6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inboxTitle: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    color: "#283025",
  },
  inboxBody: {
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inboxItemHighlight: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    background: "#ffffff",
    borderRadius: "6px",
    border: "1px solid #d4dfc8",
    alignItems: "flex-start",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  inboxItem: {
    display: "flex",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #e7ece2",
    background: "#fafcf8",
    alignItems: "flex-start",
  },
  avatarLime: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#caff46",
    color: "#121512",
    fontWeight: "800",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarGray: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#e0e6db",
    color: "#464d42",
    fontWeight: "700",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  senderName: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#1b211a",
  },
  itemTime: {
    fontSize: "9px",
    color: "#7e867b",
  },
  itemSubject: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#2f362d",
    marginTop: "2px",
  },
  itemSummary: {
    fontSize: "10px",
    color: "#6b7367",
    marginTop: "2px",
  },
  badgeLime: {
    fontSize: "8px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "12px",
    background: "#caff46",
    color: "#121512",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  badgeUrgent: {
    fontSize: "8px",
    fontWeight: "700",
    padding: "3px 7px",
    borderRadius: "12px",
    background: "#ffeedb",
    color: "#c05621",
    whiteSpace: "nowrap",
  },
  badgeNeutral: {
    fontSize: "8px",
    fontWeight: "700",
    padding: "3px 7px",
    borderRadius: "12px",
    background: "#e8eff7",
    color: "#2b6cb0",
    whiteSpace: "nowrap",
  },
  badgeDone: {
    fontSize: "8px",
    fontWeight: "700",
    padding: "3px 7px",
    borderRadius: "12px",
    background: "#e6fffa",
    color: "#234e52",
    whiteSpace: "nowrap",
  },
  windowDotRed: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#ff5f56",
  },
  windowDotYellow: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#ffbd2e",
  },
  windowDotGreen: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#27c93f",
  },

  // Automation
  automationWrapper: {
    minHeight: "360px",
    background: "#131920",
    padding: "28px 24px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  automationBadge: {
    fontSize: "9px",
    color: "#8395a7",
    letterSpacing: "1.5px",
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "700",
  },
  workflowGrid: {
    display: "grid",
    gap: "14px",
    width: "100%",
  },
  nodeCard: {
    background: "#1c2530",
    border: "1px solid #2d3b4a",
    borderRadius: "8px",
    padding: "16px",
    boxSizing: "border-box",
  },
  nodeCardHighlight: {
    background: "#1e2936",
    border: "1px solid #caff46",
    borderRadius: "8px",
    padding: "16px",
    boxSizing: "border-box",
    boxShadow: "0 0 20px rgba(202, 255, 70, 0.12)",
  },
  nodeHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  nodeIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
  },
  nodeTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#ffffff",
  },
  nodeSub: {
    fontSize: "9px",
    color: "#8ca0b3",
  },
  nodePill: {
    fontSize: "9px",
    color: "#8ca0b3",
    background: "#151c24",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #283442",
  },
  nodePillLime: {
    fontSize: "9px",
    color: "#caff46",
    background: "rgba(202, 255, 70, 0.1)",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid rgba(202, 255, 70, 0.3)",
    fontWeight: "600",
  },
  flowStatusRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "24px",
  },
  pulseDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#caff46",
    boxShadow: "0 0 8px #caff46",
  },
  flowStatusText: {
    fontSize: "10px",
    color: "#9db0c2",
    letterSpacing: "0.5px",
  },

  // Dashboard
  dashboardWrapper: {
    minHeight: "360px",
    background: "#1c201d",
    padding: "24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  dashboardCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#111412",
    border: "1px solid #2e3630",
    borderRadius: "8px",
    overflow: "hidden",
  },
  dashboardHeader: {
    padding: "12px 16px",
    background: "#171c18",
    borderBottom: "1px solid #2e3630",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dashboardTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#f0f4f0",
  },
  dashboardStatsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    padding: "16px",
    borderBottom: "1px solid #242b26",
  },
  statBox: {
    background: "#191f1a",
    border: "1px solid #2d362f",
    borderRadius: "6px",
    padding: "10px 12px",
  },
  statLabel: {
    fontSize: "8px",
    color: "#7e8880",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  statNumber: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    marginTop: "4px",
  },
  taskListing: {
    padding: "8px 16px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "#171d18",
    borderRadius: "6px",
    border: "1px solid #263028",
  },
  taskHeading: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#ffffff",
  },
  taskMeta: {
    fontSize: "9px",
    color: "#7e8880",
    marginTop: "2px",
  },

  // Outreach
  outreachWrapper: {
    minHeight: "360px",
    background: "#181a18",
    padding: "24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  outreachCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#101210",
    border: "1px solid #2f362f",
    borderRadius: "8px",
    padding: "18px",
    boxSizing: "border-box",
  },
  outreachHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  outreachTitle: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#ffffff",
  },
  agentQueryBox: {
    background: "#161a16",
    border: "1px solid #2a332a",
    borderRadius: "6px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "14px",
    fontSize: "10px",
    fontFamily: "monospace",
  },
  agentStep: {
    color: "#95a195",
  },
  agentStepSuccess: {
    color: "#caff46",
    fontWeight: "600",
  },
  agentStepNum: {
    color: "#5f6b5f",
  },
  pitchBox: {
    background: "#192019",
    border: "1px solid #364436",
    borderRadius: "6px",
    padding: "12px",
  },
  pitchLabel: {
    fontSize: "8px",
    fontWeight: "700",
    color: "#caff46",
    letterSpacing: "0.8px",
    marginBottom: "4px",
  },
  pitchText: {
    fontSize: "10px",
    color: "#cbd5cb",
    lineHeight: "1.5",
    fontStyle: "italic",
  },

  // Code
  codeWrapper: {
    minHeight: "360px",
    background: "#141715",
    padding: "24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  codeCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#0d0f0e",
    border: "1px solid #2a302b",
    borderRadius: "8px",
    overflow: "hidden",
  },
  codeHeader: {
    padding: "10px 14px",
    background: "#161a17",
    borderBottom: "1px solid #2a302b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeFileName: {
    fontSize: "10px",
    color: "#bac4ba",
    fontFamily: "monospace",
  },
  codeEditor: {
    padding: "16px",
    fontFamily: "monospace",
    fontSize: "11px",
    lineHeight: "1.7",
    background: "#0c0e0d",
  },
  codeLine: {
    whiteSpace: "pre-wrap",
  },
  terminalBar: {
    padding: "10px 14px",
    background: "#141815",
    borderTop: "1px solid #2a302b",
    fontSize: "9px",
    fontFamily: "monospace",
    color: "#8c968c",
  },

  // Support
  supportWrapper: {
    minHeight: "360px",
    background: "#161c18",
    padding: "24px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  supportCard: {
    width: "100%",
    maxWidth: "520px",
    background: "#101411",
    border: "1px solid #2e3b31",
    borderRadius: "8px",
    padding: "18px",
    boxSizing: "border-box",
  },
  supportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  supportTitle: {
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "1px",
    color: "#ffffff",
  },
  queryBubble: {
    background: "#182019",
    border: "1px solid #2f3e31",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "12px",
  },
  queryLabel: {
    fontSize: "8px",
    fontWeight: "700",
    color: "#8b9c8d",
    letterSpacing: "0.8px",
    marginBottom: "4px",
  },
  queryContent: {
    fontSize: "11px",
    color: "#ffffff",
    fontWeight: "500",
  },
  ragResultBox: {
    background: "#1c251e",
    border: "1px solid #3c503f",
    borderRadius: "6px",
    padding: "12px",
  },
  docRef: {
    fontSize: "9px",
    fontFamily: "monospace",
    color: "#8fa392",
    marginBottom: "6px",
  },
  aiAnswer: {
    fontSize: "11px",
    color: "#c2d1c4",
    lineHeight: "1.5",
  },

  // Real Uploaded Images Preview
  imagePreviewWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "260px",
    maxHeight: "340px",
    aspectRatio: "16 / 10",
    background: "#0c0e0c",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  imagePreviewTag: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "top left",
    borderRadius: "8px",
    transition: "transform 0.4s ease",
  },
  imageCountBadge: {
    position: "absolute",
    bottom: "14px",
    right: "14px",
    background: "rgba(10, 15, 12, 0.85)",
    backdropFilter: "blur(8px)",
    color: "#caff46",
    border: "1px solid rgba(202, 255, 70, 0.3)",
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 12px",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    zIndex: 2,
  },
};
