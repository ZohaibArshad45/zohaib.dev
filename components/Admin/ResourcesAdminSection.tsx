"use client";

import { useState, useRef, type CSSProperties, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import type { Resource, ResourceType } from "@/lib/resources";
import { RESOURCE_CATEGORIES } from "@/lib/resources";

const EMPTY_RESOURCE: Resource = {
  id: "",
  slug: "",
  title: "",
  description: "",
  category: "Source Code & Starters",
  type: "code",
  fileUrl: "",
  fileSize: "",
  coverImage: "",
  tags: ["Next.js", "TypeScript"],
  downloadsCount: 0,
  featured: false,
  createdAt: "",
  externalLink: "",
};

interface ResourcesAdminSectionProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}

export default function ResourcesAdminSection({
  resources,
  setResources,
}: ResourcesAdminSectionProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [resourceForm, setResourceForm] = useState<Resource>(EMPTY_RESOURCE);
  const [tagsInput, setTagsInput] = useState<string>("");

  // File Uploading State
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cover Image Uploading State
  const [isCoverUploading, setIsCoverUploading] = useState<boolean>(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Operation State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered resources
  const filtered = resources.filter((r) => {
    const matchesCat =
      categoryFilter === "All" || r.category === categoryFilter;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesSearch =
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setResourceForm({
      ...EMPTY_RESOURCE,
      id: `res-${Date.now().toString(36)}`,
    });
    setTagsInput("Next.js, TypeScript");
    setFileUploadError(null);
    setFileUploadSuccess(null);
    setCoverUploadError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (resource: Resource) => {
    setIsEditing(true);
    setResourceForm(resource);
    setTagsInput(resource.tags ? resource.tags.join(", ") : "");
    setFileUploadError(null);
    setFileUploadSuccess(null);
    setCoverUploadError(null);
    setIsModalOpen(true);
  };

  // Handle Downloadable File Upload (PDF, ZIP, Code)
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileUploading(true);
    setFileUploadError(null);
    setFileUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        // Auto infer type
        const lowerName = file.name.toLowerCase();
        const autoType: ResourceType = lowerName.endsWith(".pdf")
          ? "pdf"
          : lowerName.endsWith(".zip") || lowerName.endsWith(".tar") || lowerName.endsWith(".gz")
          ? "zip"
          : "code";

        setResourceForm((prev) => ({
          ...prev,
          fileUrl: data.url,
          fileSize: data.fileSize || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: autoType,
        }));
        setFileUploadSuccess(`File ready: ${data.fileName || file.name} (${data.fileSize || "Ready"})`);
      } else {
        setFileUploadError(data.message || "Failed to upload file");
      }
    } catch {
      setFileUploadError("Server upload error. Check connection.");
    } finally {
      setIsFileUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCoverUploading(true);
    setCoverUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setResourceForm((prev) => ({
          ...prev,
          coverImage: data.url,
        }));
      } else {
        setCoverUploadError(data.message || "Failed to upload cover image");
      }
    } catch {
      setCoverUploadError("Cover upload error. Please try again.");
    } finally {
      setIsCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  // Save (Create or Update)
  const handleSaveResource = async (e: FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title.trim()) {
      alert("Please provide a resource title.");
      return;
    }

    if (!resourceForm.fileUrl.trim()) {
      alert("Please upload a resource file (PDF or ZIP/code) before saving.");
      return;
    }

    setIsSaving(true);

    const cleanSlug =
      resourceForm.slug?.trim() ||
      resourceForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload: Resource = {
      ...resourceForm,
      slug: cleanSlug,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing) {
        const res = await fetch("/api/admin/resources", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.resource) {
          setResources((prev) =>
            prev.map((r) => (r.id === payload.id ? data.resource : r))
          );
          setIsModalOpen(false);
        } else {
          alert(data.message || "Failed to update resource");
        }
      } else {
        const res = await fetch("/api/admin/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.resource) {
          setResources((prev) => [data.resource, ...prev]);
          setIsModalOpen(false);
        } else {
          alert(data.message || "Failed to create resource");
        }
      }
    } catch {
      alert("Network error while saving resource.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Resource
  const handleDeleteResource = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(data.message || "Failed to delete resource");
      }
    } catch {
      alert("Network error while deleting resource.");
    } finally {
      setDeletingId(null);
    }
  };

  // Copy Direct Link
  const handleCopy = (fileUrl: string, id: string) => {
    const full =
      typeof window !== "undefined"
        ? `${window.location.origin}${fileUrl}`
        : fileUrl;
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeBadge = (type: ResourceType) => {
    switch (type) {
      case "pdf":
        return { label: "PDF", bg: "rgba(239, 68, 68, 0.15)", text: "#f87171" };
      case "code":
        return { label: "CODE", bg: "rgba(202, 255, 70, 0.15)", text: "#caff46" };
      case "zip":
        return { label: "ZIP", bg: "rgba(234, 179, 8, 0.15)", text: "#facc15" };
      default:
        return { label: "GUIDE", bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc" };
    }
  };

  return (
    <div style={styles.section}>
      {/* HEADER & ACTION */}
      <div style={styles.headerRow}>
        <div>
          <h3 style={styles.heading}>Free Developer Resources CMS</h3>
          <p style={styles.subheading}>
            Upload and manage downloadable PDF guides, source code starters,
            and cover thumbnails for your portfolio visitors.
          </p>
        </div>

        <button onClick={handleOpenCreate} style={styles.addBtn}>
          + Add New Resource
        </button>
      </div>

      {/* CONTROLS (SEARCH & FILTERS) */}
      <div style={styles.controlsRow}>
        <input
          type="text"
          placeholder="Search resources by title, description, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Categories</option>
          {RESOURCE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE / CARD LIST */}
      {filtered.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📚</div>
          <h4 style={{ margin: "0 0 6px", color: "#ffffff" }}>No resources found</h4>
          <p style={{ margin: 0, color: "#848f86", fontSize: "14px" }}>
            Add your first PDF or code download using the button above.
          </p>
        </div>
      ) : (
        <div style={styles.resourceList}>
          {filtered.map((item) => {
            const badge = getTypeBadge(item.type);
            const isCopied = copiedId === item.id;
            const isDeleting = deletingId === item.id;

            return (
              <div key={item.id} style={styles.itemCard}>
                {/* OPTIONAL COVER THUMBNAIL */}
                {item.coverImage && (
                  <div style={styles.itemCoverWrapper}>
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      width={120}
                      height={80}
                      style={styles.itemCoverImg}
                    />
                  </div>
                )}

                <div style={styles.itemMain}>
                  <div style={styles.itemHeader}>
                    <span
                      style={{
                        ...styles.formatPill,
                        background: badge.bg,
                        color: badge.text,
                      }}
                    >
                      {badge.label}
                    </span>

                    <span style={styles.categoryPill}>{item.category}</span>

                    {item.featured && (
                      <span style={styles.featuredPill}>★ FEATURED</span>
                    )}

                    <span style={styles.metaSize}>{item.fileSize || "Free"}</span>

                    {typeof item.downloadsCount === "number" && (
                      <span style={styles.downloadsPill}>
                        ⬇ {item.downloadsCount}
                      </span>
                    )}
                  </div>

                  <h4 style={styles.itemTitle}>{item.title}</h4>
                  <p style={styles.itemDescription}>{item.description}</p>

                  <div style={styles.itemMetaRow}>
                    <div style={styles.tagGroup}>
                      {item.tags?.map((t) => (
                        <span key={t} style={styles.tagItem}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div style={styles.fileUrlInfo}>
                      <span style={styles.urlLabel}>File:</span>
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.urlLink}
                      >
                        {item.fileUrl} ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div style={styles.itemActions}>
                  <button
                    onClick={() => handleCopy(item.fileUrl, item.id)}
                    style={styles.actionBtnSecondary}
                    title="Copy direct download link"
                  >
                    {isCopied ? "✓ Copied" : "Copy Link"}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    style={styles.actionBtnPrimary}
                    title="Edit resource"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteResource(item.id, item.title)}
                    disabled={isDeleting}
                    style={styles.actionBtnDanger}
                    title="Delete resource"
                  >
                    {isDeleting ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================= */}
      {/* SIMPLIFIED ADD / EDIT MODAL */}
      {/* ============================================================= */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {isEditing ? "Edit Free Resource" : "Add New Free Resource"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResource} style={styles.modalBody}>
              {/* TITLE */}
              <div>
                <label style={styles.label}>Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 16 SaaS Production Boilerplate"
                  value={resourceForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setResourceForm((prev) => ({
                      ...prev,
                      title,
                    }));
                  }}
                  style={styles.input}
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label style={styles.label}>Category *</label>
                <select
                  value={resourceForm.category}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      category: e.target.value,
                    })
                  }
                  style={styles.input}
                >
                  {RESOURCE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label style={styles.label}>Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what is included in this free download, architecture details, and how to use it..."
                  value={resourceForm.description}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      description: e.target.value,
                    })
                  }
                  style={{ ...styles.input, resize: "vertical" }}
                />
              </div>

              {/* COVER IMAGE UPLOAD (NEW FEATURE) */}
              <div style={styles.coverZone}>
                <div style={styles.coverHeaderRow}>
                  <label style={styles.label}>Cover Image / Thumbnail (Optional)</label>
                  {resourceForm.coverImage && (
                    <button
                      type="button"
                      onClick={() => setResourceForm({ ...resourceForm, coverImage: "" })}
                      style={styles.removeCoverBtn}
                    >
                      Remove Cover ✕
                    </button>
                  )}
                </div>

                {resourceForm.coverImage ? (
                  <div style={styles.coverPreviewCard}>
                    <Image
                      src={resourceForm.coverImage}
                      alt="Cover Preview"
                      width={400}
                      height={180}
                      style={styles.coverPreviewImg}
                    />
                    <div style={styles.coverPreviewMeta}>
                      <span style={styles.coverBadge}>✓ Cover Attached</span>
                      <label htmlFor="resource-cover-upload" style={styles.changeCoverBtn}>
                        Change Image
                      </label>
                    </div>
                  </div>
                ) : (
                  <div style={styles.uploadBox}>
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isCoverUploading}
                      style={styles.fileInputHidden}
                      id="resource-cover-upload"
                    />
                    <label
                      htmlFor="resource-cover-upload"
                      style={styles.uploadCoverLabel}
                    >
                      {isCoverUploading ? (
                        <span>⏳ Uploading cover image...</span>
                      ) : (
                        <span>
                          🖼️ Click to Upload Cover Image / Thumbnail (PNG, JPG, WEBP)
                        </span>
                      )}
                    </label>
                  </div>
                )}
                {coverUploadError && (
                  <p style={styles.uploadErrorText}>✕ {coverUploadError}</p>
                )}
              </div>

              {/* DOWNLOADABLE FILE UPLOAD (PDF, ZIP, CODE) */}
              <div style={styles.uploadZone}>
                <label style={styles.label}>
                  Upload Downloadable File * (PDF, ZIP, or Code up to 50MB)
                </label>
                <div style={styles.uploadBox}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isFileUploading}
                    style={styles.fileInputHidden}
                    id="resource-file-upload"
                  />
                  <label
                    htmlFor="resource-file-upload"
                    style={{
                      ...styles.uploadTriggerLabel,
                      borderColor: resourceForm.fileUrl ? "#caff46" : "#2a342c",
                    }}
                  >
                    {isFileUploading ? (
                      <span>⏳ Uploading file to storage...</span>
                    ) : resourceForm.fileUrl ? (
                      <span>
                        ✓ File Ready: {resourceForm.fileUrl.split("/").pop()} ({resourceForm.fileSize || "Saved"}) — Click to replace
                      </span>
                    ) : (
                      <span>
                        📁 Click to Choose PDF or ZIP File (Auto-formats type &amp; size)
                      </span>
                    )}
                  </label>
                </div>

                {fileUploadSuccess && (
                  <p style={styles.uploadSuccessText}>✓ {fileUploadSuccess}</p>
                )}
                {fileUploadError && (
                  <p style={styles.uploadErrorText}>✕ {fileUploadError}</p>
                )}
              </div>

              {/* EXTERNAL LINK & TAGS */}
              <div style={styles.rowTwo}>
                <div>
                  <label style={styles.label}>GitHub / Source Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/codingskillup/..."
                    value={resourceForm.externalLink || ""}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        externalLink: e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Tech Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Next.js 16, TypeScript, Supabase"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* FEATURED TOGGLE */}
              <div style={styles.checkboxRow}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={resourceForm.featured}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        featured: e.target.checked,
                      })
                    }
                    style={styles.checkbox}
                  />
                  <span>Feature this resource prominently on public page</span>
                </label>
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
                  disabled={isSaving}
                  style={styles.saveBtn}
                >
                  {isSaving
                    ? "Saving..."
                    : isEditing
                    ? "Update Resource"
                    : "Create Resource"}
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
  section: {
    padding: "10px 0 40px",
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "24px",
    gap: "20px",
    flexWrap: "wrap",
  },

  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 6px",
  },

  subheading: {
    fontSize: "14px",
    color: "#8e988f",
    margin: 0,
    maxWidth: "600px",
  },

  addBtn: {
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#caff46",
    color: "#0c0e0d",
    fontSize: "14px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(202, 255, 70, 0.25)",
  },

  controlsRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  searchInput: {
    flex: "1 1 300px",
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#121613",
    border: "1px solid #232924",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },

  filterSelect: {
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#121613",
    border: "1px solid #232924",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },

  emptyCard: {
    padding: "60px 20px",
    textAlign: "center",
    background: "#121613",
    borderRadius: "16px",
    border: "1px dashed #283129",
  },

  resourceList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  itemCard: {
    background: "#131714",
    border: "1px solid #222923",
    borderRadius: "16px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  itemCoverWrapper: {
    width: "120px",
    height: "80px",
    borderRadius: "10px",
    overflow: "hidden",
    flexShrink: 0,
    background: "#1a201b",
    border: "1px solid #28322a",
  },

  itemCoverImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  itemMain: {
    flex: "1 1 380px",
  },

  itemHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    flexWrap: "wrap",
  },

  formatPill: {
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  categoryPill: {
    padding: "3px 8px",
    borderRadius: "6px",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#9aa39b",
    fontSize: "11px",
    fontWeight: "600",
  },

  featuredPill: {
    padding: "3px 8px",
    borderRadius: "6px",
    background: "rgba(202, 255, 70, 0.15)",
    color: "#caff46",
    fontSize: "10px",
    fontWeight: "800",
  },

  metaSize: {
    fontSize: "11px",
    color: "#748076",
  },

  downloadsPill: {
    fontSize: "11px",
    color: "#848f86",
    background: "rgba(0, 0, 0, 0.3)",
    padding: "2px 6px",
    borderRadius: "4px",
  },

  itemTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 6px",
  },

  itemDescription: {
    fontSize: "13px",
    color: "#9aa39c",
    lineHeight: "1.5",
    margin: "0 0 10px",
  },

  itemMetaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },

  tagGroup: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  tagItem: {
    fontSize: "11px",
    color: "#6c786e",
    background: "#0c0f0d",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid #1a201b",
  },

  fileUrlInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
  },

  urlLabel: {
    color: "#6c786e",
  },

  urlLink: {
    color: "#caff46",
    textDecoration: "none",
    maxWidth: "240px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  itemActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginLeft: "auto",
  },

  actionBtnPrimary: {
    padding: "8px 14px",
    borderRadius: "8px",
    background: "#222923",
    color: "#ffffff",
    border: "1px solid #323d34",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  actionBtnSecondary: {
    padding: "8px 14px",
    borderRadius: "8px",
    background: "rgba(202, 255, 70, 0.08)",
    color: "#caff46",
    border: "1px solid rgba(202, 255, 70, 0.2)",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  actionBtnDanger: {
    padding: "8px 14px",
    borderRadius: "8px",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Modal styles
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },

  modalCard: {
    width: "100%",
    maxWidth: "660px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#131714",
    border: "1px solid #28322a",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  modalTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    margin: 0,
  },

  modalCloseBtn: {
    background: "transparent",
    border: "none",
    color: "#848f86",
    fontSize: "18px",
    cursor: "pointer",
  },

  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#9aa39b",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    background: "#0c0e0d",
    border: "1px solid #232924",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  rowTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  coverZone: {
    background: "#0e110f",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid #232a24",
  },

  coverHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "6px",
  },

  removeCoverBtn: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    fontSize: "12px",
    cursor: "pointer",
  },

  coverPreviewCard: {
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #2b352d",
    background: "#161b17",
  },

  coverPreviewImg: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    display: "block",
  },

  coverPreviewMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "#111612",
  },

  coverBadge: {
    fontSize: "12px",
    color: "#caff46",
    fontWeight: "700",
  },

  changeCoverBtn: {
    fontSize: "12px",
    color: "#ffffff",
    cursor: "pointer",
    textDecoration: "underline",
  },

  uploadCoverLabel: {
    display: "block",
    padding: "16px",
    borderRadius: "8px",
    background: "#161c17",
    color: "#9aa39b",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px dashed #2a342c",
    transition: "border-color 0.2s ease, color 0.2s ease",
  },

  uploadZone: {
    background: "#0e110f",
    padding: "16px",
    borderRadius: "10px",
    border: "1px dashed #2b352d",
  },

  uploadBox: {
    position: "relative",
  },

  fileInputHidden: {
    display: "none",
  },

  uploadTriggerLabel: {
    display: "block",
    padding: "16px",
    borderRadius: "8px",
    background: "#161c17",
    color: "#caff46",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid #2a342c",
  },

  uploadSuccessText: {
    fontSize: "12px",
    color: "#4ade80",
    margin: "8px 0 0",
  },

  uploadErrorText: {
    fontSize: "12px",
    color: "#f87171",
    margin: "8px 0 0",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    padding: "4px 0",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    color: "#cbd2cc",
    cursor: "pointer",
  },

  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#caff46",
    cursor: "pointer",
  },

  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    paddingTop: "12px",
    borderTop: "1px solid #1f2520",
  },

  cancelBtn: {
    padding: "10px 18px",
    borderRadius: "8px",
    background: "#1d231e",
    color: "#9aa39b",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },

  saveBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(202, 255, 70, 0.25)",
  },
};
