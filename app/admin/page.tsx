import type { Metadata } from "next";
import AdminDashboard from "@/components/Admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Console | Zohaib - Web Developer & AI Builder",
  description: "Private administration portal for client leads, projects CMS, and portfolio operations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
