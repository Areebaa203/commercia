-- =========================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- =========================================================

-- 1. Sync Supabase Auth to Profiles Table
-- Automatically creates a profile row when a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    new.id,
    -- Check full_name (standard), then name (Google), then extract from email
    COALESCE(
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name', 
      split_part(new.email, '@', 1)
    ),
    new.email,
    -- Handle Google OAuth 'picture' or Standard 'avatar_url'
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    -- FIX: Explicity cast the text value to the custom user_role ENUM
    COALESCE(new.raw_user_meta_data->>'role', 'user')::public.user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- =========================================================
-- 2. Auto-Update Timestamp Function
-- Automatically updates the 'updated_at' column on any row modification.
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables that have an updated_at column
CREATE OR REPLACE TRIGGER set_updated_at_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_store_settings BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_store_pages BEFORE UPDATE ON store_pages FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_navigation_menus BEFORE UPDATE ON navigation_menus FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_analytics_snapshots BEFORE UPDATE ON analytics_daily_snapshots FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_content BEFORE UPDATE ON content FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_conversations BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_billing_plans BEFORE UPDATE ON billing_plans FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE OR REPLACE TRIGGER set_updated_at_transactions BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();


-- =========================================================
-- 3. Calculate Total Spent on Customer
-- When a transaction completes, update the customer's total_spent
-- =========================================================
CREATE OR REPLACE FUNCTION update_customer_totals()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.type = 'sale' THEN
    UPDATE customers 
    SET total_spent = total_spent + NEW.amount,
        total_orders = total_orders + 1,
        last_order_at = NOW()
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_transaction_completion
  AFTER UPDATE OF status ON transactions
  FOR EACH ROW 
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE PROCEDURE update_customer_totals();
-- =========================================================
-- 4. Role Check Helpers (SECURITY DEFINER)
-- Bypasses RLS to check the role of a user. 
-- Essential for avoiding infinite recursion in RLS policies.
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
