import { NextResponse } from "next/server";
import { getUpcomingProjects } from "@/lib/supabase";

export async function GET() {
  try {
    const { source, upcomingProjects } = await getUpcomingProjects();
    return NextResponse.json({
      success: true,
      upcomingProjects,
      source,
    });
  } catch (error) {
    console.error("GET /api/upcoming error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch upcoming projects" },
      { status: 500 }
    );
  }
}
