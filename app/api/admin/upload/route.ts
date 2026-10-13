import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Allowed extensions for project images and downloadable developer resources (PDF, ZIP, Code)
const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".pdf",
  ".zip",
  ".gz",
  ".tar",
  ".json",
  ".md",
  ".txt",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
]);

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

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

    const ext = path.extname(file.name).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file format. Allowed types: PDF, ZIP, TAR, JSON, MD, TXT, Code files, and images (PNG, JPG, WEBP, SVG).",
        },
        { status: 400 }
      );
    }

    // Max 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File exceeds 50MB maximum limit." },
        { status: 400 }
      );
    }

    // Ensure public/uploads exists
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
    } catch {
      // Ignored if exists
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate safe unique filename
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .substring(0, 40);
    const fileName = `${cleanBase}-${Date.now().toString(36)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Save locally to public/uploads
    try {
      await fs.writeFile(filePath, buffer);
    } catch (fsErr) {
      console.warn("Could not write file to local disk (expected in serverless):", fsErr);
    }

    const localUrl = `/uploads/${fileName}`;
    const formattedSize = formatBytes(file.size);

    // Also attempt Supabase Storage upload if bucket exists
    try {
      const bucket = ext === ".pdf" || ext === ".zip" ? "resources" : "project-images";
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            localUrl,
            fileName,
            fileSize: formattedSize,
            rawSize: file.size,
          });
        }
      }
    } catch {
      // Supabase storage bucket fallback
    }

    return NextResponse.json({
      success: true,
      url: localUrl,
      localUrl,
      fileName,
      fileSize: formattedSize,
      rawSize: file.size,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload file" },
      { status: 500 }
    );
  }
}
