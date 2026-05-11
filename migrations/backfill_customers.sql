-- ============================================================
-- Backfill customers from existing orders (checkout_details JSON)
-- Run in Supabase SQL Editor after storefront checkout_details columns exist.
--
-- Expected checkout_details shape (see CheckoutReviewView):
--   contactEmail, contactPhone, shippingName, shippingLines, billingLines, ...
-- Legacy drafts may use checkout_details.email instead of contactEmail.
-- ============================================================

-- Normalized email from JSON (contactEmail preferred, then legacy email key)
WITH order_emails AS (
  SELECT
    o.id,
    o.total,
    o.created_at,
    o.customer_id,
    o.checkout_details,
    LOWER(TRIM(COALESCE(
      NULLIF(o.checkout_details->>'contactEmail', ''),
      NULLIF(o.checkout_details->>'email', '')
    ))) AS norm_email
  FROM orders o
)

-- Step 1: One row per distinct email (only orders still missing customer_id)
INSERT INTO customers (name, email, phone, status, total_orders, total_spent, last_order_at, created_at, updated_at)
SELECT
  MAX(
    COALESCE(
      NULLIF(TRIM(e.checkout_details->>'shippingName'), ''),
      split_part(e.norm_email, '@', 1),
      'Guest'
    )
  ) AS name,
  e.norm_email AS email,
  MAX(NULLIF(NULLIF(TRIM(e.checkout_details->>'contactPhone'), ''), '—')) AS phone,
  'active'::customer_status,
  COUNT(*)::integer AS total_orders,
  SUM(e.total) AS total_spent,
  MAX(e.created_at) AS last_order_at,
  MIN(e.created_at) AS created_at,
  NOW() AS updated_at
FROM order_emails e
WHERE
  e.customer_id IS NULL
  AND e.norm_email <> ''
  AND position('@' IN e.norm_email) > 1
  AND e.norm_email NOT IN (
    SELECT LOWER(TRIM(c.email)) FROM customers c WHERE c.email IS NOT NULL
  )
GROUP BY e.norm_email;

-- Step 2: Attach customer_id on orders that still have none
UPDATE orders o
SET customer_id = c.id,
    updated_at = NOW()
FROM customers c
WHERE
  o.customer_id IS NULL
  AND LOWER(TRIM(COALESCE(
    NULLIF(o.checkout_details->>'contactEmail', ''),
    NULLIF(o.checkout_details->>'email', '')
  ))) = LOWER(TRIM(c.email))
  AND LOWER(TRIM(COALESCE(
    NULLIF(o.checkout_details->>'contactEmail', ''),
    NULLIF(o.checkout_details->>'email', '')
  ))) <> '';

-- Step 3: Verify
SELECT
  c.name,
  c.email,
  c.phone,
  c.total_orders,
  c.total_spent,
  c.last_order_at
FROM customers c
ORDER BY c.created_at DESC;
