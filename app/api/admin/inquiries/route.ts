import { NextResponse } from "next/server";
import {
  getInquiries,
  addInquiry,
  updateInquiry,
  deleteInquiry,
} from "@/lib/supabase";

export async function GET() {
  try {
    const { source, inquiries } = await getInquiries();
    return NextResponse.json({ success: true, inquiries, source });
  } catch (error) {
    console.error("GET /api/admin/inquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType, timeline, details, priority, estimatedBudget, notes } = body;

    if (!name || !email || !details) {
      return NextResponse.json(
        { success: false, message: "Name, email, and details are required." },
        { status: 400 }
      );
    }

    const { source, inquiry } = await addInquiry({
      name,
      email,
      projectType: projectType || "Web App",
      timeline: timeline || "Flexible",
      details,
      priority: priority || "Medium",
      estimatedBudget,
      notes,
    });

    return NextResponse.json({ success: true, inquiry, source });
  } catch (error) {
    console.error("POST /api/admin/inquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create inquiry" },
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
        { success: false, message: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const { source, inquiry } = await updateInquiry(id, updates);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, inquiry, source });
  } catch (error) {
    console.error("PATCH /api/admin/inquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
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
        { success: false, message: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const { source, success } = await deleteInquiry(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted", source });
  } catch (error) {
    console.error("DELETE /api/admin/inquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
