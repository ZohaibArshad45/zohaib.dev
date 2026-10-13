"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTextTarget, setIsTextTarget] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with a mouse/pointer
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Check element under cursor to detect text or interactive targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a, button, input, textarea, select, [role='button']")
        );
        const isText = Boolean(
          target.closest(
            "h1, h2, h3, h4, h5, h6, p, span, li, blockquote, strong, em, label"
          )
        );

        setIsHovered(isInteractive);
        setIsTextTarget(isText && !isInteractive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth 60/120fps physics loop with linear interpolation (LERP)
    const animate = () => {
      // Inner dot follows swiftly
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;

      // Outer follower follows with buttery smooth elastic inertia
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Outer Smooth Follower Ring / Inverting Blob */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 999998,
          borderRadius: "50%",
          mixBlendMode: "difference",
          willChange: "transform",
          opacity: isVisible ? 1 : 0,
          // Expand when over text or interactive links
          width: isTextTarget ? "48px" : isHovered ? "54px" : "32px",
          height: isTextTarget ? "48px" : isHovered ? "54px" : "32px",
          // Color changes dynamically: green on standard UI, white on text/links so difference inverts colors
          background: isTextTarget
            ? "#ffffff"
            : isHovered
            ? "rgba(202, 255, 70, 0.9)"
            : "rgba(202, 255, 70, 0.25)",
          border: isTextTarget
            ? "2px solid #ffffff"
            : isHovered
            ? "2px solid #caff46"
            : "1.5px solid rgba(202, 255, 70, 0.65)",
          transform: isClicking ? "scale(0.85)" : "scale(1)",
          transition:
            "width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease, border 0.25s ease, opacity 0.25s ease",
          boxShadow: isTextTarget
            ? "0 0 20px rgba(255, 255, 255, 0.4)"
            : isHovered
            ? "0 0 24px rgba(202, 255, 70, 0.5)"
            : "0 0 10px rgba(202, 255, 70, 0.2)",
        }}
      />

      {/* Inner Pinpoint Cursor Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 999999,
          borderRadius: "50%",
          mixBlendMode: "difference",
          willChange: "transform",
          opacity: isVisible ? 1 : 0,
          width: isTextTarget ? "8px" : isHovered ? "0px" : "6px",
          height: isTextTarget ? "8px" : isHovered ? "0px" : "6px",
          background: isTextTarget ? "#caff46" : "#ffffff",
          transform: isClicking ? "scale(0.7)" : "scale(1)",
          transition:
            "width 0.2s ease, height 0.2s ease, background 0.2s ease, opacity 0.2s ease",
        }}
      />
    </>
  );
}
