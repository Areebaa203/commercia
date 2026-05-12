/**
 * Whether the storefront should send buyers through Stripe Hosted Checkout after placing an order.
 *
 * Stripe is the default in every environment, including Vercel Production, so live
 * orders are paid before the buyer lands on `/checkout/confirmation`.
 *
 * Set `NEXT_PUBLIC_DISABLE_STRIPE_CHECKOUT=true` only when you intentionally need
 * to bypass Stripe for non-payment demos or emergency checkout troubleshooting.
 */
export function shouldUseStripeHostedCheckout() {
  return process.env.NEXT_PUBLIC_DISABLE_STRIPE_CHECKOUT !== "true";
}
