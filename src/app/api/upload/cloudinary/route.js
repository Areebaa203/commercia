import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import {
  configureCloudinaryFromEnv,
  destroyCloudinaryAsset,
  UPLOAD_FOLDER_PREFIX,
} from "@/lib/cloudinary-admin";
import { validateUploadFile } from "@/lib/validations/upload";

export const runtime = "nodejs";

export const maxDuration = 120;

/**
 * DELETE JSON body: `{ "publicId": "...", "resourceType"?: "image" | "video" }` — prefer POST `/api/upload/cloudinary/delete`.
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

    const resourceType = body?.resourceType === "video" ? "video" : "image";
    const result = await destroyCloudinaryAsset(publicId, resourceType);
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
 * POST multipart/form-data: field `file`, optional `resourceType` (`image` default, `video` for video uploads).
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
    const resourceTypeRaw = String(formData.get("resourceType") || "").toLowerCase();
    const isVideo = resourceTypeRaw === "video";

    const validation = validateUploadFile(file, isVideo ? "video" : "image");
    if (!validation.ok) {
      return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // convert bytes into buffer
    const uploaded = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: UPLOAD_FOLDER_PREFIX.replace(/\/$/, ""),
          resource_type: isVideo ? "video" : "image",
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
