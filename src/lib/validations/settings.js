import * as z from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().length(11, "Phone number must be at least 11 digits").regex(/^\d+$/, "Phone number must contain only digits").optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid image URL").nullish().or(z.literal("")),
});

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  homepageTitle: z.string().min(2, "Homepage title must be at least 2 characters"),
  supportEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  currency: z.string().min(1, "Currency is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

export const notificationSettingsSchema = z.object({
  emailOrders: z.boolean(),
  emailStock: z.boolean(),
  emailMarketing: z.boolean(),
  pushOrders: z.boolean(),
  pushMessages: z.boolean(),
});
