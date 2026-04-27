"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import {
  inferCloudinaryPublicIdFromUrl,
  parseProductImages,
  stringifyProductImages,
} from "@/lib/product-images";

const MAX_IMAGES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif";

function clientAllowsFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  const mimeOk = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(type);
  const extOk = /\.(jpe?g|png|webp|hei[cf])$/i.test(name);
  return mimeOk || extOk;
}

/**
 * Multi-image upload via POST /api/upload/cloudinary; stores JSON array of { url, publicId? } in `image_url`.
 */
export default function ProductImagesField({ value, onChange, errorMessage, disabled, label = "Product images" }) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [localError, setLocalError] = useState("");

  const images = parseProductImages(value);

  const handlePick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    setLocalError("");
    if (!files.length || disabled || uploading) return;

    let acc = [...parseProductImages(value)];
    const remaining = MAX_IMAGES - acc.length;
    if (remaining <= 0) {
      setLocalError(`You can upload at most ${MAX_IMAGES} images.`);
      return;
    }

    const toProcess = files.slice(0, remaining);
    if (files.length > toProcess.length) {
      setLocalError(`Only ${remaining} slot(s) left; extra files were not uploaded.`);
    }

    const invalid = [];
    for (const file of toProcess) {
      if (file.size > MAX_BYTES) invalid.push(`${file.name || "File"}: over 5 MB`);
      else if (!clientAllowsFile(file)) invalid.push(`${file.name || "File"}: unsupported type`);
    }
    if (invalid.length) {
      setLocalError(invalid.join(". "));
      return;
    }

    setUploading(true);
    try {
      for (const file of toProcess) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload/cloudinary", {
          method: "POST",
          body,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success || !data.url) {
          throw new Error(data.message || `Upload failed for ${file.name || "file"}.`);
        }
        acc = [...acc, { url: data.url, publicId: data.publicId || null }];
        onChange(stringifyProductImages(acc));
      }
      setLocalError("");
    } catch (err) {
      setLocalError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = async (index) => {
    const items = parseProductImages(value);
    const removed = items[index];
    if (!removed || disabled) return;

    setLocalError("");
    setDeletingIndex(index);
    try {
      const publicId = removed.publicId?.trim() || inferCloudinaryPublicIdFromUrl(removed.url);
      if (publicId) {
        const res = await fetch("/api/upload/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not remove image from Cloudinary.");
        }
      }
      const next = items.filter((_, i) => i !== index);
      onChange(stringifyProductImages(next));
    } catch (err) {
      setLocalError(err?.message || "Remove failed.");
    } finally {
      setDeletingIndex(null);
    }
  };

  const showAdd = images.length < MAX_IMAGES && !disabled;
  const busy = uploading || deletingIndex !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <span className="text-[11px] text-gray-400">
          {images.length}/{MAX_IMAGES} · max 5 MB each · multi-select · JPG, PNG, WebP, HEIC/HEIF
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div
            key={`${img.url}-${index}`}
            className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
          >
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            {deletingIndex === index && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Icon icon="mingcute:loading-fill" className="animate-spin text-white" width="28" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeAt(index)}
              disabled={disabled || busy}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/70 text-white shadow-sm hover:bg-gray-900 disabled:opacity-50"
              aria-label="Remove image"
            >
              <Icon icon="mingcute:delete-2-line" width="16" />
            </button>
          </div>
        ))}

        {showAdd && (
          <label
            className={clsx(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/80 text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600",
              (busy || disabled) && "pointer-events-none opacity-60"
            )}
          >
            <input
              type="file"
              accept={ACCEPT}
              multiple
              className="sr-only"
              disabled={disabled || busy}
              onChange={handlePick}
            />
            {uploading ? (
              <Icon icon="mingcute:loading-fill" className="animate-spin text-blue-500" width="28" />
            ) : (
              <>
                <Icon icon="mingcute:add-line" width="28" />
                <span className="text-[11px] font-medium">Upload</span>
              </>
            )}
          </label>
        )}
      </div>

      {(errorMessage || localError) && (
        <p className="text-xs text-red-600">{localError || errorMessage}</p>
      )}
    </div>
  );
}
