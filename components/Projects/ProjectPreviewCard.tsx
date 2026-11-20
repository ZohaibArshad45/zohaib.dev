import type { CSSProperties } from "react";
import type { Project } from "@/lib/projects";

export default function ProjectPreviewCard({ project }: { project: Project }) {
  const styles: Record<string, CSSProperties> = {
    preview: {
      width: "100%",
      height: "100%",
      minHeight: "180px",
      display: "grid",
      placeItems: "center",
      padding: "24px",
      boxSizing: "border-box",
      overflow: "hidden",
      textAlign: "center",
      background: "linear-gradient(135deg, #f6f8f3, #edf4e5)",
    },
    content: { maxWidth: "420px" },
    category: {
      margin: "0 0 10px",
      color: "#527d13",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
    title: {
      margin: 0,
      color: "#202329",
      fontSize: "clamp(20px, 3vw, 34px)",
      lineHeight: "1.15",
      fontWeight: "600",
      letterSpacing: "-0.04em",
    },
  };

  return (
    <div style={styles.preview} aria-label={`${project.title} preview unavailable`}>
      <div style={styles.content}>
        <p style={styles.category}>{project.status || "Project"}</p>
        <h3 style={styles.title}>{project.shortTitle || project.title}</h3>
      </div>
    </div>
  );
}
