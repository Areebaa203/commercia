/**
 * Whether the storefront should send buyers through Stripe Hosted Checkout after placing an order.
 *
 * - Vercel Production: skip hosted checkout → in-app `/checkout/confirmation` (logged-in buyers).
 * - Local dev, Preview, and other environments: keep Stripe for testing.
 *
 * Set `NEXT_PUBLIC_FORCE_STRIPE_CHECKOUT=true` on Vercel Production to test Stripe on the live URL.
 */

export function shouldUseStripeHostedCheckout() {
  if (process.env.NEXT_PUBLIC_FORCE_STRIPE_CHECKOUT === "true") return true;
  if (process.env.NODE_ENV === "development") return true;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return true;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") return false;
  return true;
}
