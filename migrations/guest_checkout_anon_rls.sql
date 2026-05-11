-- =============================================================================
-- Phase 1: Guest checkout — secure RPC + grants (no permissive anon DML on orders)
-- Apply after: database_schema.sql, migrations/storefront_orders.sql, rls_policies.sql
--
-- Why RPC-only (not anon INSERT on orders + order_items):
-- - RLS WITH CHECK on order_items uses EXISTS (SELECT … FROM orders). Postgres still
--   applies orders RLS to that subquery, so anon would need a SELECT policy on orders.
-- - Any broad "recent guest orders" SELECT leaks other customers' PII (enumerable window).
-- - Atomic SECURITY DEFINER function = one transaction, no extra anon SELECT, smallest surface.
--
-- Security notes:
-- - SET search_path = public on all SECURITY DEFINER routines (search-path injection).
-- - Revoke public execute on helpers; only expose create_guest_checkout_order to anon.
-- - create_guest_checkout_order rejects non-null auth.uid() (must use logged-in account flow).
-- =============================================================================

-- Hardened helper: not granted to API roles — only called from create_guest_checkout_order.
CREATE OR REPLACE FUNCTION public.ensure_guest_customer(
  p_email TEXT,
  p_name TEXT,
  p_phone TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
  v_name TEXT;
  v_id UUID;
BEGIN
  v_email := lower(trim(p_email));
  IF v_email = '' OR length(v_email) > 320 THEN
    RAISE EXCEPTION 'invalid email';
  END IF;
  -- Minimal sanity only; stricter validation belongs in the app (i18n, +labels, IDN, etc.)
  IF position('@' IN v_email) < 2
     OR length(split_part(v_email, '@', 1)) < 1
     OR length(split_part(v_email, '@', 2)) < 1 THEN
    RAISE EXCEPTION 'invalid email format';
  END IF;

  v_name := trim(p_name);
  IF v_name = '' OR length(v_name) > 200 THEN
    RAISE EXCEPTION 'invalid name';
  END IF;

  IF p_phone IS NOT NULL AND length(trim(p_phone)) > 40 THEN
    RAISE EXCEPTION 'invalid phone';
  END IF;

  IF p_avatar_url IS NOT NULL AND length(trim(p_avatar_url)) > 2048 THEN
    RAISE EXCEPTION 'invalid avatar_url';
  END IF;

  INSERT INTO public.customers (name, email, phone, avatar_url, status, total_orders, total_spent)
  VALUES (
    v_name,
    v_email,
    NULLIF(trim(p_phone), ''),
    NULLIF(trim(p_avatar_url), ''),
    'active',
    0,
    0
  )
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = COALESCE(EXCLUDED.phone, customers.phone),
    avatar_url = COALESCE(EXCLUDED.avatar_url, customers.avatar_url),
    updated_at = NOW()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_guest_customer(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;


-- p_lines: JSON array of objects. Each object supports keys aligned with
-- src/app/api/account/orders (slug, name, image, price, qty, compareAt, variantLabel)
-- plus aliases (product_slug, product_name, unit_price, quantity).
-- Parameter order: all required args first; defaulted args (shipping, discount, checkout_details)
-- must be last per PostgreSQL (no non-default parameter after a default).
DROP FUNCTION IF EXISTS public.create_guest_checkout_order(
  TEXT, TEXT, TEXT, TEXT, NUMERIC, INTEGER, NUMERIC, NUMERIC, JSONB, JSONB
);
CREATE OR REPLACE FUNCTION public.create_guest_checkout_order(
  p_email TEXT,
  p_name TEXT,
  p_phone TEXT,
  p_order_number TEXT,
  p_total NUMERIC,
  p_items_count INTEGER,
  p_lines JSONB,
  p_shipping_cost NUMERIC DEFAULT 0,
  p_discount_amount NUMERIC DEFAULT 0,
  p_checkout_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  el JSONB;
  v_qty INTEGER;
  v_price NUMERIC;
  v_slug TEXT;
  v_pname TEXT;
  v_image TEXT;
  v_variant TEXT;
  v_compare NUMERIC;
  i INT;
  v_len INT;
BEGIN
  IF auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'authenticated clients must use the account checkout path';
  END IF;

  IF p_order_number IS NULL OR trim(p_order_number) = '' OR length(trim(p_order_number)) > 64 THEN
    RAISE EXCEPTION 'invalid order_number';
  END IF;

  IF p_total IS NULL OR p_total < 0 OR p_total > 99999999.99 THEN
    RAISE EXCEPTION 'invalid total';
  END IF;

  IF p_items_count IS NULL OR p_items_count < 1 OR p_items_count > 500 THEN
    RAISE EXCEPTION 'invalid items_count';
  END IF;

  IF COALESCE(p_shipping_cost, 0) < 0 OR COALESCE(p_shipping_cost, 0) > 99999999.99 THEN
    RAISE EXCEPTION 'invalid shipping_cost';
  END IF;

  IF COALESCE(p_discount_amount, 0) < 0 OR COALESCE(p_discount_amount, 0) > 99999999.99 THEN
    RAISE EXCEPTION 'invalid discount_amount';
  END IF;

  IF p_lines IS NULL OR jsonb_typeof(p_lines) != 'array' THEN
    RAISE EXCEPTION 'lines must be a JSON array';
  END IF;

  v_len := jsonb_array_length(p_lines);
  IF v_len < 1 OR v_len > 100 THEN
    RAISE EXCEPTION 'invalid lines length';
  END IF;

  v_customer_id := public.ensure_guest_customer(p_email, p_name, p_phone, NULL);

  INSERT INTO public.orders (
    order_number,
    customer_id,
    user_id,
    status,
    payment_status,
    total,
    items_count,
    shipping_cost,
    discount_amount,
    checkout_details
  )
  VALUES (
    trim(p_order_number),
    v_customer_id,
    NULL,
    'processing',
    'pending',
    p_total,
    p_items_count,
    COALESCE(p_shipping_cost, 0),
    COALESCE(p_discount_amount, 0),
    COALESCE(NULLIF(p_checkout_details, 'null'::jsonb), '{}'::jsonb)
  )
  RETURNING id INTO v_order_id;

  FOR i IN 0 .. (v_len - 1)
  LOOP
    el := p_lines -> i;

    v_qty := COALESCE(
      NULLIF(trim(el ->> 'qty'), '')::INTEGER,
      NULLIF(trim(el ->> 'quantity'), '')::INTEGER
    );
    IF v_qty IS NULL OR v_qty < 1 OR v_qty > 9999 THEN
      RAISE EXCEPTION 'invalid quantity on line %', i;
    END IF;

    v_price := COALESCE(
      NULLIF(trim(el ->> 'price'), '')::NUMERIC,
      NULLIF(trim(el ->> 'unit_price'), '')::NUMERIC
    );
    IF v_price IS NULL OR v_price < 0 OR v_price > 99999999.99 THEN
      RAISE EXCEPTION 'invalid price on line %', i;
    END IF;

    v_slug := COALESCE(
      NULLIF(trim(el ->> 'slug'), ''),
      NULLIF(trim(el ->> 'product_slug'), '')
    );
    v_pname := COALESCE(
      NULLIF(trim(el ->> 'name'), ''),
      NULLIF(trim(el ->> 'product_name'), '')
    );
    IF v_slug IS NULL OR v_slug = '' OR length(v_slug) > 512 THEN
      RAISE EXCEPTION 'invalid slug on line %', i;
    END IF;
    IF v_pname IS NULL OR v_pname = '' OR length(v_pname) > 512 THEN
      RAISE EXCEPTION 'invalid product name on line %', i;
    END IF;

    v_image := COALESCE(
      NULLIF(trim(el ->> 'image'), ''),
      NULLIF(trim(el ->> 'image_url'), '')
    );
    IF v_image IS NOT NULL AND length(v_image) > 2048 THEN
      RAISE EXCEPTION 'invalid image on line %', i;
    END IF;

    v_variant := COALESCE(
      NULLIF(trim(el ->> 'variantLabel'), ''),
      NULLIF(trim(el ->> 'variant_label'), '')
    );
    IF v_variant IS NOT NULL AND length(v_variant) > 256 THEN
      RAISE EXCEPTION 'invalid variant on line %', i;
    END IF;

    IF el ? 'compareAt' AND el ->> 'compareAt' IS NOT NULL AND trim(el ->> 'compareAt') != '' THEN
      v_compare := (trim(el ->> 'compareAt'))::NUMERIC;
    ELSIF el ? 'compare_at_price' AND el ->> 'compare_at_price' IS NOT NULL AND trim(el ->> 'compare_at_price') != '' THEN
      v_compare := (trim(el ->> 'compare_at_price'))::NUMERIC;
    ELSE
      v_compare := NULL;
    END IF;

    IF v_compare IS NOT NULL AND (v_compare < 0 OR v_compare > 99999999.99) THEN
      RAISE EXCEPTION 'invalid compare_at on line %', i;
    END IF;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      unit_price,
      product_slug,
      product_name,
      image_url,
      variant_label,
      compare_at_price
    )
    VALUES (
      v_order_id,
      NULL,
      v_qty,
      v_price,
      v_slug,
      v_pname,
      v_image,
      v_variant,
      v_compare
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_guest_checkout_order(
  TEXT, TEXT, TEXT, TEXT, NUMERIC, INTEGER, JSONB, NUMERIC, NUMERIC, JSONB
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_guest_checkout_order(
  TEXT, TEXT, TEXT, TEXT, NUMERIC, INTEGER, JSONB, NUMERIC, NUMERIC, JSONB
) TO anon;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION public.create_guest_checkout_order(
      TEXT, TEXT, TEXT, TEXT, NUMERIC, INTEGER, JSONB, NUMERIC, NUMERIC, JSONB
    ) TO service_role;
  END IF;
END;
$$;

DROP POLICY IF EXISTS "Anon insert guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon select very recent guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anon insert items for recent guest orders" ON public.order_items;