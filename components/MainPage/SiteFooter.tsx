import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
export default function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const socials = [
    { href: settings?.githubUrl || "https://github.com/codingskillup", label: "GitHub", short: "GH" },
    ...(settings?.linkedinUrl && settings.linkedinUrl !== "https://linkedin.com/in/"
      ? [{ href: settings.linkedinUrl, label: "LinkedIn", short: "in" }]
      : []),
    ...(settings?.twitterUrl && settings.twitterUrl !== "https://x.com/"
      ? [{ href: settings.twitterUrl, label: "X", short: "X" }]
      : []),
    { href: "https://codingskillup.com", label: "Codingskillup", short: "CS" },
  ];
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div>
            <Link href="/" className="site-footer-brand">Zohaib<span>.</span></Link>
            <p>Web Developer · Founder of Codingskillup · Bahawalpur, Pakistan</p>
          </div>
          <div className="site-footer-actions">
            <nav aria-label="Footer navigation" className="site-footer-links">
              {links.map((link) => (
                <Link href={link.href} key={link.href}>{link.label}</Link>
              ))}
            </nav>
            <div className="site-footer-socials" aria-label="Social links">
              {socials.map((social) => (
                <a href={social.href} key={social.label} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="site-footer-legal">
          <small>© {new Date().getFullYear()} Zohaib · Web Developer · All rights reserved.</small>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
