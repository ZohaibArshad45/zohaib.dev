export type SiteSettings = {
  adminPassword?: string;
  primaryEmail: string;
  phone?: string;
  location: string;
  founderTitle: string;
  availabilityStatus: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  calendlyUrl: string;
  siteTitle: string;
  turnaroundTime: string;
  bioSnippet: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  primaryEmail: "zohaibfta@gmail.com",
  phone: "",
  location: "Bahawalpur, Punjab, Pakistan",
  founderTitle: "Founder of Codingskillup • Full-Stack & AI Systems Engineer",
  availabilityStatus: "Available for new projects •",
  githubUrl: "https://github.com/codingskillup",
  linkedinUrl: "https://linkedin.com/in/",
  twitterUrl: "https://x.com/",
  calendlyUrl: "",
  siteTitle: "Zohaib • Full-Stack Developer & AI Systems Engineer",
  turnaroundTime: "Within 24 Hours",
  bioSnippet:
    "Building modern web applications, autonomous AI agents, and frictionless business automation pipelines.",
};
