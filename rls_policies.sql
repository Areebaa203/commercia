-- =========================================================
-- 1. CLEANUP & HELPER FUNCTIONS
-- =========================================================
-- Create or update the helper functions first
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := lower(
    coalesce(
      auth.jwt() -> 'app_metadata' ->> 'role',
      auth.jwt() -> 'user_metadata' ->> 'role',
      ''
    )
  );

  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner', 'staff')
  )
  OR jwt_role IN ('admin', 'owner', 'staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS boolean AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := lower(
    coalesce(
      auth.jwt() -> 'app_metadata' ->> 'role',
      auth.jwt() -> 'user_metadata' ->> 'role',
      ''
    )
  );

  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR jwt_role IN ('admin', 'owner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- =========================================================
-- 2. REFRESH RLS POLICIES (Recursion-Free)
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
CREATE POLICY "Staff can view all profiles" ON profiles FOR SELECT USING (is_staff());
-- Products
DROP POLICY IF EXISTS "Public read active products" ON products;
DROP POLICY IF EXISTS "Staff have full access to products" ON products;
DROP POLICY IF EXISTS "Staff can select products" ON products;
DROP POLICY IF EXISTS "Staff can insert products" ON products;
DROP POLICY IF EXISTS "Staff can update products" ON products;
DROP POLICY IF EXISTS "Staff can delete products" ON products;
DROP POLICY IF EXISTS "Authenticated can select products" ON products;
DROP POLICY IF EXISTS "Authenticated can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated can update products" ON products;
DROP POLICY IF EXISTS "Authenticated can delete products" ON products;

CREATE POLICY "Public read active products"
ON products
FOR SELECT
USING (status = 'active');

CREATE POLICY "Authenticated can select products"
ON products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
ON products
FOR DELETE
TO authenticated
USING (true);
-- Customers
DROP POLICY IF EXISTS "Staff have full access to customers" ON customers;
CREATE POLICY "Staff have full access to customers" ON customers FOR ALL TO authenticated USING (is_staff());
-- Orders & Order Items
DROP POLICY IF EXISTS "Staff have full access to orders" ON orders;
CREATE POLICY "Staff have full access to orders" ON orders FOR ALL TO authenticated USING (is_staff());
DROP POLICY IF EXISTS "Staff have full access to order_items" ON order_items;
CREATE POLICY "Staff have full access to order_items" ON order_items FOR ALL TO authenticated USING (is_staff());
-- Store Settings & Pages
DROP POLICY IF EXISTS "Admins have full access to store settings" ON store_settings;
CREATE POLICY "Admins have full access to store settings" ON store_settings FOR ALL TO authenticated USING (is_admin_or_owner());
DROP POLICY IF EXISTS "Staff have full access to store pages" ON store_pages;
CREATE POLICY "Staff have full access to store pages" ON store_pages FOR ALL TO authenticated USING (is_staff());
DROP POLICY IF EXISTS "Staff have full access to menus" ON navigation_menus;
CREATE POLICY "Staff have full access to menus" ON navigation_menus FOR ALL TO authenticated USING (is_staff());