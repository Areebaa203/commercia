import { NextResponse } from "next/server";
import {
  configureCloudinaryFromEnv,
  destroyCloudinaryImage,
} from "@/lib/cloudinary-admin";

export const runtime = "nodejs";

/**
 * POST JSON `{ "publicId": "commercia/products/..." }` — removes asset from Cloudinary.
 * Uses POST (not DELETE) so JSON bodies work everywhere.
 */
export async function POST(request) {
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
    console.error("[POST /api/upload/cloudinary/delete]", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Delete failed." },
      { status: 500 }
    );
  }
}
