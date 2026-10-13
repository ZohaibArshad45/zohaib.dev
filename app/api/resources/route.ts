import { NextResponse } from "next/server";
import { getResources, updateResource } from "@/lib/supabase";

export async function GET() {
  try {
    const { resources } = await getResources();
    return NextResponse.json({ success: true, resources });
  } catch (error) {
    console.error("GET /api/resources error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load resources" },
      { status: 500 }
    );
  }
}

// Track downloads count
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const { resources } = await getResources();
    const target = resources.find((r) => r.id === id || r.slug === id);
    if (!target) {
      return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    const updated = await updateResource(target.id, {
      downloadsCount: (target.downloadsCount || 0) + 1,
    });

    return NextResponse.json({
      success: true,
      downloadsCount: updated.resource?.downloadsCount || target.downloadsCount + 1,
    });
  } catch (error) {
    console.error("POST /api/resources download track error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to track download" },
      { status: 500 }
    );
  }
}
