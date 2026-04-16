import { z } from "zod";

/** Matches DB `product_status` enum */
export const productStatusSchema = z.enum(["draft", "active", "scheduled", "archived"]);

export const productIdParamSchema = z.string().uuid("Invalid product id.");

export const createProductSchema = z.object({
  name: z.string().trim().min(10, "Name should be greater than 10 characters.").max(200),
  category: z.string().trim().max(80).optional().default(""),
  status: z.preprocess(
    (v) =>
      v === undefined || v === null ? "active" : typeof v === "string" ? v.trim().toLowerCase() : v,
    productStatusSchema
  ),
  price: z.coerce.number().nonnegative("Price must be zero or greater."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative.").default(0),
  image_url: z
    .string()
    .trim()
    .max(2000)
    .transform((s) => (s === "" ? undefined : s)),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  category: z.string().trim().max(80).optional().default(""),
  status: z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
    productStatusSchema
  ),
  price: z.coerce.number().nonnegative("Price must be zero or greater."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  image_url: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((s) => (s === "" ? undefined : s)),
});

export const productListQuerySchema = z.object({
  q: z.string().trim().max(120).optional().default(""),
  status: z.enum(["All", "Active", "Draft", "Archived"]).default("All"),
  category: z.string().trim().max(80).default("All"),
  stockStatus: z.enum(["All", "In Stock", "Low Stock", "Out of Stock"]).default("All"),
  priceRange: z
    .enum(["All", "Under $50", "$50 - $100", "$100 - $500", "Over $500"])
    .default("All"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});
