"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import type { UpcomingProject, UpcomingStatus } from "@/lib/upcoming";
import { UPCOMING_CATEGORIES } from "@/lib/upcoming";

const EMPTY_UPCOMING: UpcomingProject = {
  id: "",
  slug: "",
  number: "01",
  title: "",
  shortTitle: "",
  category: "AI Agents",
  status: "In Development",
  targetRelease: "Q1 2027",
  progress: 50,
  priority: "High",
  headline: "",
  description: "",
  problem: "",
  solution: "",
  techStack: ["Next.js", "TypeScript", "OpenAI", "Supabase"],
  keyFeatures: [
    "Authentication & User Accounts",
    "Operations Dashboard",
    "Dark Mode Glassmorphic UI",
    "Stripe Subscription Billing",
    "AI Agent Function Calling",
    "PostgreSQL Relational DB",
    "Role Based Access Control",
    "Cloud Edge Deployment"
  ],
  architectureHighlights: [],
  deliverables: [],
  previewType: "dashboard",
  waitlistCount: 0,
};

interface UpcomingAdminSectionProps {
  upcomingProjects: UpcomingProject[];
  setUpcomingProjects: React.Dispatch<React.SetStateAction<UpcomingProject[]>>;
}

export default function UpcomingAdminSection({
  upcomingProjects,
  setUpcomingProjects,
}: UpcomingAdminSectionProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form, setForm] = useState<UpcomingProject>(EMPTY_UPCOMING);

  // Simplified text inputs for arrays
  const [techStackInput, setTechStackInput] = useState<string>("");
  const [keyFeaturesInput, setKeyFeaturesInput] = useState<string>("");
  const [deliverablesInput, setDeliverablesInput] = useState<string>("");

  // Loading & notification states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const statuses: (UpcomingStatus | "All")[] = [
    "All",
    "Planning",
    "In Development",
    "Prototype",
    "Beta Testing",
    "Ready for Launch",
  ];

  const filtered = upcomingProjects.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || p.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openAddModal = () => {
    const nextNumber =
      upcomingProjects.length + 1 < 10
        ? `0${upcomingProjects.length + 1}`
        : `${upcomingProjects.length + 1}`;

    setForm({
      ...EMPTY_UPCOMING,
      id: `up-${Date.now()}`,
      number: nextNumber,
    });
    setTechStackInput(EMPTY_UPCOMING.techStack.join(", "));
    setKeyFeaturesInput(EMPTY_UPCOMING.keyFeatures.join("\n"));
    setDeliverablesInput("");
    setIsEditing(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: UpcomingProject) => {
    setForm(project);
    setTechStackInput(project.techStack.join(", "));
    setKeyFeaturesInput((project.keyFeatures || []).join("\n"));
    setDeliverablesInput((project.deliverables || []).join("\n"));
    setIsEditing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (idOrSlug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/upcoming?id=${encodeURIComponent(idOrSlug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUpcomingProjects((prev) =>
          prev.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug)
        );
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch {
      alert("Network error while deleting upcoming project");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const parsedTechStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedFeatures = keyFeaturesInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const parsedDeliverables = deliverablesInput
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const generatedSlug = (form.slug || form.title)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const payload: UpcomingProject = {
      ...form,
      slug: generatedSlug,
      shortTitle: form.shortTitle || form.title,
      headline: form.headline || form.title,
      techStack: parsedTechStack,
      keyFeatures: parsedFeatures,
      deliverables: parsedDeliverables,
      progress: Number(form.progress) || 0,
    };

    try {
      if (isEditing) {
        const res = await fetch("/api/admin/upcoming", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.upcomingProject) {
          setUpcomingProjects((prev) =>
            prev.map((p) =>
              p.id === payload.id || p.slug === payload.slug
                ? data.upcomingProject
                : p
            )
          );
          setSuccessMsg("Upcoming project updated successfully!");
          setTimeout(() => setIsModalOpen(false), 900);
        } else {
          setErrorMsg(data.message || "Failed to update upcoming project");
        }
      } else {
        const res = await fetch("/api/admin/upcoming", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.upcomingProject) {
          setUpcomingProjects((prev) => [data.upcomingProject, ...prev]);
          setSuccessMsg("Upcoming project created successfully!");
          setTimeout(() => setIsModalOpen(false), 900);
        } else {
          setErrorMsg(data.message || "Failed to create upcoming project");
        }
      }
    } catch {
      setErrorMsg("Connection error. Could not save to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Beta Testing":
        return { bg: "rgba(126, 217, 87, 0.15)", text: "#7ed957", border: "#7ed957" };
      case "Ready for Launch":
        return { bg: "rgba(202, 255, 70, 0.18)", text: "#caff46", border: "#caff46" };
      case "In Development":
        return { bg: "rgba(255, 179, 71, 0.15)", text: "#ffb347", border: "#ffb347" };
      case "Prototype":
        return { bg: "rgba(147, 112, 219, 0.15)", text: "#bb9af7", border: "#bb9af7" };
      default:
        return { bg: "rgba(100, 149, 237, 0.15)", text: "#7aa2f7", border: "#7aa2f7" };
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER & TOP STATS */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.eyebrow}>ROADMAP &amp; LAB MANAGEMENT</div>
          <h2 style={styles.sectionHeading}>Upcoming Projects</h2>
          <p style={styles.sectionDesc}>
            Manage in-flight AI agents, SaaS roadmaps, and prototypes displayed on the public /upcoming page.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          style={styles.primaryAddBtn}
        >
          <span>+ Add Upcoming Project</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricVal}>
            {upcomingProjects.length < 10
              ? `0${upcomingProjects.length}`
              : upcomingProjects.length}
          </div>
          <div style={styles.metricLabel}>Total Roadmaps</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricVal}>
            {
              upcomingProjects.filter((p) => p.status === "In Development")
                .length
            }
          </div>
          <div style={styles.metricLabel}>In Active Dev</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricVal}>
            {
              upcomingProjects.filter((p) => p.status === "Beta Testing")
                .length
            }
          </div>
          <div style={styles.metricLabel}>In Beta Testing</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricVal}>
            {upcomingProjects.length > 0
              ? `${Math.round(
                  upcomingProjects.reduce((a, b) => a + (b.progress || 0), 0) /
                    upcomingProjects.length
                )}%`
              : "0%"}
          </div>
          <div style={styles.metricLabel}>Average Progress</div>
        </div>
      </div>

      {/* CONTROLS (SEARCH & FILTERS) */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, description, or slug..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.selectGroup}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.selectInput}
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={styles.selectInput}
          >
            {UPCOMING_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PROJECTS TABLE / CARDS */}
      {filtered.length === 0 ? (
        <div style={styles.emptyNotice}>
          <p style={{ color: "#8a948c", margin: "0 0 14px", fontSize: "14px" }}>
            No upcoming projects found matching current criteria.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            style={styles.secondaryActionBtn}
          >
            + Create First Upcoming Project
          </button>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Title &amp; Category</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Progress</th>
                <th style={styles.th}>Target Release</th>
                <th style={styles.th}>Priority</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((proj) => {
                const badge = getStatusBadge(proj.status);
                return (
                  <tr key={proj.id || proj.slug} style={styles.tableRow}>
                    <td style={styles.tdNum}>{proj.number}</td>
                    <td style={styles.td}>
                      <div style={styles.rowTitle}>{proj.title}</div>
                      <div style={styles.rowSub}>
                        <span>{proj.category}</span>
                        <span>•</span>
                        <span style={{ color: "#7a857b" }}>/{proj.slug}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusChip,
                          background: badge.bg,
                          color: badge.text,
                          borderColor: badge.border,
                        }}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.progressCell}>
                        <div style={styles.progressMiniTrack}>
                          <div
                            style={{
                              ...styles.progressMiniFill,
                              width: `${proj.progress}%`,
                            }}
                          />
                        </div>
                        <span style={styles.progressPercent}>
                          {proj.progress}%
                        </span>
                      </div>
                    </td>
                    <td style={styles.tdRelease}>{proj.targetRelease}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.priorityChip,
                          color:
                            proj.priority === "Critical"
                              ? "#ff6b6b"
                              : proj.priority === "High"
                              ? "#caff46"
                              : "#9aa5b1",
                        }}
                      >
                        {proj.priority}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={styles.actionsBtnGroup}>
                        <button
                          type="button"
                          onClick={() => openEditModal(proj)}
                          style={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(proj.id || proj.slug, proj.title)}
                          style={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            style={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalHeading}>
                  {isEditing ? "Edit Upcoming Project" : "Add Upcoming Project"}
                </h3>
                <p style={styles.modalSub}>
                  Changes save to Supabase and the local project registry.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={styles.modalClose}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {errorMsg && <div style={styles.errorAlert}>{errorMsg}</div>}
              {successMsg && <div style={styles.successAlert}>{successMsg}</div>}

              {/* ROW 1: Title & Number */}
              <div style={styles.formRow2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Project Title <span style={{ color: "#caff46" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Autonomous SDR & Realtime Calling Agent"
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.formGroup, maxWidth: "100px" }}>
                  <label style={styles.label}>Number</label>
                  <input
                    type="text"
                    value={form.number}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, number: e.target.value }))
                    }
                    placeholder="01"
                    style={styles.input}
                  />
                </div>
              </div>

              {/* ROW 2: Slug & Category */}
              <div style={styles.formRow2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Slug (URL identifier)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="e.g. autonomous-sdr-voice-agent"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    style={styles.input}
                  >
                    {UPCOMING_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ROW 3: Status, Target Release & Priority */}
              <div style={styles.formRow3}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as UpcomingStatus,
                      }))
                    }
                    style={styles.input}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Development">In Development</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Beta Testing">Beta Testing</option>
                    <option value="Ready for Launch">Ready for Launch</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Target Release</label>
                  <input
                    type="text"
                    value={form.targetRelease}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        targetRelease: e.target.value,
                      }))
                    }
                    placeholder="e.g. Q1 2027 or November 2026"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        priority: e.target.value as UpcomingProject["priority"],
                      }))
                    }
                    style={styles.input}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              {/* ROW 4: Progress Slider */}
              <div style={styles.formGroup}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <label style={styles.label}>
                    Development Progress:{" "}
                    <strong style={{ color: "#caff46" }}>
                      {form.progress}%
                    </strong>
                  </label>
                  <span style={{ fontSize: "11px", color: "#8a948c" }}>
                    Drag slider (0 - 100)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={form.progress}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      progress: Number(e.target.value),
                    }))
                  }
                  style={styles.rangeInput}
                />
              </div>

              {/* DESCRIPTION */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Detailed Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Overview of the autonomous agent or SaaS product..."
                  style={styles.textarea}
                />
              </div>

              {/* PROBLEM & SOLUTION */}
              <div style={styles.formRow2}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>The Problem / Challenge</label>
                  <textarea
                    rows={3}
                    value={form.problem}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, problem: e.target.value }))
                    }
                    placeholder="What real business problem does this solve?"
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>The AI Solution Architecture</label>
                  <textarea
                    rows={3}
                    value={form.solution}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, solution: e.target.value }))
                    }
                    placeholder="How does AI / n8n / Next.js solve it?"
                    style={styles.textarea}
                  />
                </div>
              </div>

              {/* TECH STACK */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Tech Stack (comma-separated tags)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="Next.js 16, OpenAI Realtime API, Twilio, WebSockets, Supabase"
                  style={styles.input}
                />
              </div>

              {/* KEY SAAS FEATURES */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Key Features &amp; SaaS Checkpoints (one per line)
                </label>
                <textarea
                  rows={4}
                  value={keyFeaturesInput}
                  onChange={(e) => setKeyFeaturesInput(e.target.value)}
                  placeholder="Authentication&#10;Dark Mode&#10;Stripe Billing&#10;PostgreSQL Database&#10;RBAC Roles"
                  style={styles.textarea}
                />
              </div>

              {/* DELIVERABLES & MILESTONES */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Planned Deliverables &amp; Milestones (one per line)
                </label>
                <textarea
                  rows={3}
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  placeholder="Live WebRTC stream audio console&#10;Twilio webhook call forwarder&#10;Automated calendar appointment sync"
                  style={styles.textarea}
                />
              </div>

              {/* MODAL FOOTER */}
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={styles.submitBtn}
                >
                  {isSubmitting
                    ? "Saving to Database..."
                    : isEditing
                    ? "Update Project"
                    : "Publish Upcoming Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    padding: "8px 0 40px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  eyebrow: {
    fontSize: "11px",
    color: "#caff46",
    letterSpacing: "1.2px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  sectionHeading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 8px",
  },
  sectionDesc: {
    fontSize: "14px",
    color: "#9aa39c",
    margin: 0,
    maxWidth: "680px",
  },
  primaryAddBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 0 16px rgba(202, 255, 70, 0.25)",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },
  metricCard: {
    background: "#121714",
    border: "1px solid #232c25",
    borderRadius: "12px",
    padding: "16px 20px",
  },
  metricVal: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "4px",
  },
  metricLabel: {
    fontSize: "11px",
    color: "#8a948c",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: "1 1 300px",
  },
  searchInput: {
    width: "100%",
    background: "#121714",
    border: "1px solid #242d26",
    padding: "10px 14px",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  selectGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  selectInput: {
    background: "#121714",
    border: "1px solid #242d26",
    color: "#c4cdc6",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
  },
  emptyNotice: {
    padding: "60px 20px",
    textAlign: "center",
    background: "rgba(18, 23, 20, 0.4)",
    border: "1px dashed #242d26",
    borderRadius: "12px",
  },
  secondaryActionBtn: {
    background: "rgba(202, 255, 70, 0.12)",
    color: "#caff46",
    border: "1px solid #caff46",
    padding: "8px 18px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  tableWrap: {
    background: "#121714",
    border: "1px solid #222a24",
    borderRadius: "14px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    textAlign: "left",
  },
  tableHeaderRow: {
    borderBottom: "1px solid #1f2721",
    background: "#151b17",
  },
  th: {
    padding: "14px 18px",
    color: "#8a948c",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontWeight: "700",
  },
  tableRow: {
    borderBottom: "1px solid #1a221c",
  },
  tdNum: {
    padding: "16px 18px",
    color: "#caff46",
    fontWeight: "800",
    fontSize: "12px",
  },
  td: {
    padding: "16px 18px",
    verticalAlign: "middle",
  },
  tdRelease: {
    padding: "16px 18px",
    color: "#c4cdc6",
    fontWeight: "500",
  },
  rowTitle: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "4px",
  },
  rowSub: {
    display: "flex",
    gap: "8px",
    fontSize: "11px",
    color: "#9aa39c",
  },
  statusChip: {
    display: "inline-block",
    padding: "3px 9px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "700",
    border: "1px solid",
  },
  progressCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  progressMiniTrack: {
    width: "70px",
    height: "6px",
    background: "#1f2721",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressMiniFill: {
    height: "100%",
    background: "#caff46",
    borderRadius: "3px",
  },
  progressPercent: {
    fontSize: "12px",
    color: "#caff46",
    fontWeight: "700",
    minWidth: "32px",
  },
  priorityChip: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  actionsBtnGroup: {
    display: "inline-flex",
    gap: "8px",
  },
  editBtn: {
    background: "#1b231d",
    border: "1px solid #2d3b30",
    color: "#ffffff",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteBtn: {
    background: "rgba(224, 86, 86, 0.12)",
    border: "1px solid rgba(224, 86, 86, 0.3)",
    color: "#ff6b6b",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalDialog: {
    background: "#111613",
    border: "1px solid #2e3b31",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "760px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.8)",
  },
  modalHeader: {
    padding: "24px 28px",
    borderBottom: "1px solid #1f2721",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalHeading: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 4px",
  },
  modalSub: {
    fontSize: "12px",
    color: "#8a948c",
    margin: 0,
  },
  modalClose: {
    background: "transparent",
    border: "none",
    color: "#8a948c",
    fontSize: "16px",
    cursor: "pointer",
    padding: "4px",
  },
  form: {
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  errorAlert: {
    padding: "12px 16px",
    background: "rgba(224, 86, 86, 0.15)",
    border: "1px solid rgba(224, 86, 86, 0.4)",
    borderRadius: "8px",
    color: "#ff6b6b",
    fontSize: "13px",
  },
  successAlert: {
    padding: "12px 16px",
    background: "rgba(202, 255, 70, 0.15)",
    border: "1px solid rgba(202, 255, 70, 0.4)",
    borderRadius: "8px",
    color: "#caff46",
    fontSize: "13px",
  },
  formRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  formRow3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "14px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#b0b9b2",
  },
  input: {
    background: "#161c18",
    border: "1px solid #28342a",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  textarea: {
    background: "#161c18",
    border: "1px solid #28342a",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: "100%",
  },
  rangeInput: {
    width: "100%",
    accentColor: "#caff46",
    cursor: "pointer",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    paddingTop: "14px",
    borderTop: "1px solid #1f2721",
  },
  cancelBtn: {
    background: "#1a211c",
    border: "1px solid #2b382d",
    color: "#c4cdc6",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitBtn: {
    background: "#caff46",
    border: "none",
    color: "#0c0e0d",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
  },
};
