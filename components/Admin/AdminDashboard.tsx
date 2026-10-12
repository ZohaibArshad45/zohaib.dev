"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import type { Project } from "@/lib/projects";
import type { Inquiry, InquiryStatus, PriorityLevel } from "@/lib/inquiriesStore";
import type { Service } from "@/lib/services";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

type TabType = "projects" | "categories" | "services" | "inquiries" | "settings";

const PREVIEW_TYPES: { id: Project["previewType"]; label: string }[] = [
  { id: "inbox", label: "AI Inbox & Lead Stream" },
  { id: "automation", label: "Automation Workflow Nodes" },
  { id: "dashboard", label: "Live Operations Dashboard" },
  { id: "outreach", label: "Prospect Intelligence Agent" },
  { id: "code", label: "Code Playground & Terminal" },
  { id: "support", label: "RAG Vector Knowledge Copilot" },
];

const EMPTY_SERVICE: Service = {
  id: "",
  slug: "",
  number: "01",
  category: "FULL-STACK DEVELOPMENT",
  title: "",
  description: "",
  items: [],
  bestFor: "",
  stack: "",
  timeline: "2 to 3 Weeks",
  startingPrice: "$2,000",
  cta: "Get in touch ↗",
  href: "/contact",
  featured: false,
};

const EMPTY_PROJECT: Project = {
  slug: "",
  number: "01",
  title: "",
  shortTitle: "",
  status: "Web App",
  categories: ["Web Apps"],
  headline: "",
  subhead: "",
  description: "",
  outcome: "",
  tags: ["Next.js", "React", "TypeScript"],
  images: [],
  previewType: "dashboard",
  client: "",
  role: "Lead Full-Stack Engineer",
  timeline: "Completed",
  deliverables: [],
  problem: "",
  solution: "",
  architectureHighlights: [],
  metrics: [],
  demoUrl: "",
  githubUrl: "",
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [projectsSource, setProjectsSource] = useState<string>("local");
  const [loading, setLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [hideSupabaseBanner, setHideSupabaseBanner] = useState<boolean>(false);

  // Inquiries filter & detail drawer
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Project Modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);
  const [projectForm, setProjectForm] = useState<Project>(EMPTY_PROJECT);

  // Services Modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isEditingService, setIsEditingService] = useState<boolean>(false);
  const [serviceForm, setServiceForm] = useState<Service>(EMPTY_SERVICE);
  const [serviceItemsInput, setServiceItemsInput] = useState<string>("");

  // Form simplified text inputs
  const [techTagsInput, setTechTagsInput] = useState<string>("");
  const [featuresInput, setFeaturesInput] = useState<string>("");
  const [projectMetrics, setProjectMetrics] = useState<Array<{ value: string; label: string }>>([]);

  // 3-Images Upload state
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Category management state
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  // Settings & Security state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [currentPassInput, setCurrentPassInput] = useState<string>("");
  const [newPassInput, setNewPassInput] = useState<string>("");
  const [confirmPassInput, setConfirmPassInput] = useState<string>("");

  const [width, setWidth] = useState<number>(1440);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    const sessionAuth = sessionStorage.getItem("zohaib_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchServices();
      fetchInquiries();
      fetchCategories();
      fetchSettings();
    }
  }, [isAuthenticated]);

  // Secure Server-Side Login (No hardcoded password in client JS)
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setPasscodeError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passcodeInput }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("zohaib_admin_auth", "true");
        setPasscodeInput("");
      } else {
        setPasscodeError(data.message || "Incorrect passcode");
      }
    } catch {
      setPasscodeError("Server connection error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem("zohaib_admin_auth");
    setPasscodeInput("");
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
        if (data.source) setProjectsSource(data.source);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSiteSettings(data.settings);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSaveMsg(null);

    if (newPassInput) {
      if (newPassInput !== confirmPassInput) {
        setSettingsSaveMsg({
          type: "error",
          text: "New passwords do not match!",
        });
        setSettingsLoading(false);
        return;
      }
      if (!currentPassInput) {
        setSettingsSaveMsg({
          type: "error",
          text: "Current password is required to set a new password.",
        });
        setSettingsLoading(false);
        return;
      }
    }

    try {
      const payload: any = {
        ...siteSettings,
      };
      if (newPassInput) {
        payload.currentPassword = currentPassInput;
        payload.newPassword = newPassInput;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSettingsSaveMsg({
          type: "success",
          text: data.message || "Settings updated successfully!",
        });
        setCurrentPassInput("");
        setNewPassInput("");
        setConfirmPassInput("");
        if (data.settings) {
          setSiteSettings(data.settings);
        }
      } else {
        setSettingsSaveMsg({
          type: "error",
          text: data.message || "Failed to update settings.",
        });
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      setSettingsSaveMsg({ type: "error", text: "Error saving settings." });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleExportBackup = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      projects,
      services,
      categories,
      inquiries,
      settings: siteSettings,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zohaib-portfolio-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // DYNAMIC CATEGORY HANDLERS
  // -------------------------------------------------------------
  const handleAddNewCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    setIsAddingCategory(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
        // Automatically select the new category in project form
        setProjectForm((prev) => ({
          ...prev,
          status: trimmed,
          categories: [trimmed],
        }));
        setNewCategoryName("");
      }
    } catch (err) {
      console.error("Failed to add category:", err);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(
        `/api/admin/categories?name=${encodeURIComponent(name)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const openAddProjectModal = () => {
    setIsEditingProject(false);
    const nextNum =
      projects.length >= 9
        ? `${projects.length + 1}`
        : `0${projects.length + 1}`;

    const initialCategory = categories[0] || "Web Apps";

    setProjectForm({
      ...EMPTY_PROJECT,
      number: nextNum,
      status: initialCategory,
      categories: [initialCategory],
      client: "",
      role: "Lead Full-Stack Engineer",
      timeline: "Completed",
      outcome: "",
      problem: "",
      solution: "",
      images: [],
    });
    setTechTagsInput("Next.js, TypeScript, Tailwind CSS");
    setFeaturesInput(
      "Real-time data synchronization\nResponsive mobile & desktop interface\nClean modern design with dark mode"
    );
    setProjectMetrics([]);
    setUploadError(null);
    setUploadingSlot(null);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setIsEditingProject(true);
    setProjectForm({
      ...proj,
      client: proj.client || "",
      role: proj.role || "",
      timeline: proj.timeline || "",
      outcome: proj.outcome || "",
      problem: proj.problem || "",
      solution: proj.solution || "",
      images: Array.isArray(proj.images) ? proj.images : [],
    });
    setTechTagsInput(proj.tags ? proj.tags.join(", ") : "");
    // Prefer deliverables or architectureHighlights as features
    const features =
      proj.deliverables && proj.deliverables.length > 0
        ? proj.deliverables.join("\n")
        : proj.architectureHighlights && proj.architectureHighlights.length > 0
        ? proj.architectureHighlights.join("\n")
        : "";
    setFeaturesInput(features);
    setProjectMetrics(
      Array.isArray(proj.metrics) && proj.metrics.length > 0
        ? proj.metrics
        : []
    );
    setUploadError(null);
    setUploadingSlot(null);
    setIsProjectModalOpen(true);
  };

  // Image Upload Handlers for up to 3 project pictures
  const handleImageUpload = async (file: File, slotIndex: number) => {
    if (!file) return;
    setUploadingSlot(slotIndex);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        const currentImages = [...(projectForm.images || [])];
        while (currentImages.length <= slotIndex) {
          currentImages.push("");
        }
        currentImages[slotIndex] = data.url;
        setProjectForm((prev) => ({
          ...prev,
          images: currentImages,
        }));
      } else {
        setUploadError(data.message || "Failed to upload image");
      }
    } catch {
      setUploadError("Image upload error. Please check your connection.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveImage = (slotIndex: number) => {
    const currentImages = [...(projectForm.images || [])];
    currentImages[slotIndex] = "";
    setProjectForm((prev) => ({
      ...prev,
      images: currentImages,
    }));
  };

  const handleImageUrlChange = (url: string, slotIndex: number) => {
    const currentImages = [...(projectForm.images || [])];
    while (currentImages.length <= slotIndex) {
      currentImages.push("");
    }
    currentImages[slotIndex] = url;
    setProjectForm((prev) => ({
      ...prev,
      images: currentImages,
    }));
  };

  // Save Project (Add or Edit)
  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();

    const tagsArray = techTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const featuresArray = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const cleanImages = (projectForm.images || [])
      .map((img) => (typeof img === "string" ? img.trim() : ""))
      .filter((img) => img.length > 0);

    const cleanMetrics = projectMetrics
      .map((m) => ({
        value: (m.value || "").trim(),
        label: (m.label || "").trim(),
      }))
      .filter((m) => m.value.length > 0 && m.label.length > 0);

    const preparedProject: Project = {
      ...projectForm,
      slug: projectForm.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-"),
      shortTitle: projectForm.shortTitle || projectForm.title,
      client: (projectForm.client || "").trim(),
      role: (projectForm.role || "").trim(),
      timeline: (projectForm.timeline || "").trim(),
      outcome: (projectForm.outcome || "").trim(),
      problem: (projectForm.problem || "").trim(),
      solution: (projectForm.solution || "").trim(),
      metrics: cleanMetrics,
      tags: tagsArray,
      images: cleanImages,
      deliverables: featuresArray,
      architectureHighlights: featuresArray,
      categories:
        projectForm.categories.length > 0
          ? projectForm.categories
          : [projectForm.status],
    };

    try {
      if (isEditingProject) {
        const res = await fetch("/api/admin/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preparedProject),
        });
        const data = await res.json();
        if (data.success && data.project) {
          setProjects((prev) =>
            prev.map((p) =>
              p.slug === preparedProject.slug ? data.project : p
            )
          );
          setIsProjectModalOpen(false);
        }
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preparedProject),
        });
        const data = await res.json();
        if (data.success && data.project) {
          setProjects((prev) => [data.project, ...prev]);
          setIsProjectModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  };

  const handleDeleteProject = async (slug: string) => {
    if (!window.confirm(`Delete project "${slug}" from your portfolio?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?slug=${slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.slug !== slug));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // -------------------------------------------------------------
  // SERVICES CRUD HANDLERS
  // -------------------------------------------------------------
  const openAddServiceModal = () => {
    setIsEditingService(false);
    const nextNum =
      services.length >= 9
        ? `${services.length + 1}`
        : `0${services.length + 1}`;

    const defaultCat = categories[0] || "FULL-STACK DEVELOPMENT";

    setServiceForm({
      ...EMPTY_SERVICE,
      number: nextNum,
      category: defaultCat,
    });
    setServiceItemsInput(
      "Custom responsive dashboards & client portals\nAuthentication, role permissions & database design\nHigh performance SEO and Google Core Web Vitals"
    );
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (srv: Service) => {
    setIsEditingService(true);
    setServiceForm(srv);
    setServiceItemsInput((srv.items || []).join("\n"));
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();

    const itemsArray = serviceItemsInput
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);

    const slug = (serviceForm.slug || serviceForm.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/^-+|-+$/g, "");

    const preparedService: Service = {
      ...serviceForm,
      id: serviceForm.id || `srv-${Date.now().toString(36)}`,
      slug: slug || `srv-${Date.now().toString(36)}`,
      items: itemsArray,
      href: serviceForm.href || `/contact?service=${slug}`,
    };

    try {
      if (isEditingService) {
        const res = await fetch("/api/admin/services", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preparedService),
        });
        const data = await res.json();
        if (data.success && data.service) {
          setServices((prev) =>
            prev.map((s) =>
              s.slug === preparedService.slug || s.id === preparedService.id
                ? data.service
                : s
            )
          );
          setIsServiceModalOpen(false);
        }
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preparedService),
        });
        const data = await res.json();
        if (data.success && data.service) {
          setServices((prev) => [...prev, data.service]);
          setIsServiceModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Failed to save service:", err);
    }
  };

  const handleDeleteService = async (slugOrId: string) => {
    if (!window.confirm("Delete this service offering?")) return;

    try {
      const res = await fetch(`/api/admin/services?slug=${slugOrId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) =>
          prev.filter((s) => s.slug !== slugOrId && s.id !== slugOrId)
        );
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  // -------------------------------------------------------------
  // INQUIRIES ACTIONS
  // -------------------------------------------------------------
  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.inquiry) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? data.inquiry : inq))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(data.inquiry);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  const handleCopySql = () => {
    const sql = `-- 1. Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'Web App',
  timeline TEXT NOT NULL DEFAULT 'Flexible',
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  priority TEXT NOT NULL DEFAULT 'Medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  estimated_budget TEXT
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  slug TEXT PRIMARY KEY,
  number TEXT NOT NULL DEFAULT '01',
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  status TEXT NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  headline TEXT NOT NULL,
  subhead TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  preview_type TEXT NOT NULL DEFAULT 'inbox',
  client TEXT NOT NULL DEFAULT 'Personal Project',
  role TEXT NOT NULL DEFAULT 'Full-Stack Developer',
  timeline TEXT NOT NULL DEFAULT 'Completed',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  problem TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  architecture_highlights TEXT[] NOT NULL DEFAULT '{}',
  metrics JSONB NOT NULL DEFAULT '[]'::JSONB,
  demo_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL DEFAULT '01',
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  stack TEXT[] NOT NULL DEFAULT '{}',
  turnaround TEXT,
  starting_price TEXT,
  best_for TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Inquire About This Service',
  href TEXT NOT NULL DEFAULT '/contact',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Configuration
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon on inquiries" ON public.inquiries;
CREATE POLICY "Allow anon on inquiries" ON public.inquiries FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on projects" ON public.projects;
CREATE POLICY "Allow anon on projects" ON public.projects FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on categories" ON public.categories;
CREATE POLICY "Allow anon on categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on site_settings" ON public.site_settings;
CREATE POLICY "Allow anon on site_settings" ON public.site_settings FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon on services" ON public.services;
CREATE POLICY "Allow anon on services" ON public.services FOR ALL TO public USING (true) WITH CHECK (true);
`;
    navigator.clipboard.writeText(sql);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const isMobile = width <= 768;

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = inquiries.filter((i) => i.status === "New").length;

  // -------------------------------------------------------------
  // AUTH SCREEN (NO QUICK LOGIN - SECURE SERVER AUTH)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main style={styles.authPage}>
        <div style={styles.authCard}>
          <div style={styles.authBadge}>PORTFOLIO ADMIN • SECURE CONSOLE</div>
          <h1 style={styles.authTitle}>Sign In</h1>
          <p style={styles.authSub}>
            Enter your secure administrator password to manage your projects,
            leads, and categories.
          </p>

          <form onSubmit={handleLogin} style={styles.authForm}>
            <div style={{ width: "100%" }}>
              <input
                type="password"
                placeholder="Enter password"
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setPasscodeError(null);
                }}
                style={{
                  ...styles.authInput,
                  borderColor: passcodeError ? "#ff5a5a" : "#2e362f",
                }}
              />
              {passcodeError && (
                <div style={styles.authError}>{passcodeError}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                ...styles.authButton,
                opacity: isLoggingIn ? 0.7 : 1,
              }}
            >
              {isLoggingIn ? "Verifying..." : "Login to Admin Console →"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <main style={styles.dashboardPage}>
      {/* TOP HEADER */}
      <header style={styles.topBar}>
        <div style={styles.topContainer}>
          <div style={styles.brandGroup}>
            <Link href="/" style={styles.brandTitle}>
              Zohaib<span style={{ color: "#caff46" }}>.</span>
            </Link>
            <span style={styles.adminTag}>PORTFOLIO ADMIN</span>

            <span
              style={{
                ...styles.statusPill,
                color: projectsSource === "supabase" ? "#caff46" : "#fbbf24",
                borderColor:
                  projectsSource === "supabase"
                    ? "rgba(202, 255, 70, 0.4)"
                    : "rgba(251, 191, 36, 0.4)",
              }}
            >
              <span
                style={{
                  ...styles.liveDot,
                  background:
                    projectsSource === "supabase" ? "#caff46" : "#fbbf24",
                  boxShadow: `0 0 6px ${
                    projectsSource === "supabase" ? "#caff46" : "#fbbf24"
                  }`,
                }}
              />
              {projectsSource === "supabase"
                ? "SUPABASE CLOUD ACTIVE"
                : "LOCAL STORE (SYNC READY)"}
            </span>
          </div>

          <div style={styles.topActions}>
            <button
              type="button"
              onClick={openAddProjectModal}
              style={styles.addProjectNavBtn}
            >
              + Add Project
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              Logout 🔒
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTAINER */}
      <div style={styles.mainContainer}>
        {/* TAB NAVIGATION */}
        <nav aria-label="Admin Navigation" style={styles.tabNav}>
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            style={{
              ...styles.tabItem,
              borderBottomColor:
                activeTab === "projects" ? "#caff46" : "transparent",
              color: activeTab === "projects" ? "#ffffff" : "#8e988f",
              fontWeight: activeTab === "projects" ? "700" : "500",
            }}
          >
            📁 Projects ({projects.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            style={{
              ...styles.tabItem,
              borderBottomColor:
                activeTab === "categories" ? "#caff46" : "transparent",
              color: activeTab === "categories" ? "#ffffff" : "#8e988f",
              fontWeight: activeTab === "categories" ? "700" : "500",
            }}
          >
            🏷️ Categories &amp; Eyebrows ({categories.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            style={{
              ...styles.tabItem,
              borderBottomColor:
                activeTab === "services" ? "#caff46" : "transparent",
              color: activeTab === "services" ? "#ffffff" : "#8e988f",
              fontWeight: activeTab === "services" ? "700" : "500",
            }}
          >
            🛠️ Services ({services.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            style={{
              ...styles.tabItem,
              borderBottomColor:
                activeTab === "inquiries" ? "#caff46" : "transparent",
              color: activeTab === "inquiries" ? "#ffffff" : "#8e988f",
              fontWeight: activeTab === "inquiries" ? "700" : "500",
            }}
          >
            📬 Contact Messages ({inquiries.length})
            {newCount > 0 && <span style={styles.unreadCount}>{newCount}</span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            style={{
              ...styles.tabItem,
              borderBottomColor:
                activeTab === "settings" ? "#caff46" : "transparent",
              color: activeTab === "settings" ? "#ffffff" : "#8e988f",
              fontWeight: activeTab === "settings" ? "700" : "500",
            }}
          >
            ⚙️ Settings
          </button>
        </nav>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PROJECTS CMS (CLEAN, PORTFOLIO-FOCUSED) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "projects" && (
          <div style={styles.tabContent}>
            <div style={styles.projectsCmsHeader}>
              <div>
                <h3 style={styles.panelTitle}>Showcase Projects</h3>
                <p style={styles.panelSub}>
                  Manage the projects you built. Add new builds, edit titles,
                  update descriptions, or manage links.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={openAddProjectModal}
                  style={styles.addProjectLargeBtn}
                >
                  + Add Project
                </button>
                <Link
                  href="/projects"
                  target="_blank"
                  style={styles.viewLiveSiteBtn}
                >
                  View Public Projects Page ↗
                </Link>
              </div>
            </div>

            {loading ? (
              <div style={styles.emptyState}>Loading projects...</div>
            ) : projects.length === 0 ? (
              <div style={styles.emptyState}>
                No projects added yet. Click &quot;+ Add Project&quot; above to create
                your first portfolio showcase!
              </div>
            ) : (
              <div style={styles.projectsGrid}>
                {projects.map((proj: Project) => (
                  <div key={proj.slug} style={styles.projectCmsCard}>
                    <div style={styles.projectCmsTop}>
                      <span style={styles.projectNumber}>{proj.number}</span>
                      <span style={styles.projectStatusBadge}>
                        {proj.status}
                      </span>
                    </div>

                    <h4 style={styles.projectCmsTitle}>{proj.title}</h4>
                    <div style={styles.projectSlugLine}>
                      URL: <span style={{ color: "#caff46" }}>/projects/{proj.slug}</span>
                    </div>
                    <p style={styles.projectCmsSub}>{proj.headline}</p>

                    {proj.images && proj.images.length > 0 && proj.images[0] && (
                      <div style={styles.projectCmsImageThumb}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proj.images[0]}
                          alt={proj.title}
                          style={styles.projectCmsImage}
                        />
                        <span style={styles.projectCmsImageBadge}>
                          📸 {proj.images.filter(Boolean).length} Photos
                        </span>
                      </div>
                    )}

                    <div style={styles.projectTagsMini}>
                      {proj.tags.map((t) => (
                        <span key={t} style={styles.miniTag}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div style={styles.projectCmsFooter}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => openEditProjectModal(proj)}
                          style={styles.editProjBtn}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.slug)}
                          style={styles.deleteProjBtn}
                        >
                          🗑️
                        </button>
                      </div>

                      <Link
                        href={`/projects/${proj.slug}`}
                        target="_blank"
                        style={styles.caseStudyLink}
                      >
                        Live Preview ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: CATEGORIES & EYEBROWS (ADD DYNAMICALLY) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "categories" && (
          <div style={styles.tabContent}>
            <div style={styles.panelCard}>
              <div style={styles.panelHeader}>
                <div>
                  <h3 style={styles.panelTitle}>Categories &amp; Status Eyebrows</h3>
                  <p style={styles.panelSub}>
                    Categories defined here automatically appear in the project
                    creator dropdown and as filter tabs on the public Projects
                    page.
                  </p>
                </div>
              </div>

              {/* ADD CATEGORY INPUT */}
              <div style={styles.addCategoryBox}>
                <input
                  type="text"
                  placeholder="Enter new category name (e.g. Mobile Apps, AI Agents, SaaS)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewCategory();
                    }
                  }}
                  style={styles.categoryInput}
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  disabled={isAddingCategory || !newCategoryName.trim()}
                  style={styles.addCatBtn}
                >
                  {isAddingCategory ? "Adding..." : "+ Add Category"}
                </button>
              </div>

              {/* LIST OF CATEGORIES */}
              <div style={styles.categoriesListGrid}>
                {categories.map((cat) => {
                  const count = projects.filter(
                    (p) =>
                      p.status === cat ||
                      (p.categories && p.categories.includes(cat as any))
                  ).length;

                  return (
                    <div key={cat} style={styles.categoryCard}>
                      <div>
                        <div style={styles.categoryNameText}>{cat}</div>
                        <div style={styles.categoryCountText}>
                          {count} {count === 1 ? "project" : "projects"} assigned
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        style={styles.deleteCatBtn}
                        title="Delete category"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: SERVICES CMS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "services" && (
          <div style={styles.tabContent}>
            <div style={styles.projectsCmsHeader}>
              <div>
                <h3 style={styles.panelTitle}>Services &amp; Offerings</h3>
                <p style={styles.panelSub}>
                  Manage your public service packages, deliverables, tech stacks, and turnaround timelines.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={openAddServiceModal}
                  style={styles.addProjectLargeBtn}
                >
                  + Add Service
                </button>
                <Link
                  href="/services"
                  target="_blank"
                  style={styles.viewLiveSiteBtn}
                >
                  View Public Services Page ↗
                </Link>
              </div>
            </div>

            {loading ? (
              <div style={styles.emptyState}>Loading services...</div>
            ) : services.length === 0 ? (
              <div style={styles.emptyState}>
                No services added yet. Click &quot;+ Add Service&quot; above to create
                your first service package!
              </div>
            ) : (
              <div style={styles.servicesAdminGrid}>
                {services.map((srv: Service) => (
                  <div key={srv.slug || srv.id} style={styles.serviceAdminCard}>
                    <div style={styles.projectCmsTop}>
                      <span style={styles.projectNumber}>{srv.number}</span>
                      <span style={styles.projectStatusBadge}>
                        {srv.category}
                      </span>
                    </div>

                    <h4 style={styles.projectCmsTitle}>{srv.title}</h4>
                    <div style={styles.projectSlugLine}>
                      Target Link:{" "}
                      <span style={{ color: "#caff46" }}>{srv.href || `/contact?service=${srv.slug}`}</span>
                    </div>
                    <p style={styles.projectCmsSub}>{srv.description}</p>

                    {srv.bestFor && (
                      <div style={styles.serviceBestForAdmin}>
                        <strong style={{ color: "#caff46" }}>Best For: </strong>
                        <span>{srv.bestFor}</span>
                      </div>
                    )}

                    {srv.items && srv.items.length > 0 && (
                      <div style={styles.serviceDeliverablesMini}>
                        <div style={styles.serviceMiniTitle}>Key Deliverables ({srv.items.length}):</div>
                        {srv.items.slice(0, 4).map((item, idx) => (
                          <div key={idx} style={styles.serviceMiniItem}>
                            <span style={{ color: "#caff46" }}>✓</span> {item}
                          </div>
                        ))}
                        {srv.items.length > 4 && (
                          <div style={{ fontSize: "11px", color: "#8a948c", fontStyle: "italic", marginTop: "4px" }}>
                            +{srv.items.length - 4} more deliverables
                          </div>
                        )}
                      </div>
                    )}

                    {srv.stack && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "12px 0" }}>
                        {(Array.isArray(srv.stack) ? srv.stack : srv.stack.split(",")).map((tech: string) => (
                          <span key={tech.trim()} style={styles.stackBadgeAdmin}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={styles.serviceMetaRowAdmin}>
                      {srv.timeline && (
                        <span style={styles.metaBadgeAdmin}>
                          ⏱️ {srv.timeline}
                        </span>
                      )}
                      {srv.startingPrice && (
                        <span style={styles.priceBadgeAdmin}>
                          💰 {srv.startingPrice}
                        </span>
                      )}
                    </div>

                    <div style={styles.projectCmsActions}>
                      <button
                        type="button"
                        onClick={() => openEditServiceModal(srv)}
                        style={styles.editProjectBtn}
                      >
                        ✏️ Edit Service
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv.slug || srv.id)}
                        style={styles.deleteProjectBtn}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: CONTACT FORM MESSAGES INBOX */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "inquiries" && (
          <div style={styles.tabContent}>
            <div style={styles.inboxSectionHeader}>
              <div>
                <h3 style={styles.panelTitle}>Contact Form Messages</h3>
                <p style={styles.panelSub}>
                  Website ke contact form se visitors aur clients ke bheje gaye messages.
                </p>
              </div>
            </div>

            <div style={styles.controlsBar}>
              <input
                type="text"
                placeholder="Search messages by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />

              <div style={styles.filterChips}>
                {[
                  { id: "All", label: `All (${inquiries.length})` },
                  { id: "New", label: `New (${newCount})` },
                  {
                    id: "Read",
                    label: `Read (${Math.max(0, inquiries.length - newCount)})`,
                  },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => setStatusFilter(flt.id)}
                    style={{
                      ...styles.filterChip,
                      background:
                        statusFilter === flt.id ? "#caff46" : "#171c18",
                      color: statusFilter === flt.id ? "#0c0e0d" : "#c4cbc4",
                      fontWeight: statusFilter === flt.id ? "700" : "500",
                    }}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                ...styles.inquiriesLayout,
                gridTemplateColumns:
                  selectedInquiry && !isMobile ? "1.1fr 0.9fr" : "1fr",
              }}
            >
              <div style={styles.leadsListContainer}>
                {filteredInquiries.length === 0 ? (
                  <div style={styles.emptyInboxBox}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>
                      📭
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#ffffff",
                        marginBottom: "4px",
                      }}
                    >
                      {inquiries.length === 0
                        ? "No Messages Yet"
                        : "No matching messages"}
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#8a968c",
                        maxWidth: "340px",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {inquiries.length === 0
                        ? "Jab bhi koi visitor website ke contact form se message karega, sirf wahi real message yahan show hoga."
                        : "Filter ya search term change kar ke check karein."}
                    </p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => {
                    const isSelected = selectedInquiry?.id === inq.id;
                    const isUnread = inq.status === "New";

                    return (
                      <div
                        key={inq.id}
                        style={{
                          ...styles.leadCard,
                          borderColor: isSelected
                            ? "#caff46"
                            : isUnread
                            ? "rgba(202, 255, 70, 0.4)"
                            : "#283029",
                          background: isSelected
                            ? "#181e19"
                            : isUnread
                            ? "#141914"
                            : "#111412",
                        }}
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        <div style={styles.leadHeaderRow}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                ...styles.leadAvatar,
                                background: isUnread ? "#caff46" : "#222923",
                                color: isUnread ? "#0c0e0d" : "#9ba69d",
                              }}
                            >
                              {inq.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div
                                style={{
                                  ...styles.leadName,
                                  fontWeight: isUnread ? "700" : "500",
                                }}
                              >
                                {inq.name}
                              </div>
                              <div style={styles.leadEmail}>{inq.email}</div>
                            </div>
                          </div>

                          <span
                            style={{
                              ...styles.messageStatusBadge,
                              background: isUnread
                                ? "rgba(202, 255, 70, 0.15)"
                                : "#1e2420",
                              color: isUnread ? "#caff46" : "#8a948c",
                              borderColor: isUnread
                                ? "rgba(202, 255, 70, 0.3)"
                                : "#2a332c",
                            }}
                          >
                            {isUnread ? "● NEW" : "READ"}
                          </span>
                        </div>

                        <div style={styles.leadDetailsSnippet}>
                          {inq.details}
                        </div>

                        <div style={styles.leadFooterRow}>
                          <span style={styles.leadTag}>{inq.projectType}</span>
                          {inq.timeline && (
                            <span style={styles.leadTag}>⏱ {inq.timeline}</span>
                          )}
                          <span style={styles.leadTime}>
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {selectedInquiry && (
                <div style={styles.drawerCard}>
                  <div style={styles.drawerHeader}>
                    <div>
                      <div style={styles.drawerEyebrow}>
                        WEBSITE CONTACT MESSAGE
                      </div>
                      <h3 style={styles.drawerTitle}>{selectedInquiry.name}</h3>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        style={styles.drawerEmailLink}
                      >
                        {selectedInquiry.email} ↗
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(null)}
                      style={styles.drawerCloseBtn}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={styles.messageMetaBanner}>
                    <div>
                      <span style={styles.metaKey}>PROJECT TYPE:</span>{" "}
                      <strong style={{ color: "#ffffff" }}>
                        {selectedInquiry.projectType}
                      </strong>
                    </div>
                    {selectedInquiry.timeline && (
                      <div>
                        <span style={styles.metaKey}>TIMELINE:</span>{" "}
                        <strong style={{ color: "#ffffff" }}>
                          {selectedInquiry.timeline}
                        </strong>
                      </div>
                    )}
                    <div>
                      <span style={styles.metaKey}>RECEIVED:</span>{" "}
                      <strong style={{ color: "#ffffff" }}>
                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.drawerSection}>
                    <div style={styles.drawerSectionLabel}>MESSAGE CONTENT:</div>
                    <div style={styles.messageContentBox}>
                      {selectedInquiry.details}
                    </div>
                  </div>

                  <div style={styles.drawerActions}>
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry on zohaib.dev`}
                      style={styles.replyEmailBtn}
                    >
                      ✉️ Reply via Email ↗
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          selectedInquiry.id,
                          selectedInquiry.status === "New" ? "Contacted" : "New"
                        )
                      }
                      style={styles.toggleReadBtn}
                    >
                      {selectedInquiry.status === "New"
                        ? "✓ Mark as Read"
                        : "✉️ Mark as New"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                      style={styles.deleteLeadBtn}
                      title="Delete this message"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: SETTINGS & SITE CONFIGURATION */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "settings" && (
          <div style={styles.tabContent}>
            <div style={styles.projectsCmsHeader}>
              <div>
                <h3 style={styles.panelTitle}>Portfolio Settings &amp; Site Configuration</h3>
                <p style={styles.panelSub}>
                  Manage your contact details, social URLs, availability status, admin passcode, and export full database backups.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportBackup}
                style={styles.exportBackupBtn}
              >
                📥 Export Backup (.json)
              </button>
            </div>

            {settingsSaveMsg && (
              <div
                style={{
                  ...styles.settingsMsgBanner,
                  background:
                    settingsSaveMsg.type === "success"
                      ? "rgba(202, 255, 70, 0.12)"
                      : "rgba(239, 68, 68, 0.12)",
                  borderColor:
                    settingsSaveMsg.type === "success"
                      ? "rgba(202, 255, 70, 0.4)"
                      : "rgba(239, 68, 68, 0.4)",
                  color:
                    settingsSaveMsg.type === "success"
                      ? "#caff46"
                      : "#fca5a5",
                }}
              >
                {settingsSaveMsg.type === "success" ? "✓" : "⚠️"} {settingsSaveMsg.text}
              </div>
            )}

            <form onSubmit={handleSaveSettings} style={styles.settingsGrid}>
              {/* SECTION 1: PROFILE & CONTACT */}
              <div style={styles.settingsSectionCard}>
                <div style={styles.settingsCardHeader}>
                  <span style={styles.settingsCardIcon}>👤</span>
                  <div>
                    <h4 style={styles.settingsCardTitle}>Profile &amp; Contact Info</h4>
                    <p style={styles.settingsCardSub}>Used across the website, contact forms, and inquiries.</p>
                  </div>
                </div>

                <div style={styles.settingsFields}>
                  <div>
                    <label style={styles.formLabel}>Primary Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={siteSettings.primaryEmail || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, primaryEmail: e.target.value })
                      }
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Brand / Founder Headline</label>
                    <input
                      type="text"
                      value={siteSettings.founderTitle || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, founderTitle: e.target.value })
                      }
                      placeholder="e.g. Founder of Codingskillup • Full-Stack & AI Systems Engineer"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Location / Base</label>
                    <input
                      type="text"
                      value={siteSettings.location || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, location: e.target.value })
                      }
                      placeholder="e.g. Bahawalpur, Punjab, Pakistan • Available Worldwide"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Live Availability Status Badge</label>
                    <input
                      type="text"
                      value={siteSettings.availabilityStatus || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, availabilityStatus: e.target.value })
                      }
                      placeholder="e.g. Available for new projects • Q2 2026"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Response Time Commitment</label>
                    <input
                      type="text"
                      value={siteSettings.turnaroundTime || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, turnaroundTime: e.target.value })
                      }
                      placeholder="e.g. Within 24 Hours"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Phone / WhatsApp (Optional)</label>
                    <input
                      type="text"
                      value={siteSettings.phone || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, phone: e.target.value })
                      }
                      placeholder="+92 300 1234567"
                      style={styles.formInput}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SOCIAL & SCHEDULING LINKS */}
              <div style={styles.settingsSectionCard}>
                <div style={styles.settingsCardHeader}>
                  <span style={styles.settingsCardIcon}>🌐</span>
                  <div>
                    <h4 style={styles.settingsCardTitle}>Social &amp; Meeting Links</h4>
                    <p style={styles.settingsCardSub}>Displayed in navigation, footers, and direct CTAs.</p>
                  </div>
                </div>

                <div style={styles.settingsFields}>
                  <div>
                    <label style={styles.formLabel}>GitHub Profile URL</label>
                    <input
                      type="url"
                      value={siteSettings.githubUrl || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/codingskillup"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={siteSettings.linkedinUrl || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, linkedinUrl: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/zohaib"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Twitter / X Profile URL</label>
                    <input
                      type="url"
                      value={siteSettings.twitterUrl || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, twitterUrl: e.target.value })
                      }
                      placeholder="https://x.com/username"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Calendly / Meeting Booking Link</label>
                    <input
                      type="url"
                      value={siteSettings.calendlyUrl || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, calendlyUrl: e.target.value })
                      }
                      placeholder="https://calendly.com/your-link"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Website Meta Title</label>
                    <input
                      type="text"
                      value={siteSettings.siteTitle || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, siteTitle: e.target.value })
                      }
                      placeholder="Zohaib • Full-Stack Developer & AI Systems Engineer"
                      style={styles.formInput}
                    />
                  </div>

                  <div>
                    <label style={styles.formLabel}>Short Bio / Tagline</label>
                    <input
                      type="text"
                      value={siteSettings.bioSnippet || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, bioSnippet: e.target.value })
                      }
                      placeholder="Building modern web applications, autonomous AI agents..."
                      style={styles.formInput}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: ADMIN SECURITY (CHANGE PASSWORD) */}
              <div style={styles.settingsSectionCard}>
                <div style={styles.settingsCardHeader}>
                  <span style={styles.settingsCardIcon}>🔐</span>
                  <div>
                    <h4 style={styles.settingsCardTitle}>Change Admin Password</h4>
                    <p style={styles.settingsCardSub}>Update your administrator passcode. Saved locally and in Supabase.</p>
                  </div>
                </div>

                <div style={styles.settingsFields}>
                  <div>
                    <label style={styles.formLabel}>Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password to authorize change"
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formRow2}>
                    <div>
                      <label style={styles.formLabel}>New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new strong password"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        style={styles.formInput}
                      />
                    </div>

                    <div>
                      <label style={styles.formLabel}>Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Re-type new password"
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        style={styles.formInput}
                      />
                    </div>
                  </div>

                  <div style={styles.securityHintBox}>
                    <span>🛡️</span>
                    <span style={{ fontSize: "11px", color: "#8a948c", lineHeight: "1.5" }}>
                      Leave blank if you do not want to change your password. Setting a new password will immediately update server authorization.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: DATABASE & CLOUD STATUS */}
              <div style={styles.settingsSectionCard}>
                <div style={styles.settingsCardHeader}>
                  <span style={styles.settingsCardIcon}>⚡</span>
                  <div>
                    <h4 style={styles.settingsCardTitle}>Database &amp; Storage Engine</h4>
                    <p style={styles.settingsCardSub}>Cloud database connections and active storage engine status.</p>
                  </div>
                </div>

                <div style={styles.settingsFields}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoKey}>Active Engine:</span>
                    <span
                      style={{
                        color: projectsSource === "supabase" ? "#caff46" : "#fbbf24",
                        fontWeight: "700",
                        fontSize: "12px",
                      }}
                    >
                      {projectsSource === "supabase"
                        ? "🟢 SUPABASE POSTGRESQL (CLOUD ACTIVE)"
                        : "🟡 LOCAL JSON FILE STORE (STANDALONE / SYNC READY)"}
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoKey}>Supabase URL:</span>
                    <span style={styles.infoVal}>
                      https://mzsvmxdeyrxiddbwjctt.supabase.co
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoKey}>Local File Storage:</span>
                    <span style={styles.infoVal}>
                      data/projects.json, data/services.json, data/categories.json, data/settings.json
                    </span>
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON ROW */}
              <div style={styles.settingsSaveRow}>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  style={styles.saveSettingsBtn}
                >
                  {settingsLoading ? "Saving Changes..." : "💾 Save All Settings"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SIMPLIFIED, CLEAN PROJECT MODAL (NO HR / HIRING BLOAT) */}
      {/* ------------------------------------------------------------- */}
      {isProjectModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.projectModalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>
                  {isEditingProject ? "Edit Project" : "Add New Project"}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#8a948c" }}>
                  Fill in your project details to showcase it in your portfolio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                style={styles.drawerCloseBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} style={styles.projectFormGrid}>
              {/* 1. Project Title & Order Number */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Project Name / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Lead Assistant, Task Sync Pipeline"
                    value={projectForm.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      // Auto-suggest slug only if adding and slug was empty
                      if (!isEditingProject && !projectForm.slug) {
                        const autoSlug = newTitle
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");
                        setProjectForm({
                          ...projectForm,
                          title: newTitle,
                          slug: autoSlug,
                        });
                      } else {
                        setProjectForm({ ...projectForm, title: newTitle });
                      }
                    }}
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Project Order Number (e.g. 01, 02)</label>
                  <input
                    type="text"
                    required
                    placeholder="01"
                    value={projectForm.number}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, number: e.target.value })
                    }
                    style={styles.formInput}
                  />
                </div>
              </div>

              {/* 2. URL SLUG - FULLY EDITABLE AS REQUESTED */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>
                    URL Slug (Unique Link Path) *
                  </label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={styles.slugPrefix}>/projects/</span>
                    <input
                      type="text"
                      required
                      placeholder="custom-slug"
                      value={projectForm.slug}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-"),
                        })
                      }
                      style={{
                        ...styles.formInput,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                    />
                  </div>
                  <span style={styles.inputHint}>
                    Aap jo bhi likhein ge, wahi project ka URL banega.
                  </span>
                </div>

                {/* 3. DYNAMIC CATEGORY PICKER */}
                <div>
                  <label style={styles.formLabel}>Category / Eyebrow *</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => {
                      const chosen = e.target.value;
                      setProjectForm({
                        ...projectForm,
                        status: chosen,
                        categories: [chosen],
                      });
                    }}
                    style={styles.formInput}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span style={styles.inputHint}>
                    Nayi category add karne ke liye &quot;Categories&quot; tab use karein.
                  </span>
                </div>
              </div>

              {/* 3b. CLIENT / SCOPE, ROLE & TIMELINE */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Client / Organization Scope</label>
                  <input
                    type="text"
                    placeholder="e.g. Outreach Ops, Self-Initiated, Client Project"
                    value={projectForm.client || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, client: e.target.value })
                    }
                    style={styles.formInput}
                  />
                  <span style={styles.inputHint}>
                    Case study page pe &quot;CLIENT / SCOPE&quot; ke under show hoga.
                  </span>
                </div>

                <div>
                  <label style={styles.formLabel}>Your Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Full-Stack Engineer, AI Architect"
                    value={projectForm.role || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, role: e.target.value })
                    }
                    style={styles.formInput}
                  />
                  <span style={styles.inputHint}>
                    Case study page pe &quot;ROLE&quot; ke under show hoga.
                  </span>
                </div>

                <div>
                  <label style={styles.formLabel}>Project Timeline / Status</label>
                  <input
                    type="text"
                    placeholder="e.g. Completed • Active, 3 Weeks"
                    value={projectForm.timeline || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, timeline: e.target.value })
                    }
                    style={styles.formInput}
                  />
                  <span style={styles.inputHint}>
                    Case study page pe &quot;TIMELINE&quot; ke under show hoga.
                  </span>
                </div>
              </div>

              {/* 4. Tagline / Headline */}
              <div>
                <label style={styles.formLabel}>Short Tagline / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. An inbox that knows what matters."
                  value={projectForm.headline}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, headline: e.target.value })
                  }
                  style={styles.formInput}
                />
              </div>

              {/* 4b. PRIMARY OUTCOME */}
              <div>
                <label style={styles.formLabel}>Primary Outcome / Key Result (1-2 Sentences)</label>
                <input
                  type="text"
                  placeholder="e.g. Automated cold outreach monitoring, reducing manual triage by 85%."
                  value={projectForm.outcome || ""}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, outcome: e.target.value })
                  }
                  style={styles.formInput}
                />
                <span style={styles.inputHint}>
                  Projects directory card aur case study takeaway me show hoga.
                </span>
              </div>

              {/* 4c. CASE STUDY: THE PROBLEM & THE SOLUTION */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>The Challenge / The Problem</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the problem, pain point, or manual bottleneck before this system..."
                    value={projectForm.problem || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, problem: e.target.value })
                    }
                    style={styles.formTextarea}
                  />
                  <span style={styles.inputHint}>
                    Case study me &quot;01 / THE CHALLENGE — The Problem&quot; section banata hai.
                  </span>
                </div>

                <div>
                  <label style={styles.formLabel}>The Approach / The Solution</label>
                  <textarea
                    rows={4}
                    placeholder="Describe how you architected the solution, tools integrated, and algorithms..."
                    value={projectForm.solution || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, solution: e.target.value })
                    }
                    style={styles.formTextarea}
                  />
                  <span style={styles.inputHint}>
                    Case study me &quot;02 / THE APPROACH — The Solution&quot; section banata hai.
                  </span>
                </div>
              </div>

              {/* 4d. KEY IMPACT & MEASURED RESULTS (METRICS BANNER) */}
              <div
                style={{
                  background: "#161b17",
                  border: "1px solid #283329",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <label style={styles.formLabelBold}>
                      📊 Key Impact &amp; Measured Results (Banner Metrics)
                    </label>
                    <span style={styles.imageSectionSubtitle}>
                      Case study ke top green banner me metrics pills show honge (e.g. Value: 85%, Label: Manual Overhead Reduced).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (projectMetrics.length < 4) {
                        setProjectMetrics([
                          ...projectMetrics,
                          { value: "", label: "" },
                        ]);
                      }
                    }}
                    disabled={projectMetrics.length >= 4}
                    style={{
                      background:
                        projectMetrics.length >= 4 ? "#1a201c" : "#242e26",
                      color:
                        projectMetrics.length >= 4 ? "#627064" : "#caff46",
                      border: "1px solid #334235",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor:
                        projectMetrics.length >= 4 ? "not-allowed" : "pointer",
                    }}
                  >
                    + Add Metric Pill
                  </button>
                </div>

                {projectMetrics.length === 0 ? (
                  <div
                    style={{
                      padding: "14px",
                      textAlign: "center",
                      fontSize: "12px",
                      color: "#7e8f80",
                      border: "1px dashed #263328",
                      borderRadius: "6px",
                    }}
                  >
                    No impact metrics added yet. Click &quot;+ Add Metric Pill&quot; to highlight numbers like &quot;85% Reduced&quot;, &quot;99.9% Uptime&quot;, etc.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {projectMetrics.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "140px 1fr auto",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Value (e.g. 85%)"
                          value={m.value}
                          onChange={(e) => {
                            const updated = [...projectMetrics];
                            updated[idx] = {
                              ...updated[idx],
                              value: e.target.value,
                            };
                            setProjectMetrics(updated);
                          }}
                          style={styles.formInput}
                        />
                        <input
                          type="text"
                          placeholder="Label (e.g. Manual Overhead Reduced)"
                          value={m.label}
                          onChange={(e) => {
                            const updated = [...projectMetrics];
                            updated[idx] = {
                              ...updated[idx],
                              label: e.target.value,
                            };
                            setProjectMetrics(updated);
                          }}
                          style={styles.formInput}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProjectMetrics(
                              projectMetrics.filter((_, i) => i !== idx)
                            );
                          }}
                          style={{
                            background: "transparent",
                            border: "1px solid #3d2323",
                            color: "#f87171",
                            borderRadius: "6px",
                            padding: "9px 12px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                          title="Remove Metric"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Project Description (What it does) */}
              <div>
                <label style={styles.formLabel}>About the Project / Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what you built and how it works..."
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  style={styles.formTextarea}
                />
              </div>

              {/* 6. Key Features (1 per line) */}
              <div>
                <label style={styles.formLabel}>Key Features / What Was Built (1 per line)</label>
                <textarea
                  rows={3}
                  placeholder="Feature 1: Real-time message streaming&#10;Feature 2: AI intent classification&#10;Feature 3: One-click actions"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  style={styles.formTextarea}
                />
              </div>

              {/* 7. Tech Stack */}
              <div>
                <label style={styles.formLabel}>Tech Stack (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Next.js, TypeScript, OpenAI, Supabase, Tailwind CSS"
                  value={techTagsInput}
                  onChange={(e) => setTechTagsInput(e.target.value)}
                  style={styles.formInput}
                />
              </div>

              {/* 8. PROJECT IMAGES & SCREENSHOTS (UP TO 3 PICTURES) */}
              <div style={styles.imageUploadSection}>
                <div style={styles.imageSectionHeader}>
                  <label style={styles.formLabelBold}>
                    📸 Project Screenshots &amp; Pictures (3 Slots)
                  </label>
                  <span style={styles.imageSectionSubtitle}>
                    Her project ki 3 photos upload kar sakhte hain. Slot 1 main cover photo banegi jo project card aur main page par display hogi.
                  </span>
                  {uploadError && (
                    <div style={styles.uploadErrorText}>⚠️ {uploadError}</div>
                  )}
                </div>

                <div style={styles.imageSlotsGrid}>
                  {[0, 1, 2].map((slotIdx) => {
                    const imgUrl = (projectForm.images || [])[slotIdx] || "";
                    const isUploading = uploadingSlot === slotIdx;
                    const slotTitles = [
                      "1. Main Cover Photo",
                      "2. Feature Screenshot",
                      "3. Detail / UI Photo",
                    ];

                    return (
                      <div key={slotIdx} style={styles.imageSlotCard}>
                        <div style={styles.imageSlotHeader}>
                          <span style={styles.slotBadge}>
                            {slotTitles[slotIdx]}
                          </span>
                          {imgUrl && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(slotIdx)}
                              style={styles.removeImageBtn}
                              title="Delete picture"
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>

                        {imgUrl ? (
                          <div style={styles.imageSlotPreviewWrap}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`Slot ${slotIdx + 1}`}
                              style={styles.imageSlotThumb}
                            />
                            <div style={styles.imageSlotActions}>
                              <label style={styles.replaceBtn}>
                                {isUploading ? "Uploading..." : "🔄 Change"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  disabled={isUploading}
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleImageUpload(e.target.files[0], slotIdx);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label style={styles.emptySlotDropzone}>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              disabled={isUploading}
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleImageUpload(e.target.files[0], slotIdx);
                                }
                              }}
                            />
                            <span style={styles.uploadIconCircle}>
                              {isUploading ? "⏳" : "📁"}
                            </span>
                            <span style={styles.uploadPromptTitle}>
                              {isUploading ? "Uploading..." : "+ Upload Image"}
                            </span>
                            <span style={styles.uploadPromptSub}>
                              PNG, JPG, WEBP
                            </span>
                          </label>
                        )}

                        <input
                          type="text"
                          placeholder="Or direct image URL"
                          value={imgUrl}
                          onChange={(e) =>
                            handleImageUrlChange(e.target.value, slotIdx)
                          }
                          style={styles.imageUrlInput}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 9. Fallback CSS Mockup Theme */}
              <div style={styles.fallbackMockupBox}>
                <label style={styles.formLabel}>
                  Fallback Illustration Theme (Only active if no pictures uploaded above)
                </label>
                <select
                  value={projectForm.previewType}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      previewType: e.target.value as Project["previewType"],
                    })
                  }
                  style={styles.formInput}
                >
                  {PREVIEW_TYPES.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 9. Live Demo & GitHub Links */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Live Demo / Website Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={projectForm.demoUrl || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, demoUrl: e.target.value })
                    }
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>GitHub Repository Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={projectForm.githubUrl || ""}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        githubUrl: e.target.value,
                      })
                    }
                    style={styles.formInput}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={styles.modalButtonsRow}>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  style={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.modalSubmitBtn}>
                  {isEditingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SERVICE ADD/EDIT MODAL */}
      {/* ------------------------------------------------------------- */}
      {isServiceModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.projectModalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>
                  {isEditingService ? "Edit Service Offering" : "Add New Service Offering"}
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#8a948c" }}>
                  Configure what you offer, key deliverables, technologies, and estimated turnaround.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                style={styles.drawerCloseBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} style={styles.projectFormGrid}>
              {/* 1. Service Title & Number */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Agents & Autonomous Workflows"
                    value={serviceForm.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      if (!isEditingService && !serviceForm.slug) {
                        const autoSlug = newTitle
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");
                        setServiceForm({
                          ...serviceForm,
                          title: newTitle,
                          slug: autoSlug,
                          href: `/contact?service=${autoSlug}`,
                        });
                      } else {
                        setServiceForm({ ...serviceForm, title: newTitle });
                      }
                    }}
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Order Number (e.g. 01, 02)</label>
                  <input
                    type="text"
                    required
                    placeholder="01"
                    value={serviceForm.number}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, number: e.target.value })
                    }
                    style={styles.formInput}
                  />
                </div>
              </div>

              {/* 2. URL Slug & Category */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Service Slug (Identifier) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ai-agents-autonomous-workflows"
                    value={serviceForm.slug}
                    onChange={(e) => {
                      const val = e.target.value;
                      setServiceForm({
                        ...serviceForm,
                        slug: val,
                        href: `/contact?service=${val}`,
                      });
                    }}
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Category / Eyebrow *</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <select
                      value={serviceForm.category}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, category: e.target.value })
                      }
                      style={{ ...styles.formSelect, flex: 1 }}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      {!categories.includes(serviceForm.category) && serviceForm.category && (
                        <option value={serviceForm.category}>
                          {serviceForm.category}
                        </option>
                      )}
                    </select>
                    <input
                      type="text"
                      placeholder="Or type custom"
                      value={serviceForm.category}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, category: e.target.value })
                      }
                      style={{ ...styles.formInput, width: "160px" }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Description */}
              <div>
                <label style={styles.formLabel}>Service Overview / Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Clear 1-2 sentence description explaining what client value this delivers..."
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, description: e.target.value })
                  }
                  style={styles.formTextarea}
                />
              </div>

              {/* 4. Deliverables Checklist */}
              <div>
                <label style={styles.formLabel}>
                  Deliverables Checklist (1 item per line) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Custom autonomous agents connected to APIs&#10;Tool calling, structured JSON output&#10;Prompt security, guardrails & observability"
                  value={serviceItemsInput}
                  onChange={(e) => setServiceItemsInput(e.target.value)}
                  style={styles.formTextarea}
                />
              </div>

              {/* 5. Best For */}
              <div>
                <label style={styles.formLabel}>
                  Best Suited For (Ideal Client / Use Case)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founders wanting to automate customer intake or data aggregation"
                  value={serviceForm.bestFor || ""}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, bestFor: e.target.value })
                  }
                  style={styles.formInput}
                />
              </div>

              {/* 6. Turnaround (Timeline) & Starting Price */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Estimated Turnaround (Timeline)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 - 2 Weeks, 2 - 4 Weeks"
                    value={serviceForm.timeline || ""}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, timeline: e.target.value })
                    }
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Starting Price / Scope (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Custom quote / From $1,200"
                    value={serviceForm.startingPrice || ""}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, startingPrice: e.target.value })
                    }
                    style={styles.formInput}
                  />
                </div>
              </div>

              {/* 7. Tech Stack */}
              <div>
                <label style={styles.formLabel}>
                  Technologies &amp; Frameworks (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js, TypeScript, OpenAI API, LangChain, Supabase"
                  value={serviceForm.stack || ""}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, stack: e.target.value })
                  }
                  style={styles.formInput}
                />
              </div>

              {/* 8. Call to Action & Link */}
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.formLabel}>Button Text (CTA)</label>
                  <input
                    type="text"
                    placeholder="Inquire About This Service"
                    value={serviceForm.cta || "Inquire About This Service"}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, cta: e.target.value })
                    }
                    style={styles.formInput}
                  />
                </div>

                <div>
                  <label style={styles.formLabel}>Action Target Link</label>
                  <input
                    type="text"
                    placeholder="/contact?service=slug"
                    value={serviceForm.href || `/contact?service=${serviceForm.slug}`}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, href: e.target.value })
                    }
                    style={styles.formInput}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={styles.modalButtonsRow}>
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  style={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.modalSubmitBtn}>
                  {isEditingService ? "Save Service Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

// Helper badge styles
function getStatusBadgeStyle(status: InquiryStatus): CSSProperties {
  switch (status) {
    case "New":
      return {
        background: "rgba(202, 255, 70, 0.15)",
        color: "#caff46",
        border: "1px solid rgba(202, 255, 70, 0.4)",
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: "700",
      };
    case "Contacted":
      return {
        background: "rgba(59, 130, 246, 0.15)",
        color: "#60a5fa",
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: "700",
      };
    case "In Progress":
      return {
        background: "rgba(234, 179, 8, 0.15)",
        color: "#facc15",
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: "700",
      };
    case "Closed Won":
      return {
        background: "rgba(34, 197, 94, 0.15)",
        color: "#4ade80",
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: "700",
      };
    case "Archived":
      return {
        background: "rgba(156, 163, 175, 0.15)",
        color: "#9ca3af",
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: "700",
      };
  }
}

const styles: Record<string, CSSProperties> = {
  authPage: {
    minHeight: "100vh",
    background: "#0c0e0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  authCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "14px",
    padding: "44px 32px",
    boxSizing: "border-box",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },
  authBadge: {
    color: "#caff46",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "14px",
  },
  authTitle: {
    margin: "0 0 10px",
    fontSize: "26px",
    color: "#ffffff",
    fontWeight: "500",
  },
  authSub: {
    margin: "0 0 28px",
    fontSize: "13px",
    color: "#9aa39b",
    lineHeight: "1.6",
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  authInput: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "8px",
    background: "#181d19",
    border: "1px solid #2e362f",
    color: "#ffffff",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  authError: {
    color: "#ff5a5a",
    fontSize: "12px",
    marginTop: "6px",
    textAlign: "left",
  },
  authButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    background: "#caff46",
    color: "#0c0e0d",
    fontWeight: "700",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
  },

  dashboardPage: {
    minHeight: "100vh",
    background: "#0c0e0d",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    paddingBottom: "80px",
  },
  topBar: {
    background: "#111412",
    borderBottom: "1px solid #252c26",
    position: "sticky",
    top: 0,
    zIndex: 900,
  },
  topContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  brandTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
    textDecoration: "none",
  },
  adminTag: {
    fontSize: "9px",
    fontWeight: "800",
    background: "#1c231e",
    border: "1px solid #323d34",
    padding: "3px 6px",
    borderRadius: "4px",
    color: "#caff46",
  },
  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    fontWeight: "600",
    background: "#161b17",
    padding: "4px 8px",
    borderRadius: "12px",
    border: "1px solid #2a332c",
  },
  liveDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  topActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  addProjectNavBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  newLeadBtn: {
    background: "#19221a",
    color: "#caff46",
    border: "1px solid #2e3b2f",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "#191f1a",
    border: "1px solid #2d362e",
    color: "#c4cbc4",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
  supabaseNoticeBanner: {
    background: "rgba(251, 191, 36, 0.1)",
    borderBottom: "1px solid rgba(251, 191, 36, 0.3)",
    padding: "10px 24px",
    fontSize: "12px",
    color: "#fbbf24",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  setupSqlBtn: {
    background: "#fbbf24",
    color: "#0c0e0d",
    border: "none",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },
  dismissBannerBtn: {
    background: "transparent",
    color: "#fbbf24",
    border: "1px solid rgba(251, 191, 36, 0.4)",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },
  mainContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "24px 24px 0",
    boxSizing: "border-box",
  },
  tabNav: {
    display: "flex",
    gap: "24px",
    borderBottom: "1px solid #252c26",
    marginBottom: "32px",
    overflowX: "auto",
  },
  tabItem: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "12px 4px",
    fontSize: "14px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  },
  unreadCount: {
    background: "#caff46",
    color: "#0c0e0d",
    fontSize: "10px",
    fontWeight: "800",
    padding: "2px 6px",
    borderRadius: "10px",
  },
  tabContent: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  // Projects CMS tab
  projectsCmsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
  },
  panelSub: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#8e988f",
  },
  addProjectLargeBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  viewLiveSiteBtn: {
    background: "#181f19",
    border: "1px solid #caff46",
    color: "#caff46",
    padding: "10px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#8e988f",
    background: "#121512",
    borderRadius: "8px",
    border: "1px solid #262e27",
  },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  projectCmsCard: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "10px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
  },
  projectCmsTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  projectNumber: {
    color: "#caff46",
    fontSize: "11px",
    fontWeight: "700",
  },
  projectStatusBadge: {
    fontSize: "10px",
    color: "#caff46",
    background: "rgba(202, 255, 70, 0.1)",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  projectCmsTitle: {
    margin: "0 0 4px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
  },
  projectSlugLine: {
    fontSize: "11px",
    color: "#7e887f",
    marginBottom: "8px",
  },
  projectCmsSub: {
    margin: 0,
    fontSize: "13px",
    color: "#8e988f",
    lineHeight: "1.5",
  },
  projectTagsMini: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginTop: "14px",
    marginBottom: "16px",
  },
  miniTag: {
    fontSize: "10px",
    color: "#cbd4cc",
    background: "#181e19",
    border: "1px solid #263027",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  projectCmsFooter: {
    marginTop: "auto",
    paddingTop: "14px",
    borderTop: "1px solid #222923",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editProjBtn: {
    background: "#1c241e",
    border: "1px solid #364438",
    color: "#caff46",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  deleteProjBtn: {
    background: "#261717",
    border: "1px solid #4a2222",
    color: "#f87171",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
  caseStudyLink: {
    fontSize: "12px",
    color: "#8a968c",
    textDecoration: "none",
  },

  // Category Tab Styles
  addCategoryBox: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
    marginBottom: "24px",
    maxWidth: "540px",
  },
  categoryInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "6px",
    background: "#181d19",
    border: "1px solid #2c362e",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
  },
  addCatBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  categoriesListGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },
  categoryCard: {
    background: "#171c18",
    border: "1px solid #263028",
    borderRadius: "8px",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryNameText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
  },
  categoryCountText: {
    fontSize: "11px",
    color: "#839085",
    marginTop: "2px",
  },
  deleteCatBtn: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px 8px",
  },

  // Inquiries Tab
  controlsBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: "1 1 280px",
    maxWidth: "420px",
    padding: "10px 14px",
    borderRadius: "6px",
    background: "#141815",
    border: "1px solid #2a332b",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
  },
  filterChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  filterChip: {
    border: "1px solid #2a332b",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "11px",
    cursor: "pointer",
  },
  inquiriesLayout: {
    display: "grid",
    gap: "24px",
    alignItems: "start",
  },
  leadsListContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  leadCard: {
    borderRadius: "10px",
    border: "1px solid #283029",
    padding: "18px 20px",
    cursor: "pointer",
  },
  leadHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  leadName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#ffffff",
  },
  leadEmail: {
    fontSize: "11px",
    color: "#839085",
  },
  leadDetailsSnippet: {
    fontSize: "13px",
    color: "#bac4bb",
    lineHeight: "1.5",
    marginBottom: "12px",
  },
  leadFooterRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
  },
  leadTag: {
    background: "#182019",
    border: "1px solid #2a372c",
    borderRadius: "4px",
    padding: "3px 8px",
    color: "#cbd5cb",
    fontSize: "10px",
  },
  leadTime: {
    marginLeft: "auto",
    color: "#748076",
    fontSize: "10px",
  },
  leadAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#242e26",
    color: "#caff46",
    fontWeight: "700",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Drawer
  drawerCard: {
    background: "#121512",
    border: "1px solid #caff46",
    borderRadius: "10px",
    padding: "24px",
    position: "sticky",
    top: "80px",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  drawerEyebrow: {
    fontSize: "9px",
    fontWeight: "700",
    color: "#caff46",
    letterSpacing: "1px",
    marginBottom: "4px",
  },
  drawerTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
  },
  drawerEmailLink: {
    fontSize: "12px",
    color: "#8e988f",
    textDecoration: "none",
    marginTop: "2px",
    display: "inline-block",
  },
  drawerCloseBtn: {
    background: "transparent",
    border: "none",
    color: "#8e988f",
    fontSize: "16px",
    cursor: "pointer",
  },
  drawerSection: {
    marginTop: "18px",
  },
  drawerSectionLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#838d85",
    letterSpacing: "0.8px",
    marginBottom: "8px",
  },
  statusButtonsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  statusActionBtn: {
    border: "1px solid #2a332b",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    cursor: "pointer",
  },
  messageContentBox: {
    background: "#181d19",
    border: "1px solid #2a352c",
    borderRadius: "6px",
    padding: "14px",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#e2e8e2",
    whiteSpace: "pre-wrap",
  },
  notesTextarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    background: "#181d19",
    border: "1px solid #2e3830",
    color: "#ffffff",
    fontSize: "12px",
    lineHeight: "1.5",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
  },
  saveNoteBtn: {
    background: "#242e26",
    color: "#caff46",
    border: "1px solid #364438",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  drawerActions: {
    display: "flex",
    gap: "10px",
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: "1px solid #252d26",
  },
  replyEmailBtn: {
    flex: 1,
    background: "#caff46",
    color: "#0c0e0d",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    textAlign: "center",
  },
  deleteLeadBtn: {
    background: "#1d1515",
    color: "#f87171",
    border: "1px solid #3d2323",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },

  // Supabase tab
  panelCard: {
    background: "#121512",
    border: "1px solid #282f29",
    borderRadius: "10px",
    padding: "24px",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  copySqlBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  sqlDetailsBox: {
    background: "#171c18",
    border: "1px solid #283229",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    fontSize: "13px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  sqlStep: {
    color: "#c8d0c8",
  },
  sqlCodeBlock: {
    background: "#0d0f0e",
    border: "1px solid #262e27",
    borderRadius: "8px",
    padding: "18px",
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#d0d9d0",
    overflowX: "auto",
    lineHeight: "1.6",
  },

  // Settings
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #222823",
    fontSize: "13px",
  },
  infoKey: {
    color: "#889489",
  },
  infoVal: {
    color: "#ffffff",
    fontWeight: "600",
  },

  // Modal styles
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(6px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    overflowY: "auto",
  },
  modalCard: {
    width: "100%",
    maxWidth: "500px",
    background: "#121512",
    border: "1px solid #caff46",
    borderRadius: "12px",
    padding: "28px",
    boxSizing: "border-box",
  },
  projectModalCard: {
    width: "100%",
    maxWidth: "680px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#121512",
    border: "1px solid #caff46",
    borderRadius: "14px",
    padding: "28px 30px",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #252d26",
    paddingBottom: "14px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  projectFormGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formRow2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },
  formLabel: {
    fontSize: "11px",
    color: "#8fa091",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
  },
  formInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    background: "#181d19",
    border: "1px solid #2c362e",
    color: "#ffffff",
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none",
  },
  formTextarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    background: "#181d19",
    border: "1px solid #2c362e",
    color: "#ffffff",
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  slugPrefix: {
    background: "#141815",
    border: "1px solid #2c362e",
    borderRight: "none",
    color: "#7e887f",
    padding: "10px 10px",
    fontSize: "12px",
    borderTopLeftRadius: "6px",
    borderBottomLeftRadius: "6px",
    userSelect: "none",
  },
  inputHint: {
    fontSize: "10px",
    color: "#748076",
    marginTop: "4px",
    display: "block",
  },
  modalButtonsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #242c25",
  },
  modalCancelBtn: {
    background: "transparent",
    border: "1px solid #2c362e",
    color: "#9aa39b",
    padding: "10px 18px",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
  modalSubmitBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "10px 22px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // 3-Images Upload Styles
  imageUploadSection: {
    background: "#161b17",
    border: "1px solid #283329",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  imageSectionHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  formLabelBold: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#caff46",
    letterSpacing: "0.4px",
  },
  imageSectionSubtitle: {
    fontSize: "11px",
    color: "#8da090",
    lineHeight: "1.4",
  },
  uploadErrorText: {
    fontSize: "11px",
    color: "#ff6b6b",
    marginTop: "4px",
  },
  imageSlotsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "4px",
  },
  imageSlotCard: {
    background: "#101411",
    border: "1px solid #232c24",
    borderRadius: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  imageSlotHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "6px",
  },
  slotBadge: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#9db3a0",
  },
  removeImageBtn: {
    background: "transparent",
    border: "none",
    color: "#f87171",
    fontSize: "10px",
    cursor: "pointer",
    padding: "2px 4px",
    fontWeight: "600",
  },
  imageSlotPreviewWrap: {
    position: "relative",
    width: "100%",
    height: "120px",
    borderRadius: "6px",
    overflow: "hidden",
    background: "#0a0d0b",
    border: "1px solid #2c382e",
  },
  imageSlotThumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageSlotActions: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    zIndex: 2,
  },
  replaceBtn: {
    background: "rgba(10, 14, 11, 0.85)",
    backdropFilter: "blur(4px)",
    color: "#caff46",
    border: "1px solid rgba(202, 255, 70, 0.4)",
    fontSize: "10px",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "inline-block",
  },
  emptySlotDropzone: {
    width: "100%",
    height: "120px",
    borderRadius: "6px",
    border: "2px dashed #2d3b2f",
    background: "rgba(20, 26, 21, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    cursor: "pointer",
    padding: "10px",
    boxSizing: "border-box",
  },
  uploadIconCircle: {
    fontSize: "20px",
  },
  uploadPromptTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#caff46",
  },
  uploadPromptSub: {
    fontSize: "9px",
    color: "#7e8f80",
  },
  imageUrlInput: {
    width: "100%",
    padding: "6px 8px",
    borderRadius: "4px",
    background: "#161b17",
    border: "1px solid #283329",
    color: "#ffffff",
    fontSize: "10px",
    boxSizing: "border-box",
    outline: "none",
  },
  fallbackMockupBox: {
    background: "#141815",
    border: "1px solid #242c25",
    borderRadius: "8px",
    padding: "12px 14px",
  },
  projectCmsImageThumb: {
    position: "relative",
    width: "100%",
    height: "140px",
    borderRadius: "6px",
    overflow: "hidden",
    marginTop: "10px",
    marginBottom: "10px",
    border: "1px solid #263327",
  },
  projectCmsImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  projectCmsImageBadge: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    background: "rgba(12, 14, 13, 0.85)",
    backdropFilter: "blur(4px)",
    color: "#caff46",
    fontSize: "9px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "10px",
    border: "1px solid rgba(202, 255, 70, 0.3)",
  },

  // Contact Messages Inbox styles
  inboxSectionHeader: {
    marginBottom: "18px",
  },
  emptyInboxBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    background: "#111412",
    borderRadius: "10px",
    border: "1px dashed #283329",
    textAlign: "center",
  },
  messageStatusBadge: {
    fontSize: "9px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "12px",
    border: "1px solid",
    letterSpacing: "0.5px",
  },
  messageMetaBanner: {
    background: "#161b17",
    border: "1px solid #283329",
    borderRadius: "6px",
    padding: "10px 14px",
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    fontSize: "11px",
    marginBottom: "16px",
  },
  metaKey: {
    color: "#839185",
    fontWeight: "700",
    fontSize: "9px",
    letterSpacing: "0.5px",
  },
  toggleReadBtn: {
    background: "#1e241f",
    border: "1px solid #323d34",
    color: "#cbd5cc",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Services CMS Admin styles
  servicesAdminGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "20px",
  },
  serviceAdminCard: {
    background: "#121512",
    border: "1px solid #222a23",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    transition: "border-color 0.2s ease",
  },
  serviceBestForAdmin: {
    fontSize: "12px",
    lineHeight: "1.5",
    color: "#cbd5cc",
    background: "#161b17",
    border: "1px solid #252e26",
    borderRadius: "6px",
    padding: "8px 12px",
    marginBottom: "12px",
  },
  serviceDeliverablesMini: {
    background: "#0c0e0d",
    border: "1px solid #1f2720",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "12px",
  },
  serviceMiniTitle: {
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "#839185",
    marginBottom: "8px",
  },
  serviceMiniItem: {
    fontSize: "12px",
    color: "#d0d8d1",
    lineHeight: "1.5",
    marginBottom: "4px",
  },
  serviceMetaRowAdmin: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: "12px",
    borderTop: "1px solid #1f2720",
    marginBottom: "16px",
  },
  metaBadgeAdmin: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#a4b0a5",
    background: "#161b17",
    border: "1px solid #252e26",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  priceBadgeAdmin: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#caff46",
    background: "rgba(202, 255, 70, 0.08)",
    border: "1px solid rgba(202, 255, 70, 0.3)",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  stackBadgeAdmin: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#8e988f",
    background: "#181d19",
    border: "1px solid #263028",
    padding: "3px 8px",
    borderRadius: "4px",
  },

  // Settings CMS Styles
  exportBackupBtn: {
    background: "#1c231e",
    border: "1px solid #323f34",
    color: "#caff46",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  settingsMsgBanner: {
    padding: "14px 18px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
    gap: "24px",
  },
  settingsSectionCard: {
    background: "#121512",
    border: "1px solid #222a23",
    borderRadius: "12px",
    padding: "26px",
    display: "flex",
    flexDirection: "column",
  },
  settingsCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #1f2720",
  },
  settingsCardIcon: {
    fontSize: "24px",
    lineHeight: 1,
  },
  settingsCardTitle: {
    margin: "0 0 4px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
  },
  settingsCardSub: {
    margin: 0,
    fontSize: "12px",
    color: "#839185",
    lineHeight: "1.4",
  },
  settingsFields: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  securityHintBox: {
    background: "#161b17",
    border: "1px solid #252e26",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  settingsSaveRow: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "12px",
  },
  saveSettingsBtn: {
    background: "#caff46",
    color: "#0c0e0d",
    border: "none",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(202, 255, 70, 0.25)",
    transition: "all 0.2s ease",
  },
};
