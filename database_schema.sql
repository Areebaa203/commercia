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
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- User email + in-app (dashboard) notification toggles. Used by /api/settings/notifications and DB triggers.
CREATE TABLE user_preferences (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  email_orders BOOLEAN DEFAULT TRUE,
  email_stock BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  push_orders BOOLEAN DEFAULT TRUE,
  push_messages BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
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

-- 2. Insert initial mock data (20 items)
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

INSERT INTO content (
  title,
  description,
  type,
  status,
  author_id,
  thumbnail_url,
  views,
  likes,
  comments_count,
  published_at,
  created_at,
  updated_at
)
VALUES
  (
    'Summer Collection Launch',
    'Discover the latest trends for the summer season with our exclusive collection launch event.',
    'article',
    'published',
    NULL,
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop',
    1200,
    145,
    23,
    '2023-10-24T10:00:00Z',
    '2023-10-24T10:00:00Z',
    NOW()
  ),
  (
    'How to Style Your Outfit',
    'A comprehensive guide on styling your daily outfits for maximum impact.',
    'video',
    'draft',
    NULL,
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
    0,
    0,
    0,
    NULL,
    '2023-10-23T09:00:00Z',
    NOW()
  ),
  (
    'Black Friday Sale Banner',
    'Promotional banner for the upcoming Black Friday sales event.',
    'banner',
    'scheduled',
    NULL,
    'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=400&auto=format&fit=crop',
    0,
    0,
    0,
    '2026-11-20T08:00:00Z',
    '2026-10-28T08:00:00Z',
    NOW()
  ),
  (
    'New Arrivals: Winter 2024',
    'Get a sneak peek at our cozy and stylish winter arrivals.',
    'article',
    'published',
    NULL,
    'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop',
    3500,
    210,
    45,
    '2023-10-20T11:00:00Z',
    '2023-10-20T11:00:00Z',
    NOW()
  ),
  (
    'Customer Review Highlight',
    'Real customers share their honest feedback about our best-selling products.',
    'video',
    'published',
    NULL,
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=400&auto=format&fit=crop',
    890,
    56,
    12,
    '2023-10-18T12:30:00Z',
    '2023-10-18T12:30:00Z',
    NOW()
  ),
  (
    'Product Spotlight: Smart Watch',
    'An in-depth look at the features and benefits of our latest Smart Watch.',
    'product',
    'published',
    NULL,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
    2100,
    180,
    34,
    '2023-10-15T14:00:00Z',
    '2023-10-15T14:00:00Z',
    NOW()
  ),
  (
    'Top 10 Accessories for 2026',
    'A curated list of must-have accessories this year.',
    'article',
    'published',
    NULL,
    'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=400&auto=format&fit=crop',
    1670,
    134,
    19,
    '2026-01-11T09:15:00Z',
    '2026-01-11T09:15:00Z',
    NOW()
  ),
  (
    'Behind the Scenes: Product Shoot',
    'Take a quick look at our latest behind-the-scenes production process.',
    'video',
    'published',
    NULL,
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&auto=format&fit=crop',
    980,
    75,
    9,
    '2026-02-05T13:00:00Z',
    '2026-02-05T13:00:00Z',
    NOW()
  ),
  (
    'Spring Sale Hero Banner',
    'Main hero banner designed for spring campaign.',
    'banner',
    'draft',
    NULL,
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
    0,
    0,
    0,
    NULL,
    '2026-03-02T10:20:00Z',
    NOW()
  ),
  (
    'Fitness Essentials Product Push',
    'Promotional content for fitness essentials category.',
    'product',
    'scheduled',
    NULL,
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop',
    0,
    0,
    0,
    '2026-05-10T07:30:00Z',
    '2026-04-25T07:30:00Z',
    NOW()
  ),
  (
    'Email Marketing Content Checklist',
    'A practical checklist for writing high-converting campaign content.',
    'article',
    'published',
    NULL,
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop',
    1430,
    102,
    17,
    '2026-01-26T15:45:00Z',
    '2026-01-26T15:45:00Z',
    NOW()
  ),
  (
    'Weekend Promo Reel',
    'Short-form promotional reel for weekend discounts.',
    'video',
    'draft',
    NULL,
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop',
    0,
    0,
    0,
    NULL,
    '2026-04-01T16:10:00Z',
    NOW()
  );
  -- Insert initial mock data for discounts
INSERT INTO discounts (id, code, type, value, status, used_count, usage_limit, start_date, end_date)
VALUES 
  (gen_random_uuid(), 'SUMMER2024', 'percentage', 20, 'active', 145, 500, '2024-06-01', '2024-08-31'),
  (gen_random_uuid(), 'WELCOME10', 'percentage', 10, 'active', 892, NULL, '2024-01-01', NULL),
  (gen_random_uuid(), 'FLASH50', 'fixed', 50, 'expired', 50, 50, '2024-05-10', '2024-05-12'),
  (gen_random_uuid(), 'FREESHIP', 'free_shipping', 0, 'scheduled', 0, 100, '2024-12-01', '2024-12-31'),
  (gen_random_uuid(), 'BLACKFRIDAY', 'percentage', 40, 'scheduled', 0, NULL, '2024-11-24', '2024-11-27'),
  (gen_random_uuid(), 'WINTER25', 'percentage', 25, 'scheduled', 0, 1000, '2024-12-01', '2025-02-28'),
  (gen_random_uuid(), 'SPRING15', 'percentage', 15, 'expired', 320, 500, '2024-03-01', '2024-05-31'),
  (gen_random_uuid(), 'NEWYEAR24', 'fixed', 24, 'expired', 1500, NULL, '2023-12-25', '2024-01-05'),
  (gen_random_uuid(), 'VIPONLY', 'percentage', 30, 'active', 84, 100, '2024-01-15', NULL),
  (gen_random_uuid(), 'B2BSPECIAL', 'percentage', 15, 'active', 211, NULL, '2024-02-01', NULL),
  (gen_random_uuid(), 'LOYALTY50', 'fixed', 50, 'active', 45, 50, '2024-06-15', '2024-12-31'),
  (gen_random_uuid(), 'HALLOWEEN', 'percentage', 31, 'scheduled', 0, 310, '2024-10-25', '2024-10-31'),
  (gen_random_uuid(), 'CYBERMONDAY', 'percentage', 45, 'scheduled', 0, NULL, '2024-12-02', '2024-12-03');
INSERT INTO store_settings (
  store_name,
  homepage_title,
  currency,
  timezone
)
VALUES (
  'My Store',
  'Welcome to My Store',
  'PKR',
  'Asia/Karachi'
);
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_orders BOOLEAN DEFAULT TRUE,
  email_stock BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  push_orders BOOLEAN DEFAULT TRUE,
  push_messages BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
INSERT INTO public.notifications (type, title, message, read, user_id, created_at)
SELECT
  v.type,
  v.title,
  v.message,
  v.read,
  u.user_id,
  v.created_at
FROM (
  VALUES
    ('order'::notification_type,   'New order received',       'Order #2145 from Sarah Khan has been placed.', false, NOW() - INTERVAL '3 minutes'),
    ('user'::notification_type,    'New customer message',     'From Ali Raza: Can you confirm delivery time for Karachi?', false, NOW() - INTERVAL '15 minutes'),
    ('payment'::notification_type, 'Payment received',         'Payment of PKR 12,500 received for Order #2142.', false, NOW() - INTERVAL '1 hour'),
    ('system'::notification_type,  'System maintenance notice','Scheduled maintenance tonight at 2:00 AM (UTC+5).', true,  NOW() - INTERVAL '4 hours'),
    ('review'::notification_type,  'New product review',       'A 5-star review was added for "Wireless Headphones".', false, NOW() - INTERVAL '1 day')
) AS v(type, title, message, read, created_at)
CROSS JOIN LATERAL (SELECT auth.uid() AS user_id) u;
DELETE FROM public.notifications
WHERE message LIKE '%John Doe%'
   OR message LIKE '%Alice Smith%'
   OR (title = 'System update' AND message LIKE '%2 AM%');
SELECT * FROM public.notifications;
SELECT id, title, user_id, created_at
FROM public.notifications
ORDER BY created_at DESC;

-- ---------------------------------------------------------------------------
-- Storefront orders (logged-in buyers): run `migrations/storefront_orders.sql`
-- after base schema. Adds orders.user_id, checkout_details, line snapshots on
-- order_items, and customer-facing RLS (also merged into rls_policies.sql).
--
-- Guest checkout (anon): after rls_policies.sql, run
-- `migrations/guest_checkout_anon_rls.sql` — create_guest_checkout_order RPC.
-- ---------------------------------------------------------------------------