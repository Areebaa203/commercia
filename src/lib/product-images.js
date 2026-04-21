/**
 * `products.image_url` stores either a legacy single HTTPS URL or a JSON array of
 * `{ url, publicId? }` (publicId from Cloudinary for remote delete), or legacy JSON string[].
 */
export const CLOUDINARY_UPLOAD_FOLDER_PREFIX = "commercia/products/";

export function parseProductImages(value) {
  if (value == null) return [];
  const s = String(value).trim();
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      const parsed = JSON.parse(s);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item) => {
          if (typeof item === "string" && item.trim()) {
            return { url: item.trim(), publicId: null };
          }
          if (item && typeof item === "object" && typeof item.url === "string" && item.url.trim()) {
            const pid = item.publicId;
            return {
              url: item.url.trim(),
              publicId: typeof pid === "string" && pid.trim() ? pid.trim() : null,
            };
          }
          return null;
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  }
  return [{ url: s, publicId: null }];
}

export function parseProductImageUrls(value) {
  return parseProductImages(value).map((i) => i.url);
}

export function stringifyProductImages(images) {
  const cleaned = (images || [])
    .filter((i) => i && typeof i.url === "string" && i.url.trim())
    .map((i) => {
      const o = { url: i.url.trim() };
      if (i.publicId && String(i.publicId).trim()) {
        o.publicId = String(i.publicId).trim();
      }
      return o;
    });
  return JSON.stringify(cleaned);
}

export function getPrimaryProductImageUrl(value) {
  const urls = parseProductImageUrls(value);
  return urls[0] ?? "";
}

/**
 * Derive Cloudinary `public_id` from a delivery URL under our upload folder.
 * Safe for client and server usage.
 */
export function inferCloudinaryPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  let u;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  if (u.hostname !== "res.cloudinary.com" && !u.hostname.endsWith(".cloudinary.com")) {
    return null;
  }
  const path = u.pathname;
  const uploadIdx = path.indexOf("/upload/");
  if (uploadIdx === -1) return null;
  let tail = path.slice(uploadIdx + "/upload/".length).split("?")[0];
  const parts = tail.split("/");
  let i = 0;
  while (i < parts.length && (parts[i].includes(",") || parts[i].includes(":"))) {
    i += 1;
  }
  tail = parts.slice(i).join("/");
  tail = tail.replace(/^v\d+\//, "");
  const noExt = tail.replace(/\.[^/.]+$/, "");
  if (noExt.startsWith(CLOUDINARY_UPLOAD_FOLDER_PREFIX)) {
    return noExt;
  }
  return null;
}
