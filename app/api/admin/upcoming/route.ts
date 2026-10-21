import { NextResponse } from "next/server";
import {
  getUpcomingProjects,
  addUpcomingProject,
  updateUpcomingProject,
  deleteUpcomingProject,
} from "@/lib/supabase";
import type { UpcomingProject } from "@/lib/upcoming";

export async function GET() {
  try {
    const { source, upcomingProjects } = await getUpcomingProjects();
    return NextResponse.json({ success: true, upcomingProjects, source });
  } catch (error) {
    console.error("GET /api/admin/upcoming error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch upcoming projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, message: "Project title is required." },
        { status: 400 }
      );
    }

    const slug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const newProject: UpcomingProject = {
      id: body.id || `up-${Date.now()}`,
      slug,
      number: body.number || "01",
      title: body.title,
      shortTitle: body.shortTitle || body.title,
      category: body.category || "AI Agents",
      status: body.status || "In Development",
      targetRelease: body.targetRelease || "Q1 2027",
      progress: typeof body.progress === "number" ? body.progress : 50,
      priority: body.priority || "High",
      headline: body.headline || body.title,
      description: body.description || "",
      problem: body.problem || "",
      solution: body.solution || "",
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures : [],
      architectureHighlights: Array.isArray(body.architectureHighlights)
        ? body.architectureHighlights
        : [],
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : [],
      previewType: body.previewType || "dashboard",
      waitlistCount: Number(body.waitlistCount || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { source, upcomingProject } = await addUpcomingProject(newProject);
    return NextResponse.json({ success: true, upcomingProject, source });
  } catch (error) {
    console.error("POST /api/admin/upcoming error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create upcoming project" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, slug, ...updates } = body;
    const identifier = id || slug;

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Project id or slug is required for updating." },
        { status: 400 }
      );
    }

    const { source, upcomingProject } = await updateUpcomingProject(identifier, updates);
    if (!upcomingProject) {
      return NextResponse.json(
        { success: false, message: "Upcoming project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, upcomingProject, source });
  } catch (error) {
    console.error("PATCH /api/admin/upcoming error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update upcoming project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || searchParams.get("slug");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Upcoming project id or slug is required" },
        { status: 400 }
      );
    }

    const { source, success, error } = await deleteUpcomingProject(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: error || "Failed to delete upcoming project" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, source });
  } catch (error) {
    console.error("DELETE /api/admin/upcoming error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete upcoming project" },
      { status: 500 }
    );
  }
}
