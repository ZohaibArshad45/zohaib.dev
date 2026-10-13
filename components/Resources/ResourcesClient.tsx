"use client";

import Link from "next/link";
import { useState, useMemo, type CSSProperties } from "react";
import Navbar from "@/components/MainPage/Navbar";
import ContactSection from "@/components/MainPage/ContactSection";
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
          bg: "rgba(202, 255, 70, 0.12)",
          border: "rgba(202, 255, 70, 0.35)",
          text: "#caff46",
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
      <Navbar />

      <main style={styles.main}>
        {/* HERO SECTION */}
        <section style={styles.heroSection}>
          <div style={styles.container}>
            <div style={styles.badgeWrapper}>
              <span style={styles.eyebrowBadge}>
                <span style={styles.pulseDot} />
                FREE DEVELOPER RESOURCES &amp; CODE
              </span>
            </div>

            <h1 style={styles.heroTitle}>
              Free Blueprints, Code &amp; <br />
              <span style={styles.heroGradient}>Engineering Playbooks</span>
            </h1>

            <p style={styles.heroSubtitle}>
              Handcrafted production starters, system architecture handbooks,
              PostgreSQL cheatsheets, and autonomous AI blueprints. 100% free
              for software developers and tech builders.
            </p>

            {/* QUICK STATS PILLS */}
            <div style={styles.statsRow}>
              <div style={styles.statPill}>
                <span style={styles.statNumber}>{resources.length}+</span>
                <span style={styles.statLabel}>Free Assets</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statPill}>
                <span style={styles.statNumber}>100%</span>
                <span style={styles.statLabel}>Free &amp; Open</span>
              </div>
              <div style={statDividerStyle} />
              <div style={styles.statPill}>
                <span style={styles.statNumber}>Direct</span>
                <span style={styles.statLabel}>PDF &amp; ZIP Downloads</span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTROLS: SEARCH & CATEGORY PILLS */}
        <section style={styles.controlsSection}>
          <div style={styles.container}>
            <div style={styles.controlsBar}>
              {/* Search Bar */}
              <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>🔍</span>
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
                    ✕
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

                  return (
                    <div key={resource.id} style={styles.card}>
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
                      <h2 style={styles.cardTitle}>{resource.title}</h2>
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
                          <span style={styles.metaIcon}>💾</span>
                          <span>{resource.fileSize || "Free Download"}</span>
                        </div>

                        {typeof resource.downloadsCount === "number" && (
                          <div style={styles.metaItem}>
                            <span style={styles.metaIcon}>⬇</span>
                            <span>{resource.downloadsCount} downloads</span>
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div style={styles.cardActions}>
                        <button
                          onClick={() => handleDownload(resource)}
                          disabled={isDownloading}
                          style={styles.downloadBtn}
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
                          style={styles.copyBtn}
                          title="Copy Download Link"
                        >
                          {isCopied ? "✓ Copied" : "Copy Link"}
                        </button>

                        {resource.externalLink && (
                          <a
                            href={resource.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.externalLinkBtn}
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
                  Request an Asset or Chat ↗
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ContactSection />
    </div>
  );
}

const statDividerStyle: CSSProperties = {
  width: "1px",
  height: "28px",
  background: "#242a25",
};

const styles: Record<string, CSSProperties> = {
  page: {
    background: "#0c0e0d",
    color: "#ffffff",
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
    textAlign: "center",
  },

  badgeWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },

  eyebrowBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "999px",
    background: "rgba(202, 255, 70, 0.08)",
    border: "1px solid rgba(202, 255, 70, 0.25)",
    color: "#caff46",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  pulseDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#caff46",
    boxShadow: "0 0 10px #caff46",
  },

  heroTitle: {
    fontSize: "clamp(34px, 5.5vw, 62px)",
    fontWeight: "800",
    lineHeight: "1.1",
    letterSpacing: "-1.5px",
    color: "#ffffff",
    margin: "0 0 20px",
  },

  heroGradient: {
    background: "linear-gradient(135deg, #caff46 20%, #7ee787 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  heroSubtitle: {
    fontSize: "clamp(16px, 2vw, 19px)",
    color: "#a7ada9",
    maxWidth: "760px",
    margin: "0 auto 36px",
    lineHeight: "1.6",
  },

  statsRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "24px",
    padding: "12px 28px",
    borderRadius: "16px",
    background: "rgba(18, 22, 19, 0.75)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    backdropFilter: "blur(10px)",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  statPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  statNumber: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#caff46",
  },

  statLabel: {
    fontSize: "13px",
    color: "#8e988f",
    fontWeight: "500",
  },

  statDivider: {
    width: "1px",
    height: "24px",
    background: "rgba(255, 255, 255, 0.1)",
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
    background: "#131715",
    border: "1px solid #232924",
    color: "#ffffff",
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
    color: "#8e988f",
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
    background: "#131715",
    border: "1px solid #232924",
    color: "#9aa39b",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },

  catButtonActive: {
    background: "#caff46",
    borderColor: "#caff46",
    color: "#0c0e0d",
    fontWeight: "700",
    boxShadow: "0 0 20px rgba(202, 255, 70, 0.3)",
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
    background: "linear-gradient(180deg, #131714 0%, #0f1210 100%)",
    border: "1px solid #232a24",
    borderRadius: "20px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    position: "relative",
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
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    color: "#8e988f",
    fontSize: "11px",
    fontWeight: "600",
  },

  featuredBadge: {
    padding: "3px 8px",
    borderRadius: "6px",
    background: "rgba(202, 255, 70, 0.15)",
    color: "#caff46",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  cardTitle: {
    fontSize: "21px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 12px",
    lineHeight: "1.3",
  },

  cardDescription: {
    fontSize: "14px",
    color: "#9aa39c",
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
    color: "#748076",
    background: "rgba(0, 0, 0, 0.25)",
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid #1c221d",
  },

  cardMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "16px",
    borderTop: "1px solid #1f2520",
    marginBottom: "20px",
    fontSize: "12px",
    color: "#7e8880",
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
    background: "#caff46",
    color: "#0c0e0d",
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
    border: "2px solid #0c0e0d",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },

  copyBtn: {
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#181d19",
    border: "1px solid #273029",
    color: "#cbd2cc",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  externalLinkBtn: {
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#181d19",
    border: "1px solid #273029",
    color: "#cbd2cc",
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
    background: "#111412",
    borderRadius: "20px",
    border: "1px dashed #242b25",
  },

  emptyIcon: {
    fontSize: "44px",
    marginBottom: "16px",
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 8px",
  },

  emptySub: {
    fontSize: "14px",
    color: "#848f86",
    margin: "0 0 20px",
  },

  resetBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
  },

  ctaSection: {
    padding: "20px 0 80px",
  },

  ctaBox: {
    background: "linear-gradient(135deg, #141a16 0%, #101411 100%)",
    border: "1px solid rgba(202, 255, 70, 0.25)",
    borderRadius: "24px",
    padding: "48px 40px",
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
    color: "#caff46",
    letterSpacing: "1.5px",
    display: "block",
    marginBottom: "10px",
  },

  ctaHeading: {
    fontSize: "clamp(22px, 3.5vw, 32px)",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 12px",
    lineHeight: "1.25",
  },

  ctaText: {
    fontSize: "15px",
    color: "#9aa39c",
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
    background: "#caff46",
    color: "#0c0e0d",
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none",
    boxShadow: "0 0 30px rgba(202, 255, 70, 0.2)",
    transition: "transform 0.15s ease",
  },
};
