"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const handleResize = () => {
      setWidth(window.innerWidth);

      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    handleScroll();
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isMobile = width <= 768;
  const isTablet = width <= 1050;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const getNavLinkStyle = (href: string): CSSProperties => ({
    color: isActive(href) ? "#caff46" : "#ffffff",
    textDecoration: "none",
    fontSize: isTablet ? "16px" : "17px",
    fontWeight: isActive(href) ? "600" : "500",
    transition: "color 0.2s ease",
    letterSpacing: "0.1px",
  });

  const getMobileLinkStyle = (href: string): CSSProperties => ({
    color: isActive(href) ? "#caff46" : "#ffffff",
    textDecoration: "none",
    fontSize: "30px",
    fontWeight: isActive(href) ? "600" : "500",
    lineHeight: "1.2",
  });

  const styles: Record<string, CSSProperties> = {
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "rgba(12, 14, 13, 0.96)",
      backdropFilter: "blur(14px)",
    },

    container: {
      width: "100%",
      maxWidth: "1280px",
      margin: "0 auto",
      padding: isMobile
        ? "0 20px"
        : isTablet
        ? "0 36px"
        : "0 56px",
      boxSizing: "border-box",
    },

    inner: {
      height: scrolled ? "66px" : isMobile ? "74px" : "88px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #2b2e2c",
      transition: "height 0.3s ease",
    },

    logo: {
      fontSize: isMobile ? "27px" : scrolled ? "28px" : "31px",
      fontWeight: "800",
      color: "#ffffff",
      textDecoration: "none",
      letterSpacing: "-1px",
      transition: "font-size 0.3s ease",
    },

    dot: {
      color: "#caff46",
    },

    navLinks: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: isTablet ? "26px" : "40px",
    },

    talk: {
      display: isMobile ? "none" : "inline-block",
      color: pathname === "/contact" ? "#caff46" : "#ffffff",
      textDecoration: "none",
      fontSize: isTablet ? "16px" : "17px",
      fontWeight: pathname === "/contact" ? "600" : "500",
      paddingBottom: "8px",
      borderBottom:
        pathname === "/contact"
          ? "1px solid #caff46"
          : "1px solid #747767",
      transition: "color 0.2s ease, border-color 0.2s ease",
    },

    hamburger: {
      display: isMobile ? "flex" : "none",
      width: "42px",
      height: "42px",
      padding: 0,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "6px",
      position: "relative",
      zIndex: 1100,
    },

    line1: {
      width: "23px",
      height: "2px",
      background: "#ffffff",
      transition: "0.3s ease",
      transform: menuOpen
        ? "translateY(4px) rotate(45deg)"
        : "translateY(0) rotate(0)",
    },

    line2: {
      width: "23px",
      height: "2px",
      background: "#ffffff",
      transition: "0.3s ease",
      transform: menuOpen
        ? "translateY(-4px) rotate(-45deg)"
        : "translateY(0) rotate(0)",
    },

    mobileMenu: {
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100dvh",
      background: "#0c0e0d",
      zIndex: 999,
      display: menuOpen ? "flex" : "none",
      flexDirection: "column",
      padding: "120px 28px 40px",
      boxSizing: "border-box",
      overflowY: "auto",
    },

    mobileLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "32px",
    },

    mobileTalk: {
      color: pathname === "/contact" ? "#caff46" : "#ffffff",
      textDecoration: "none",
      fontSize: "28px",
      fontWeight: pathname === "/contact" ? "600" : "500",
      marginTop: "8px",
      width: "fit-content",
      paddingBottom: "8px",
      borderBottom:
        pathname === "/contact"
          ? "1px solid #caff46"
          : "1px solid #7a7d6b",
    },

    mobileBottom: {
      marginTop: "auto",
      fontSize: "12px",
      color: "#9ea39e",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
    },
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.inner}>
            <Link href="/" style={styles.logo} onClick={closeMenu}>
              Zohaib<span style={styles.dot}>.</span>
            </Link>

            <div style={styles.navLinks}>
              <Link href="/projects" style={getNavLinkStyle("/projects")}>
                Projects
              </Link>

              <Link href="/services" style={getNavLinkStyle("/services")}>
                Services
              </Link>

              <Link href="/resources" style={getNavLinkStyle("/resources")}>
                Resources
              </Link>

              <Link href="/process" style={getNavLinkStyle("/process")}>
                Process
              </Link>

              <Link href="/about" style={getNavLinkStyle("/about")}>
                About
              </Link>
            </div>

            <Link href="/contact" style={styles.talk}>
              Let&apos;s talk ↗
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              style={styles.hamburger}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span style={styles.line1} />
              <span style={styles.line2} />
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.mobileMenu}>
        <div style={styles.mobileLinks}>
          <Link
            href="/projects"
            onClick={closeMenu}
            style={getMobileLinkStyle("/projects")}
          >
            Projects
          </Link>

          <Link
            href="/services"
            onClick={closeMenu}
            style={getMobileLinkStyle("/services")}
          >
            Services
          </Link>

          <Link
            href="/resources"
            onClick={closeMenu}
            style={getMobileLinkStyle("/resources")}
          >
            Resources
          </Link>

          <Link
            href="/process"
            onClick={closeMenu}
            style={getMobileLinkStyle("/process")}
          >
            Process
          </Link>

          <Link
            href="/about"
            onClick={closeMenu}
            style={getMobileLinkStyle("/about")}
          >
            About
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            style={styles.mobileTalk}
          >
            Let&apos;s talk ↗
          </Link>
        </div>

        <div style={styles.mobileBottom}>
          Web Developer • AI Builder • Pakistan / Remote
        </div>
      </div>
    </>
  );
}