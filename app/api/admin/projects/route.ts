import { NextResponse } from "next/server";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "@/lib/supabase";
import type { Project } from "@/lib/projects";

export async function GET() {
  try {
    const { source, projects } = await getProjects();
    return NextResponse.json({ success: true, projects, source });
  } catch (error) {
    console.error("GET /api/admin/projects error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.slug || !body.title || !body.headline) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug, title, and headline are required fields.",
        },
        { status: 400 }
      );
    }

    const newProject: Project = {
      slug: body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      number: body.number || "01",
      title: body.title,
      shortTitle: body.shortTitle || body.title,
      status: body.status || "WEB APPLICATION",
      categories: Array.isArray(body.categories) ? body.categories : ["Web Apps"],
      headline: body.headline,
      subhead: body.subhead || "",
      description: body.description || "",
      outcome: body.outcome || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      images: Array.isArray(body.images) ? body.images : [],
      previewType: body.previewType || "dashboard",
      client: body.client || "Client Project",
      role: body.role || "Full-Stack Engineer",
      timeline: body.timeline || "2-3 Weeks",
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : [],
      problem: body.problem || "",
      solution: body.solution || "",
      architectureHighlights: Array.isArray(body.architectureHighlights)
        ? body.architectureHighlights
        : [],
      metrics: Array.isArray(body.metrics) ? body.metrics : [],
      demoUrl: body.demoUrl || undefined,
      githubUrl: body.githubUrl || undefined,
    };

    const { source, project } = await addProject(newProject);
    return NextResponse.json({ success: true, project, source });
  } catch (error) {
    console.error("POST /api/admin/projects error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { slug, ...updates } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Project slug is required for updating." },
        { status: 400 }
      );
    }

    const { source, project } = await updateProject(slug, updates);
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project, source });
  } catch (error) {
    console.error("PATCH /api/admin/projects error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Project slug is required." },
        { status: 400 }
      );
    }

    const { source, success } = await deleteProject(slug);
    return NextResponse.json({ success, source });
  } catch (error) {
    console.error("DELETE /api/admin/projects error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
