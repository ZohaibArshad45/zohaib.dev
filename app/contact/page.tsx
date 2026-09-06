import { Suspense } from "react";
import ContactSection from "@/components/MainPage/ContactSection";

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#0c0e0d",
          }}
        />
      }
    >
      <ContactSection />
    </Suspense>
  );
}