import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_UPLOAD_FOLDER_PREFIX } from "@/lib/product-images";

/** Must match upload `folder` + trailing slash for destroy checks. */
export const UPLOAD_FOLDER_PREFIX = CLOUDINARY_UPLOAD_FOLDER_PREFIX;

export function configureCloudinaryFromEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return { ok: false };
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    timeout: 120_000,
  });
  return { ok: true };
}

export async function destroyCloudinaryImage(publicId) {
  if (!publicId || typeof publicId !== "string" || !publicId.trim().startsWith(UPLOAD_FOLDER_PREFIX)) {
    throw new Error("Invalid or unauthorized public id.");
  }
  const id = publicId.trim();
  const uploaderResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(id, { resource_type: "image", type: "upload", invalidate: true }, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
  if (uploaderResult?.result === "ok" || uploaderResult?.result === "not found") {
    return uploaderResult;
  }

  // Fallback via Admin API for cases where uploader destroy does not clear the asset.
  const adminResult = await cloudinary.api.delete_resources([id], {
    resource_type: "image",
    type: "upload",
    invalidate: true,
  });
  const deletedState = adminResult?.deleted?.[id];
  if (deletedState === "deleted" || deletedState === "not_found") {
    return { result: deletedState };
  }
  throw new Error(`Cloudinary delete failed for ${id}.`);
}
