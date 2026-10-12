import { NextResponse } from "next/server";
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "@/lib/supabase";
import type { Service } from "@/lib/services";

export async function GET() {
  try {
    const { source, services } = await getServices();
    return NextResponse.json({ success: true, services, source });
  } catch (error) {
    console.error("GET /api/admin/services error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required." },
        { status: 400 }
      );
    }

    const slug = (body.slug || body.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/^-+|-+$/g, "");

    const newService: Service = {
      id: body.id || `srv-${Date.now().toString(36)}`,
      slug: slug || `srv-${Date.now().toString(36)}`,
      number: body.number || "01",
      category: body.category || "DEVELOPMENT",
      title: body.title,
      description: body.description,
      items: Array.isArray(body.items) ? body.items : [],
      bestFor: body.bestFor || "",
      stack: body.stack || "",
      timeline: body.timeline || "2-3 Weeks",
      startingPrice: body.startingPrice || "",
      cta: body.cta || "Get in touch ↗",
      href: body.href || `/contact?service=${slug}`,
      featured: Boolean(body.featured),
    };

    const { source, service } = await addService(newService);
    return NextResponse.json({ success: true, service, source });
  } catch (error) {
    console.error("POST /api/admin/services error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add service" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.slug && !body.id) {
      return NextResponse.json(
        { success: false, message: "Service ID or slug is required for update." },
        { status: 400 }
      );
    }

    const updatedService: Service = {
      id: body.id,
      slug: body.slug,
      number: body.number || "01",
      category: body.category || "DEVELOPMENT",
      title: body.title,
      description: body.description,
      items: Array.isArray(body.items) ? body.items : [],
      bestFor: body.bestFor || "",
      stack: body.stack || "",
      timeline: body.timeline || "",
      startingPrice: body.startingPrice || "",
      cta: body.cta || "Get in touch ↗",
      href: body.href || `/contact?service=${body.slug}`,
      featured: Boolean(body.featured),
    };

    const { source, service } = await updateService(updatedService);
    return NextResponse.json({ success: true, service, source });
  } catch (error) {
    console.error("PATCH /api/admin/services error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || searchParams.get("id");

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Service slug or id parameter is required" },
        { status: 400 }
      );
    }

    const { source, success } = await deleteService(slug);
    return NextResponse.json({ success, source });
  } catch (error) {
    console.error("DELETE /api/admin/services error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete service" },
      { status: 500 }
    );
  }
}
