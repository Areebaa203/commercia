import { z } from "zod";
import { parseProductImageUrls } from "@/lib/product-images";

export const contentTypeSchema = z.enum(["article", "video", "banner", "product"]);
export const contentStatusSchema = z.enum(["draft", "published", "scheduled"]);

export const contentIdParamSchema = z.string().uuid("Invalid content id.");

function addHttpsMediaUrlIssues(urls, ctx, pathKey) {
  for (const u of urls) {
    try {
      const parsed = new URL(u);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error();
      }
    } catch {
      ctx.addIssue({ code: "custom", path: [pathKey], message: "Invalid URL." });
      return;
    }
  }
}

/**
 * Client form: `image_url` JSON (1–5) for non-video types; `video_asset_url` JSON (exactly 1) for video.
 * API still receives a single `thumbnail_url` (first image or first video URL).
 */
export const contentFormSchema = z
  .object({
    title: z.string().trim().min(3, "Title should be at least 3 characters.").max(200),
    description: z.string().trim().max(4000).optional().default(""),
    type: z.preprocess((v) => (typeof v === "string" ? v.trim().toLowerCase() : v), contentTypeSchema),
    status: z.preprocess((v) => (typeof v === "string" ? v.trim().toLowerCase() : v), contentStatusSchema),
    image_url: z.string().max(25000).default("[]"),
    video_asset_url: z.string().max(25000).default("[]"),
    publishDate: z.string().optional().default(""),
    publishTime: z.string().optional().default(""),
    author: z.string().optional().default(""),
  })
  .superRefine((val, ctx) => {
    if (val.type === "video") {
      const urls = parseProductImageUrls(val.video_asset_url);
      if (urls.length < 1) {
        ctx.addIssue({ code: "custom", path: ["video_asset_url"], message: "Upload a video." });
      } else if (urls.length > 1) {
        ctx.addIssue({ code: "custom", path: ["video_asset_url"], message: "Only one video is allowed." });
      } else {
        addHttpsMediaUrlIssues(urls, ctx, "video_asset_url");
      }
    } else {
      const urls = parseProductImageUrls(val.image_url);
      if (urls.length < 1) {
        ctx.addIssue({ code: "custom", path: ["image_url"], message: "Add at least one image." });
      } else if (urls.length > 5) {
        ctx.addIssue({ code: "custom", path: ["image_url"], message: "Maximum 5 images allowed." });
      } else {
        addHttpsMediaUrlIssues(urls, ctx, "image_url");
      }
    }

    if (val.status === "scheduled") {
      const hasDate = val.publishDate?.trim();
      const hasTime = val.publishTime?.trim();
      if (!hasDate || !hasTime) {
        ctx.addIssue({
          code: "custom",
          path: ["publishDate"],
          message: "Publish date and time are required for scheduled content.",
        });
      }
    }
  });

export const createContentSchema = z
  .object({
    title: z.string().trim().min(3, "Title should be at least 3 characters.").max(200),
    description: z.string().trim().max(4000).optional().default(""),
    type: z.preprocess((v) => (typeof v === "string" ? v.trim().toLowerCase() : v), contentTypeSchema),
    status: z.preprocess((v) => (typeof v === "string" ? v.trim().toLowerCase() : v), contentStatusSchema),
    thumbnail_url: z.string().trim().min(1, "Thumbnail is required.").url("Please provide a valid thumbnail URL."),
    published_at: z.preprocess(
      (v) => {
        if (v == null || v === "") return null;
        if (v instanceof Date) return v;
        if (typeof v === "string") return new Date(v);
        return v;
      },
      z.date().nullable()
    ),
  })
  .superRefine((val, ctx) => {
    if (val.status === "scheduled" && !val.published_at) {
      ctx.addIssue({
        code: "custom",
        path: ["published_at"],
        message: "Publish date/time is required for scheduled content.",
      });
    }
  });

export const updateContentSchema = createContentSchema;

export const contentListQuerySchema = z.object({
  q: z.string().trim().max(120).optional().default(""),
  type: z.enum(["All", "Article", "Video", "Banner", "Product"]).default("All"),
  status: z.enum(["All", "Published", "Draft", "Scheduled"]).default("All"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(6),
});
