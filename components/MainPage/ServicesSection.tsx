"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const SERVICES = [
  {
    id: "s1", num: "01",
    title: "AI SaaS Development",
    desc: "I build production-ready AI-powered SaaS products — from RAG-based chat interfaces and AI agents to custom knowledge bases with full analytics. Stack: Next.js, OpenAI, LangChain, Supabase, Stripe.",
    tags: ["OpenAI", "LangChain", "Next.js", "Supabase", "Stripe"],
  },
  {
    id: "s2", num: "02",
    title: "Next.js Web Applications",
    desc: "Blazing-fast, SEO-optimized web apps using Next.js App Router and React Server Components. I handle everything from UI design to deployment on Vercel with CI/CD pipelines.",
    tags: ["Next.js 15", "TypeScript", "Tailwind CSS", "Vercel"],
  },
  {
    id: "s3", num: "03",
    title: "AI Integrations",
    desc: "Integrate powerful AI into your existing products — OpenAI, Anthropic Claude, Google Gemini, vector embeddings, semantic search, and custom AI pipelines tailored to your business.",
    tags: ["OpenAI", "Anthropic", "Gemini", "Pinecone", "Embeddings"],
  },
  {
    id: "s4", num: "04",
    title: "Automation with n8n",
    desc: "Build intelligent no-code/low-code automation workflows with n8n. Connect your tools, automate repetitive tasks, and save hours every week. Custom nodes and advanced flow logic included.",
    tags: ["n8n", "Webhooks", "Make", "Zapier", "Custom Nodes"],
  },
  {
    id: "s5", num: "05",
    title: "API & Backend Development",
    desc: "Scalable REST and GraphQL APIs built with FastAPI or Node.js — JWT auth, role-based access, rate limiting, Swagger documentation, and full Docker/cloud deployment setup.",
    tags: ["FastAPI", "Node.js", "REST", "GraphQL", "Docker", "PostgreSQL"],
  },
];

export default function ServicesSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="services" style={{ background: "#F5F5F0", padding: "7rem 0" }}>
      <div className="wrap">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "5rem" }}
        >
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B4B4B4" }}>03</span>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.09)" }} />
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#B4B4B4" }}>Services</span>
        </motion.div>

        <motion.h2
          className="sec-h"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          style={{ color: "#0A0A0A", marginBottom: "3.5rem" }}
        >
          What I do.
        </motion.h2>

        {/* Accordion */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
            >
              <button
                onClick={() => setOpen(open === s.id ? null : s.id)}
                style={{
                  width: "100%", background: "none", border: "none",
                  cursor: "pointer", padding: "1.6rem 0",
                  display: "flex", alignItems: "center",
                  gap: "1.5rem", fontFamily: "inherit",
                  transition: "opacity 0.2s",
                }}
              >
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700,
                  letterSpacing: "0.18em", color: "#A3A3A3",
                  width: 28, flexShrink: 0, textAlign: "left",
                }}>{s.num}</span>
                <span style={{
                  flex: 1, textAlign: "left",
                  fontSize: "1.05rem", fontWeight: 600, color: "#0A0A0A",
                }}>{s.title}</span>
                <motion.div
                  animate={{ rotate: open === s.id ? 45 : 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ flexShrink: 0, color: "#A3A3A3" }}
                >
                  <Plus size={18} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === s.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ paddingBottom: "1.8rem", paddingLeft: 44 }}>
                      <p style={{ fontSize: "0.92rem", color: "#737373", lineHeight: 1.78, marginBottom: "1rem" }}>
                        {s.desc}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {s.tags.map((t) => <span key={t} className="tag-l">{t}</span>)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
