-- ==========================================
-- STEP 0: ENUM DEFINITIONS (LOWERCASE)
-- ==========================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user', 'owner');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE customer_status AS ENUM ('active', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('draft', 'active', 'scheduled', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('percentage', 'fixed', 'free_shipping');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE discount_status AS ENUM ('active', 'scheduled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('processing', 'shipped', 'delivered', 'cancelled', 'returned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('article', 'video', 'banner', 'product');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'published', 'scheduled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('order', 'user', 'system', 'payment', 'review');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE billing_plan_type AS ENUM ('free', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE billing_status AS ENUM ('active', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE device_type AS ENUM ('desktop', 'mobile', 'tablet');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE traffic_source AS ENUM ('direct', 'social', 'organic', 'referral', 'email');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('sale', 'refund');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('completed', 'pending', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ==========================================
-- STEP 1: TABLES WITH NO DEPENDENCIES
-- ==========================================

-- 1. Profiles (Extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row whenever a new auth user is created.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE((NEW.raw_app_meta_data ->> 'role')::user_role, 'user'::user_role)
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      avatar_url = EXCLUDED.avatar_url;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Customers
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  status customer_status DEFAULT 'active',
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INTEGER DEFAULT 0,
  status product_status DEFAULT 'draft',
  sales INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Discounts
CREATE TABLE discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type discount_type NOT NULL,
  value NUMERIC NOT NULL,
  status discount_status DEFAULT 'active',
  used_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Store Settings
CREATE TABLE store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT,
  homepage_title TEXT,
  meta_description TEXT,
  analytics_code TEXT,
  active_theme_id INTEGER,
  currency TEXT DEFAULT 'USD',
  timezone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Store Pages
CREATE TABLE store_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Navigation Menus
CREATE TABLE navigation_menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT, -- Header, Footer, Sidebar
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Analytics Daily Snapshots
CREATE TABLE analytics_daily_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  revenue NUMERIC(10,2) DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  visitors_count INTEGER DEFAULT 0,
  page_views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Stripe Webhooks
CREATE TABLE stripe_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- Small internal status text is fine here
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- STEP 2: TABLES DEPENDING ON STEP 1
-- ==========================================

-- 10. Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status order_status DEFAULT 'processing',
  payment_status payment_status DEFAULT 'pending',
  total NUMERIC(10,2) DEFAULT 0,
  items_count INTEGER DEFAULT 0,
  stripe_checkout_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Content (depends on profiles)
CREATE TABLE content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type content_type,
  status content_status DEFAULT 'draft',
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Conversations (depends on customers)
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications (depends on profiles)
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Password Reset Requests (depends on profiles)
CREATE TABLE password_reset_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 15. Team Members (depends on profiles)
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role DEFAULT 'staff',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ
);

-- 16. Billing Plans (depends on profiles)
CREATE TABLE billing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan billing_plan_type DEFAULT 'free',
  status billing_status DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  renews_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Analytics Page Views (depends on profiles)
CREATE TABLE analytics_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  device device_type,
  source traffic_source,
  event_type TEXT DEFAULT 'page_view',
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- STEP 3: TABLES DEPENDING ON STEP 2
-- ==========================================

-- 18. Order Items (depends on orders and products)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Transactions (depends on orders and customers)
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  method TEXT, -- e.g., 'stripe', 'paypal'
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Messages (depends on conversations and profiles)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_from_customer BOOLEAN DEFAULT FALSE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- STEP 4: INITIAL SEED DATA
-- ==========================================

INSERT INTO products (name, category, price, stock, status, sales, image_url)
VALUES 
  ('Wireless Headphones', 'Electronics', 129.00, 45, 'active', 120, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop'),
  ('Smart Watch Series 7', 'Electronics', 299.00, 12, 'active', 85, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop'),
  ('Cotton T-Shirt', 'Clothing', 24.50, 150, 'active', 450, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop'),
  ('Leather Wallet', 'Accessories', 45.00, 5, 'active', 65, 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=200&auto=format&fit=crop'),
  ('Gaming Mouse', 'Electronics', 59.99, 0, 'active', 210, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=200&auto=format&fit=crop'),
  ('Running Shoes', 'Clothing', 89.00, 32, 'draft', 0, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop'),
  ('Ceramic Coffee Mug', 'Home & Garden', 12.00, 85, 'active', 140, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=200&auto=format&fit=crop'),
  ('Mechanical Keyboard', 'Electronics', 149.00, 20, 'active', 55, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=200&auto=format&fit=crop'),
  ('Yoga Mat', 'Fitness', 35.00, 60, 'active', 80, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&auto=format&fit=crop'),
  ('Desk Lamp', 'Home & Garden', 45.00, 15, 'active', 40, 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=200&auto=format&fit=crop'),
  ('Backpack', 'Accessories', 75.00, 25, 'active', 95, 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?q=80&w=200&auto=format&fit=crop'),
  ('Sunglasses', 'Accessories', 120.00, 10, 'active', 150, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200&auto=format&fit=crop'),
  ('Bluetooth Speaker', 'Electronics', 89.00, 40, 'active', 230, 'https://images.unsplash.com/photo-1608351489262-856be29e9ed9?q=80&w=200&auto=format&fit=crop'),
  ('Water Bottle', 'Fitness', 20.00, 100, 'active', 300, 'https://images.unsplash.com/photo-1602143303410-7199d123ad17?q=80&w=200&auto=format&fit=crop'),
  ('Notebook Premium', 'Stationery', 15.00, 200, 'active', 1200, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=200&auto=format&fit=crop'),
  ('Succulent Plant', 'Home & Garden', 18.00, 50, 'active', 45, 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?q=80&w=200&auto=format&fit=crop'),
  ('Canvas Wall Art', 'Home & Garden', 65.00, 8, 'active', 12, 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=200&auto=format&fit=crop'),
  ('Espresso Machine', 'Electronics', 450.00, 3, 'active', 25, 'https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?q=80&w=200&auto=format&fit=crop'),
  ('Hoodie Oversized', 'Clothing', 55.00, 80, 'active', 210, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop'),
  ('Desk Chair', 'Furniture', 180.00, 12, 'active', 30, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=200&auto=format&fit=crop');
