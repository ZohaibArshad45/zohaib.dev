import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/supabase";
import { getLocalSettings } from "@/lib/settingsStore";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { settings, source } = await getSiteSettings();
    // Do not return raw adminPassword hash in public response
    const sanitized = { ...settings };
    delete sanitized.adminPassword;

    return NextResponse.json({
      success: true,
      settings: sanitized,
      source,
    });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      primaryEmail,
      phone,
      location,
      founderTitle,
      availabilityStatus,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      calendlyUrl,
      siteTitle,
      turnaroundTime,
      bioSnippet,
      currentPassword,
      newPassword,
    } = body;

    const updates: Record<string, any> = {};

    if (primaryEmail !== undefined) updates.primaryEmail = primaryEmail;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (founderTitle !== undefined) updates.founderTitle = founderTitle;
    if (availabilityStatus !== undefined) updates.availabilityStatus = availabilityStatus;
    if (githubUrl !== undefined) updates.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updates.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) updates.twitterUrl = twitterUrl;
    if (calendlyUrl !== undefined) updates.calendlyUrl = calendlyUrl;
    if (siteTitle !== undefined) updates.siteTitle = siteTitle;
    if (turnaroundTime !== undefined) updates.turnaroundTime = turnaroundTime;
    if (bioSnippet !== undefined) updates.bioSnippet = bioSnippet;

    // Handle Password Change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Current password is required to set a new password.",
          },
          { status: 400 }
        );
      }

      // Verify current password against local settings or env or Supabase
      const local = await getLocalSettings();
      let expected =
        local.adminPassword ||
        process.env.ADMIN_PASSWORD ||
        "786109Sz9@";

      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "admin_password")
          .single();
        if (data?.value) {
          expected = data.value;
        }
      } catch {
        // use expected
      }

      if (currentPassword !== expected) {
        return NextResponse.json(
          {
            success: false,
            message: "Current password does not match.",
          },
          { status: 401 }
        );
      }

      updates.adminPassword = newPassword;
    }

    const { settings, source } = await saveSiteSettings(updates);
    const sanitized = { ...settings };
    delete sanitized.adminPassword;

    return NextResponse.json({
      success: true,
      settings: sanitized,
      source,
      message: newPassword
        ? "Settings & new admin password saved successfully!"
        : "Settings updated successfully!",
    });
  } catch (error) {
    console.error("PATCH /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
