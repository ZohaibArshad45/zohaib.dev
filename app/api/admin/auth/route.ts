import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || "786109Sz9@";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    // Check if password matches
    let isValid = password === EXPECTED_PASSWORD;

    // Optional: Also check Supabase settings if present
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "admin_password")
        .single();

      if (data?.value && data.value === password) {
        isValid = true;
      }
    } catch {
      // Fallback to env password
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Generate session token
    const token = Buffer.from(
      JSON.stringify({
        authenticated: true,
        timestamp: Date.now(),
      })
    ).toString("base64");

    const response = NextResponse.json({
      success: true,
      token,
      message: "Authenticated successfully",
    });

    response.cookies.set("zohaib_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during authentication" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Check cookie or header session
  const cookieHeader = request.headers.get("cookie") || "";
  const hasCookie = cookieHeader.includes("zohaib_admin_session=");

  return NextResponse.json({
    authenticated: hasCookie,
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("zohaib_admin_session");
  return response;
}
