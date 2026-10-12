import ContactSection from "@/components/MainPage/ContactSection";
import { getSiteSettings } from "@/lib/supabase";

export const metadata = {
  title: "Contact • Discuss Your Project With Zohaib",
  description:
    "Send a message or project scope. Available for modern web applications, AI engineering, and automation workflows.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { settings } = await getSiteSettings();
  return <ContactSection settings={settings} />;
}