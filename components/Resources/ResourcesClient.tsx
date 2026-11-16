"use client";

import Link from "next/link";
import Image from "next/image";
import { Download, FileText, Search, X } from "lucide-react";
import { useState, useMemo, type CSSProperties } from "react";
import SiteFooter from "@/components/MainPage/SiteFooter";
import type { Resource } from "@/lib/resources";

interface ResourcesClientProps {
  initialResources: Resource[];
}

export default function ResourcesClient({
  initialResources,
}: ResourcesClientProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredCopyId, setHoveredCopyId] = useState<string | null>(null);
  const [hoveredExternalId, setHoveredExternalId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialResources.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ["All", ...Array.from(set)];
  }, [initialResources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        resource.title.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q) ||
        resource.category.toLowerCase().includes(q) ||
        resource.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [resources, selectedCategory, searchQuery]);

  // Handle Download and increment counter
  const handleDownload = async (resource: Resource) => {
    setDownloadingId(resource.id);

    try {
      // Trigger API to update download count
      fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resource.id }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && typeof data.downloadsCount === "number") {
            setResources((prev) =>
              prev.map((r) =>
                r.id === resource.id
                  ? { ...r, downloadsCount: data.downloadsCount }
                  : r
              )
            );
          }
        })
        .catch(() => {});

      // Trigger actual browser download
      const link = document.createElement("a");
      link.href = resource.fileUrl;
      link.download = resource.fileUrl.split("/").pop() || "resource";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  // Copy Link to clipboard
  const handleCopyLink = (resource: Resource) => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${resource.fileUrl}`
        : resource.fileUrl;

    navigator.clipboard.writeText(fullUrl);
    setCopiedId(resource.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getFormatBadgeColor = (type: Resource["type"]) => {
    switch (type) {
      case "pdf":
        return {
          bg: "rgba(239, 68, 68, 0.12)",
          border: "rgba(239, 68, 68, 0.35)",
          text: "#f87171",
          label: "PDF GUIDE",
        };
      case "code":
      case "zip":
        return {
      bg: "rgba(49, 91, 199, 0.08)",
          border: "rgba(49, 91, 199, 0.22)",
          text: "#315bc7",
          label: type === "zip" ? "ZIP ARCHIVE" : "SOURCE CODE",
        };
      case "template":
        return {
          bg: "rgba(59, 130, 246, 0.12)",
          border: "rgba(59, 130, 246, 0.35)",
          text: "#60a5fa",
          label: "TEMPLATE",
        };
      default:
        return {
          bg: "rgba(168, 85, 247, 0.12)",
          border: "rgba(168, 85, 247, 0.35)",
          text: "#c084fc",
          label: "PLAYBOOK",
        };
    }
  };

  return (
    <div style={styles.page}>
      <main id="top" style={styles.main}>
        {/* HERO SECTION */}
        <section style={styles.heroSection}>
          <div style={styles.container}>
            <div style={styles.badgeWrapper}>
              <span style={styles.eyebrowBadge}>
                DEVELOPER RESOURCES
              </span>
            </div>

            <h1 style={styles.heroTitle}>
              Practical guides and <br />
              <span style={styles.heroGradient}>developer resources</span>
            </h1>

            <p style={styles.heroSubtitle}>
              Notes, templates and code for building and maintaining software.
              Browse the collection and download anything useful for your work.
            </p>

            <p style={{ margin: "28px 0 0", color: "#727882", fontSize: "14px" }}>
              {resources.length} {resources.length === 1 ? "resource" : "resources"}
            </p>
          </div>
        </section>

        {/* CONTROLS: SEARCH & CATEGORY PILLS */}
        <section style={styles.controlsSection}>
          <div style={styles.container}>
            <div style={styles.controlsBar}>
              {/* Search Bar */}
              <div style={styles.searchWrapper}>
                <Search size={18} strokeWidth={1.75} style={styles.searchIcon} aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search resources, topics (e.g. Next.js, AI, Supabase)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={styles.clearSearchBtn}
                    aria-label="Clear search"
                  >
                    <X size={16} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div style={styles.categoryPills}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        ...styles.catButton,
                        ...(isSelected ? styles.catButtonActive : {}),
                      }}
                    >
                      {cat}
                      {cat === "All" && ` (${resources.length})`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* RESOURCES GRID */}
        <section style={styles.gridSection}>
          <div style={styles.container}>
            {filteredResources.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📦</div>
                <h3 style={styles.emptyTitle}>No matching resources found</h3>
                <p style={styles.emptySub}>
                  Try clearing your search query or choosing a different
                  category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  style={styles.resetBtn}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredResources.map((resource) => {
                  const badge = getFormatBadgeColor(resource.type);
                  const isCopied = copiedId === resource.id;
                  const isDownloading = downloadingId === resource.id;
                  const isHovered = hoveredCardId === resource.id;

                  return (
                    <div
                      key={resource.id}
                      onMouseEnter={() => setHoveredCardId(resource.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      style={{
                        ...styles.card,
                        transform: isHovered
                          ? "translateY(-2px)"
                          : "translateY(0)",
                        borderColor: isHovered
                          ? "rgba(49, 91, 199, 0.22)"
                          : "#e2dfd5",
                        boxShadow: isHovered
                          ? "0 12px 28px rgba(0, 0, 0, 0.24)"
                          : "none",
                        background: "#ffffff",
                      }}
                    >
                      {/* COVER IMAGE THUMBNAIL */}
                      {resource.coverImage && (
                        <div
                          style={{
                            ...styles.coverThumbnailWrapper,
                            borderColor: isHovered
                              ? "rgba(49, 91, 199, 0.2)"
                              : "#e2dfd5",
                            boxShadow: isHovered
                              ? "0 8px 24px rgba(0, 0, 0, 0.5)"
                              : "none",
                          }}
                        >
                          <Image
                            src={resource.coverImage}
                            alt={resource.title}
                            width={420}
                            height={210}
                            style={{
                              ...styles.coverThumbnailImg,
                              transform: isHovered ? "scale(1.06)" : "scale(1)",
                              filter: isHovered
                                ? "brightness(1.05)"
                                : "brightness(1)",
                            }}
                          />
                        </div>
                      )}

                      {/* TOP BADGE ROW */}
                      <div style={styles.cardTop}>
                        <div style={styles.badgeGroup}>
                          <span
                            style={{
                              ...styles.formatBadge,
                              backgroundColor: badge.bg,
                              borderColor: badge.border,
                              color: badge.text,
                            }}
                          >
                            {badge.label}
                          </span>

                          <span style={styles.categoryBadge}>
                            {resource.category}
                          </span>
                        </div>

                        {resource.featured && (
                          <span style={styles.featuredBadge}>
                            ★ FEATURED
                          </span>
                        )}
                      </div>

                      {/* TITLE & DESCRIPTION */}
                      <h2
                        style={{
                          ...styles.cardTitle,
                          color: isHovered ? "#315bc7" : "#202329",
                          transition: "color 0.25s ease",
                        }}
                      >
                        {resource.title}
                      </h2>
                      <p style={styles.cardDescription}>
                        {resource.description}
                      </p>

                      {/* TAGS */}
                      {resource.tags && resource.tags.length > 0 && (
                        <div style={styles.tagList}>
                          {resource.tags.map((tag) => (
                            <span key={tag} style={styles.tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* FOOTER INFO: SIZE & DOWNLOADS */}
                      <div style={styles.cardMeta}>
                        <div style={styles.metaItem}>
                          <FileText size={14} aria-hidden="true" />
                          <span>{resource.fileSize || "Free Download"}</span>
                        </div>

                        {typeof resource.downloadsCount === "number" && (
                          <div style={styles.metaItem}>
                          <Download size={14} aria-hidden="true" />
                            <span>{resource.downloadsCount} downloads</span>
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div style={styles.cardActions}>
                        <button
                          onClick={() => handleDownload(resource)}
                          disabled={isDownloading}
                          style={{
                            ...styles.downloadBtn,
                            transform: isHovered
                              ? "translateY(-2px)"
                              : "translateY(0)",
                            boxShadow: isHovered
                              ? "0 8px 18px rgba(49, 91, 199, 0.18)"
                              : "none",
                          }}
                          title="Download Resource"
                        >
                          {isDownloading ? (
                            <>
                              <span style={styles.btnSpinner} />
                              Starting...
                            </>
                          ) : (
                            <>
                              <span>Download Free</span>
                              <span style={styles.btnArrow}>↓</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopyLink(resource)}
                          onMouseEnter={() => setHoveredCopyId(resource.id)}
                          onMouseLeave={() => setHoveredCopyId(null)}
                          style={{
                            ...styles.copyBtn,
                            borderColor:
                              hoveredCopyId === resource.id
                                ? "#315bc7"
                                : "#e2dfd5",
                            color:
                              hoveredCopyId === resource.id
                                ? "#dfe6fb"
                                : "#48505a",
                            background:
                              hoveredCopyId === resource.id
                                ? "rgba(49, 91, 199, 0.06)"
                                : "#ffffff",
                          }}
                          title="Copy Download Link"
                        >
                          {isCopied ? "✓ Copied" : "Copy Link"}
                        </button>

                        {resource.externalLink && (
                          <a
                            href={resource.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() =>
                              setHoveredExternalId(resource.id)
                            }
                            onMouseLeave={() => setHoveredExternalId(null)}
                            style={{
                              ...styles.externalLinkBtn,
                              borderColor:
                                hoveredExternalId === resource.id
                                ? "#315bc7"
                                  : "#e2dfd5",
                              color:
                                hoveredExternalId === resource.id
                                  ? "#dfe6fb"
                                  : "#48505a",
                              background:
                                hoveredExternalId === resource.id
                                ? "rgba(49, 91, 199, 0.06)"
                                : "#ffffff",
                            }}
                            title="View on GitHub / Source"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM REQUEST RESOURCE CTA */}
        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <div style={styles.ctaBox}>
              <div style={styles.ctaLeft}>
                <span style={styles.ctaEyebrow}>CAN&apos;T FIND WHAT YOU NEED?</span>
                <h3 style={styles.ctaHeading}>
                  Request a specific code boilerplate or architecture guide.
                </h3>
                <p style={styles.ctaText}>
                  I regularly publish open source kits, AI orchestration tools,
                  and developer playbooks. Let me know what you are looking to build.
                </p>
              </div>

              <div style={styles.ctaRight}>
                <Link href="/contact" style={styles.ctaButton}>
                  Suggest a resource ↗
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    background: "#ffffff",
    color: "#202329",
    minHeight: "100vh",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  main: {
    paddingTop: "110px",
    position: "relative",
  },

  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    boxSizing: "border-box",
  },

  heroSection: {
    padding: "60px 0 30px",
    textAlign: "left",
  },

  badgeWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "20px",
  },

  eyebrowBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "0",
    background: "transparent",
    border: "none",
    color: "#315bc7",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  heroTitle: {
    fontSize: "clamp(34px, 5.5vw, 62px)",
    fontWeight: "800",
    lineHeight: "1.1",
    letterSpacing: "-1.5px",
    color: "#202329",
    margin: "0 0 20px",
  },

  heroGradient: { color: "#315bc7" },

  heroSubtitle: {
    fontSize: "clamp(16px, 2vw, 19px)",
    color: "#727882",
    maxWidth: "760px",
    margin: "0 0 28px",
    lineHeight: "1.6",
  },

  controlsSection: {
    padding: "20px 0 30px",
  },

  controlsBar: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  searchWrapper: {
    position: "relative",
    width: "100%",
  },

  searchIcon: {
    position: "absolute",
    left: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "15px",
    opacity: 0.6,
  },

  searchInput: {
    width: "100%",
    padding: "16px 46px 16px 48px",
    borderRadius: "14px",
    background: "#f4f6f2",
    border: "1px solid #e2dfd5",
    color: "#202329",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  clearSearchBtn: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#727882",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 8px",
  },

  categoryPills: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "4px",
    scrollbarWidth: "none",
  },

  catButton: {
    padding: "10px 18px",
    borderRadius: "999px",
    background: "#f4f6f2",
    border: "1px solid #e2dfd5",
    color: "#727882",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },

  catButtonActive: {
    background: "#315bc7",
    borderColor: "#315bc7",
    color: "#ffffff",
    fontWeight: "700",
    boxShadow: "0 6px 16px rgba(49, 91, 199, 0.18)",
  },

  gridSection: {
    padding: "20px 0 60px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "var(--surface)",
    border: "1px solid #e2dfd5",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    transition:
      "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
    position: "relative",
    cursor: "default",
  },

  coverThumbnailWrapper: {
    width: "100%",
    height: "190px",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "18px",
    background: "#eeece5",
    border: "1px solid #e2dfd5",
    position: "relative",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },

  coverThumbnailImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition:
      "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    gap: "8px",
  },

  badgeGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  formatBadge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    border: "1px solid",
  },

  categoryBadge: {
    padding: "4px 10px",
    borderRadius: "6px",
    background: "#f4f5f8",
    border: "1px solid #e2dfd5",
    color: "#727882",
    fontSize: "11px",
    fontWeight: "600",
  },

  featuredBadge: {
    padding: "3px 8px",
    borderRadius: "6px",
    background: "rgba(49, 91, 199, 0.08)",
    color: "#315bc7",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  cardTitle: {
    fontSize: "21px",
    fontWeight: "700",
    color: "#202329",
    margin: "0 0 12px",
    lineHeight: "1.3",
  },

  cardDescription: {
    fontSize: "14px",
    color: "#727882",
    lineHeight: "1.6",
    margin: "0 0 20px",
    flexGrow: 1,
  },

  tagList: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  tag: {
    fontSize: "11px",
    color: "#727882",
    background: "#eeece5",
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid #e2dfd5",
  },

  cardMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "16px",
    borderTop: "1px solid #e2dfd5",
    marginBottom: "20px",
    fontSize: "12px",
    color: "#727882",
  },

  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  metaIcon: {
    fontSize: "13px",
  },

  cardActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  downloadBtn: {
    flex: "1 1 auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#315bc7",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.15s ease, opacity 0.15s ease",
  },

  btnArrow: {
    fontSize: "15px",
    fontWeight: "800",
  },

  btnSpinner: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    border: "2px solid #ffffff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },

  copyBtn: {
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#ffffff",
    border: "1px solid #e2dfd5",
    color: "#48505a",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  externalLinkBtn: {
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#ffffff",
    border: "1px solid #e2dfd5",
    color: "#48505a",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    transition: "all 0.15s ease",
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#eeece5",
    borderRadius: "20px",
    border: "1px dashed #d8d5cc",
  },

  emptyIcon: {
    fontSize: "44px",
    marginBottom: "16px",
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#202329",
    margin: "0 0 8px",
  },

  emptySub: {
    fontSize: "14px",
    color: "#727882",
    margin: "0 0 20px",
  },

  resetBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    background: "#315bc7",
    color: "#ffffff",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
  },

  ctaSection: {
    padding: "20px 0 80px",
  },

  ctaBox: {
    background: "#ffffff",
    border: "1px solid #e2dfd5",
    borderRadius: "12px",
    padding: "36px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    flexWrap: "wrap",
    position: "relative",
    overflow: "hidden",
  },

  ctaLeft: {
    maxWidth: "680px",
  },

  ctaEyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#315bc7",
    letterSpacing: "1.5px",
    display: "block",
    marginBottom: "10px",
  },

  ctaHeading: {
    fontSize: "clamp(22px, 3.5vw, 32px)",
    fontWeight: "800",
    color: "#202329",
    margin: "0 0 12px",
    lineHeight: "1.25",
  },

  ctaText: {
    fontSize: "15px",
    color: "#727882",
    lineHeight: "1.6",
    margin: 0,
  },

  ctaRight: {
    flexShrink: 0,
  },

  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    padding: "16px 30px",
    borderRadius: "12px",
    background: "#315bc7",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none",
    boxShadow: "none",
    transition: "transform 0.15s ease",
  },
};
