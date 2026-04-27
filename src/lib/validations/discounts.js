import * as z from "zod";

export const discountIdParamSchema = z.string().uuid("Invalid discount id.");

/** Plain shape — safe to call `.partial()` (Zod forbids `.partial()` on schemas that already use `.refine` / `.superRefine`). */
const discountFieldsSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(30, "Code must be less than 30 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must be uppercase alphanumeric"),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().min(0, "Value cannot be negative").optional()),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  hasEndDate: z.boolean().default(false),
  endDate: z.date().nullable().optional(),

  limitUsage: z.boolean().default(false),
  limit: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    if (val === "Unlimited") return undefined;
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().min(1, "Limit must be at least 1").optional()),
  limitOnePerUser: z.boolean().default(false),
});

function discountCreateRefine(data, ctx) {
  if (data.type !== "free_shipping" && (data.value === undefined || data.value <= 0)) {
    ctx.addIssue({
      path: ["value"],
      message: "Value is required for this discount type",
      code: "custom",
    });
  }
  if (data.hasEndDate && !data.endDate) {
    ctx.addIssue({
      path: ["endDate"],
      message: "End date is required when set",
      code: "custom",
    });
  }
  if (data.hasEndDate && data.endDate && data.startDate) {
    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be after start date",
        code: "custom",
      });
    }
  }
  if (data.limitUsage && (data.limit === undefined || data.limit <= 0)) {
    ctx.addIssue({
      path: ["limit"],
      message: "Usage limit is required when enabled",
      code: "custom",
    });
  }
}

/** Full body for POST /api/discounts/add */
export const discountSchema = discountFieldsSchema.superRefine(discountCreateRefine);

function discountUpdateRefine(data, ctx) {
  if (
    data.type !== undefined &&
    data.type !== "free_shipping" &&
    (data.value === undefined || data.value <= 0)
  ) {
    ctx.addIssue({
      path: ["value"],
      message: "Value is required for this discount type",
      code: "custom",
    });
  }
  if (data.hasEndDate && !data.endDate) {
    ctx.addIssue({
      path: ["endDate"],
      message: "End date is required when set",
      code: "custom",
    });
  }
  if (data.hasEndDate && data.endDate && data.startDate) {
    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be after start date",
        code: "custom",
      });
    }
  }
  if (data.limitUsage && (data.limit === undefined || data.limit <= 0)) {
    ctx.addIssue({
      path: ["limit"],
      message: "Usage limit is required when enabled",
      code: "custom",
    });
  }
}

/** PATCH body: partial discount fields + optional status */
export const discountUpdateSchema = discountFieldsSchema
  .partial()
  .extend({
    status: z.preprocess(
      (v) => (v === undefined || v === null ? undefined : String(v).trim().toLowerCase()),
      z.enum(["active", "scheduled", "expired"]).optional()
    ),
  })
  .superRefine(discountUpdateRefine);
