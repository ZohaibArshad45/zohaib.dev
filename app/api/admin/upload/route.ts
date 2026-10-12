import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate image mime type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files (PNG, JPG, WEBP, GIF, SVG) are allowed.",
        },
        { status: 400 }
      );
    }

    // Ensure public/uploads exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate safe unique filename
    const ext = path.extname(file.name) || ".png";
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 30);
    const fileName = `${cleanBase}-${Date.now().toString(36)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Save locally to public/uploads
    await fs.writeFile(filePath, buffer);
    const localUrl = `/uploads/${fileName}`;

    // Also attempt Supabase Storage upload if bucket exists
    try {
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("project-images")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            localUrl,
          });
        }
      }
    } catch {
      // Supabase storage bucket might not be created, local URL works guaranteed
    }

    return NextResponse.json({
      success: true,
      url: localUrl,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image" },
      { status: 500 }
    );
  }
}
