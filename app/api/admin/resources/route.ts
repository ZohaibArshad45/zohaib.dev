import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getResources,
  addResource,
  updateResource,
  deleteResource,
} from "@/lib/supabase";
import type { Resource } from "@/lib/resources";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { source, resources } = await getResources();
    return NextResponse.json(
      { success: true, resources, source },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/admin/resources error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      category,
      type,
      fileUrl,
      fileSize,
      coverImage,
      tags,
      featured,
      externalLink,
    } = body;

    if (!title || !description || !fileUrl) {
      return NextResponse.json(
        { success: false, message: "Title, description, and file URL are required." },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const inferredType =
      type ||
      (fileUrl.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : fileUrl.toLowerCase().endsWith(".zip") ||
          fileUrl.toLowerCase().endsWith(".tar") ||
          fileUrl.toLowerCase().endsWith(".gz")
        ? "zip"
        : "code");

    const newResource: Resource = {
      id: `res-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      slug: cleanSlug,
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || "Source Code & Starters",
      type: inferredType,
      fileUrl: fileUrl.trim(),
      fileSize: fileSize?.trim() || "",
      coverImage: coverImage?.trim() || undefined,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      downloadsCount: 0,
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
      externalLink: externalLink?.trim() || undefined,
    };

    const { source, resource } = await addResource(newResource);
    try {
      revalidatePath("/resources");
      revalidatePath("/api/resources");
    } catch {}
    return NextResponse.json({ success: true, resource, source });
  } catch (error) {
    console.error("POST /api/admin/resources error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create resource" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Resource ID is required" },
        { status: 400 }
      );
    }

    if (typeof updates.tags === "string") {
      updates.tags = updates.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }

    const { source, resource } = await updateResource(id, updates);
    if (!resource) {
      return NextResponse.json(
        { success: false, message: "Resource not found" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/resources");
      revalidatePath("/api/resources");
    } catch {}
    return NextResponse.json({ success: true, resource, source });
  } catch (error) {
    console.error("PATCH /api/admin/resources error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Resource ID is required" },
        { status: 400 }
      );
    }

    const { source, success } = await deleteResource(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Resource not found or already deleted" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/resources");
      revalidatePath("/api/resources");
    } catch {}
    return NextResponse.json({ success: true, message: "Resource deleted", source });
  } catch (error) {
    console.error("DELETE /api/admin/resources error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
