"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import {
  inferCloudinaryPublicIdFromUrl,
  parseProductImages,
  stringifyProductImages,
} from "@/lib/product-images";

const DEFAULT_MAX_VIDEOS = 2;
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ACCEPT = ".mp4,.webm,.mov,.ogg,video/mp4,video/webm,video/quicktime,video/ogg";

function clientAllowsFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  const mimeOk = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"].includes(type);
  const extOk = /\.(mp4|webm|mov|ogg)$/i.test(name);
  return mimeOk || extOk;
}

export default function ProductVideoField({
  value,
  onChange,
  errorMessage,
  disabled,
  label = "Product videos",
  maxVideos = DEFAULT_MAX_VIDEOS,
}) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [localError, setLocalError] = useState("");

  const videos = parseProductImages(value);

  const handlePick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    setLocalError("");
    if (!files.length || disabled || uploading) return;

    let acc = [...parseProductImages(value)];
    const remaining = maxVideos - acc.length;
    if (remaining <= 0) {
      setLocalError(`You can upload at most ${maxVideos} video(s).`);
      return;
    }

    const toProcess = files.slice(0, remaining);
    if (files.length > toProcess.length) {
      setLocalError(`Only ${remaining} slot(s) left; extra files were not uploaded.`);
    }

    const invalid = [];
    for (const file of toProcess) {
      if (file.size > MAX_BYTES) invalid.push(`${file.name || "File"}: over 25 MB`);
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
        body.append("resourceType", "video");
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
          body: JSON.stringify({ publicId, resourceType: "video" }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Could not remove video from Cloudinary.");
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

  const showAdd = videos.length < maxVideos && !disabled;
  const busy = uploading || deletingIndex !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <span className="text-[11px] text-gray-400">
          {videos.length}/{maxVideos} · max 25 MB each · MP4, WEBM, MOV
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {videos.map((vid, index) => (
          <div
            key={`${vid.url}-${index}`}
            className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-black"
          >
            <video src={vid.url} controls className="h-full w-full object-contain" />
            {deletingIndex === index && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <Icon icon="mingcute:loading-fill" className="animate-spin text-white" width="28" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removeAt(index)}
              disabled={disabled || busy}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/70 text-white shadow-sm hover:bg-gray-900 disabled:opacity-50 z-20"
              aria-label="Remove video"
            >
              <Icon icon="mingcute:delete-2-line" width="16" />
            </button>
          </div>
        ))}

        {showAdd && (
          <label
            className={clsx(
              "flex aspect-video cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/80 text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600",
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
                <Icon icon="mingcute:video-line" width="28" />
                <span className="text-[11px] font-medium">Upload Video</span>
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
