import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import {
  configureCloudinaryFromEnv,
  destroyCloudinaryImage,
  UPLOAD_FOLDER_PREFIX,
} from "@/lib/cloudinary-admin";

export const runtime = "nodejs";

export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const ALLOWED_EXT = /\.(jpe?g|png|webp|hei[cf])$/i;

function isAllowedFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  if (ALLOWED_MIME.has(type)) return true;
  if (ALLOWED_EXT.test(name)) return true;
  return false;
}

/**
 * DELETE JSON body: `{ "publicId": "..." }` — kept for backwards compatibility; prefer POST `/api/upload/cloudinary/delete`.
 */
export async function DELETE(request) {
  const cfg = configureCloudinaryFromEnv();
  if (!cfg.ok) {
    return NextResponse.json(
      { success: false, message: "Cloudinary is not configured." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const publicId = typeof body?.publicId === "string" ? body.publicId.trim() : "";
    if (!publicId) {
      return NextResponse.json({ success: false, message: "publicId is required." }, { status: 400 });
    }

    const result = await destroyCloudinaryImage(publicId);
    if (result?.result !== "ok" && result?.result !== "not found") {
      return NextResponse.json(
        { success: false, message: result?.result || "Delete failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/upload/cloudinary]", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Delete failed." },
      { status: 500 }
    );
  }
}

/**
 * POST multipart/form-data: field `file` — uploads to Cloudinary.
 */
export async function POST(request) {
  const cfg = configureCloudinaryFromEnv();
  if (!cfg.ok) {
    return NextResponse.json(
      {
        success: false,
        message: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: "Each image must be smaller than 5 MB." }, { status: 400 });
    }

    if (!isAllowedFile(file)) {
      return NextResponse.json(
        { success: false, message: "Allowed formats: JPG, PNG, WebP, HEIC, or HEIF." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: UPLOAD_FOLDER_PREFIX.replace(/\/$/, ""),
          resource_type: "image",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      uploadStream.on("error", reject);
      Readable.from(buffer).on("error", reject).pipe(uploadStream);
    });

    return NextResponse.json(
      {
        success: true,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/upload/cloudinary]", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Upload failed." },
      { status: 500 }
    );
  }
}
