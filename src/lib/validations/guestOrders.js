import { z } from "zod";
import { accountOrderLineSchema, createAccountOrderSchema } from "@/lib/validations/accountOrders";

/** Guest checkout requires contact + shipping fields inside checkoutDetails (Stripe + RPC). */
export const guestCheckoutDetailsSchema = z
  .object({
    contactEmail: z.string().email(),
    contactPhone: z.string().optional(),
    shippingName: z.string().min(1),
    shippingLines: z.array(z.string()).optional(),
    billingLines: z.array(z.string()).optional(),
    billingSame: z.boolean().optional(),
    shippingMethod: z.string().optional(),
    paymentDisplay: z.string().optional(),
    expectedDeliveryLabel: z.string().optional(),
    trackingNumber: z.string().optional(),
    confirmedHeadline: z.string().optional(),
    timelineDetail: z.string().optional(),
    statusMessage: z.string().optional(),
  })
  .passthrough();

export const createGuestOrderSchema = createAccountOrderSchema
  .omit({ checkoutDetails: true })
  .extend({
    lines: z.array(accountOrderLineSchema).min(1).max(100),
    checkoutDetails: guestCheckoutDetailsSchema,
  });

/** UUID v4 — cart uses product id as slug for DB-backed PDP lines. */
export function isStorefrontProductUuid(slug) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(slug ?? "").trim()
  );
}
