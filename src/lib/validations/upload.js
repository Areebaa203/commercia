// ─── Image constraints ────────────────────────────────────────────────────────
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const ALLOWED_IMAGE_EXT = /\.(jpe?g|png|webp|hei[cf])$/i;

// ─── Video constraints ────────────────────────────────────────────────────────
export const VIDEO_MAX_BYTES = 25 * 1024 * 1024; // 25 MB

const ALLOWED_VIDEO_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
]);
const ALLOWED_VIDEO_EXT = /\.(mp4|webm|mov|ogg)$/i;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the file's MIME type or extension is an allowed image format.
 * @param {{ name?: string; type?: string }} file
 */
export function isAllowedImageFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  return ALLOWED_IMAGE_MIME.has(type) || ALLOWED_IMAGE_EXT.test(name);
}

/**
 * Returns true if the file's MIME type or extension is an allowed video format.
 * @param {{ name?: string; type?: string }} file
 */
export function isAllowedVideoFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  return ALLOWED_VIDEO_MIME.has(type) || ALLOWED_VIDEO_EXT.test(name);
}

/**
 * Validates a single upload file.
 * Returns `{ ok: true }` on success, or `{ ok: false, message: string }` on failure.
 *
 * @param {File} file
 * @param {"image" | "video"} resourceType
 * @returns {{ ok: boolean; message?: string }}
 */
export function validateUploadFile(file, resourceType) {
  const isVideo = resourceType === "video";

  if (!file || typeof file === "string") {
    return { ok: false, message: "No file uploaded." };
  }

  const maxBytes = isVideo ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES;
  if (file.size > maxBytes) {
    return {
      ok: false,
      message: isVideo
        ? "Each video must be smaller than 25 MB."
        : "Each image must be smaller than 5 MB.",
    };
  }

  if (isVideo && !isAllowedVideoFile(file)) {
    return { ok: false, message: "Allowed video formats: MP4, WebM, MOV, or OGG." };
  }

  if (!isVideo && !isAllowedImageFile(file)) {
    return { ok: false, message: "Allowed formats: JPG, PNG, WebP, HEIC, or HEIF." };
  }

  return { ok: true };
}
