import { z } from "zod";
import { parseProductImageUrls } from "@/lib/product-images";

/** Matches DB `product_status` enum */
export const productStatusSchema = z.enum(["draft", "active", "scheduled", "archived"]);

export const productIdParamSchema = z.string().uuid("Invalid product id.");

/** JSON array string of 1–5 HTTPS image URLs (Cloudinary), or legacy single URL. */
const productImagesFieldSchema = z
  .string()
  .trim()
  .min(1, "Add at least one product image.")
  .max(25000)
  .superRefine((val, ctx) => {
    const urls = parseProductImageUrls(val);
    if (urls.length < 1) {
      ctx.addIssue({ code: "custom", message: "Add at least one product image." });
      return;
    }
    if (urls.length > 5) {
      ctx.addIssue({ code: "custom", message: "Maximum 5 images allowed." });
      return;
    }
    for (const u of urls) {
      try {
        const parsed = new URL(u);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error();
        }
      } catch {
        ctx.addIssue({ code: "custom", message: "Invalid image URL." });
        return;
      }
    }
  });

export const createProductSchema = z.object({
  name: z.string().trim().min(10, "Name should be greater than 10 characters.").max(200),
  category: z.string().trim().min(1, "Category is required.").max(80),
  status: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
    productStatusSchema
  ),
  price: z.coerce.string().min(1, "Price is required.").pipe(z.coerce.number().nonnegative("Price must be zero or greater.")),
  stock: z.coerce.string().min(1, "Stock is required.").pipe(z.coerce.number().int().min(0, "Stock cannot be negative.")),
  image_url: productImagesFieldSchema,
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  category: z.string().trim().min(1, "Category is required.").max(80),
  status: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
    productStatusSchema
  ),
  price: z.coerce.string().min(1, "Price is required.").pipe(z.coerce.number().nonnegative("Price must be zero or greater.")),
  stock: z.coerce.string().min(1, "Stock is required.").pipe(z.coerce.number().int().min(0, "Stock cannot be negative.")),
  image_url: productImagesFieldSchema,
});

export const productListQuerySchema = z.object({
  q: z.string().trim().max(120).optional().default(""),
  status: z.enum(["All", "Active", "Draft", "Archive"]).default("All"),
  category: z.string().trim().max(80).default("All"),
  stockStatus: z.enum(["All", "In Stock", "Low Stock", "Out of Stock"]).default("All"),
  priceRange: z
    .enum(["All", "Under $50", "$50 - $100", "$100 - $500", "Over $500"])
    .default("All"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});
