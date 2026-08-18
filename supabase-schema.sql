-- Khebab Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- ============ INGREDIENTS TABLE ============
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('meat', 'veggie', 'seasoning', 'sauce')),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  icon TEXT DEFAULT '',
  in_stock BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Anyone can read ingredients (they're public menu data)
CREATE POLICY "Anyone can read ingredients" ON ingredients
  FOR SELECT USING (true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Admins can insert ingredients" ON ingredients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update ingredients" ON ingredients
  FOR UPDATE TO authenticated USING (true);

-- ============ MENU ITEMS TABLE ============
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image TEXT DEFAULT '',
  category TEXT DEFAULT '',
  ingredients TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read menu_items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert menu_items" ON menu_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update menu_items" ON menu_items
  FOR UPDATE TO authenticated USING (true);

-- ============ KHEBAB ORDERS TABLE ============
CREATE TABLE IF NOT EXISTS khebab_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL DEFAULT '[]',
  quantity INTEGER NOT NULL DEFAULT 1,
  special_instructions TEXT DEFAULT '',
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'preparing', 'skewering', 'grilling', 'finishing', 'ready', 'completed', 'cancelled'
  )),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  delivery_address TEXT NOT NULL,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('momo', 'cash')),
  momo_provider TEXT DEFAULT NULL,
  momo_number TEXT DEFAULT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE khebab_orders ENABLE ROW LEVEL SECURITY;

-- Customers can read their own orders (matched by phone)
CREATE POLICY "Anyone can read orders by phone" ON khebab_orders
  FOR SELECT USING (true);

-- Anyone can create orders (customers placing orders)
CREATE POLICY "Anyone can create orders" ON khebab_orders
  FOR INSERT WITH CHECK (true);

-- Only admins can update order status
CREATE POLICY "Admins can update orders" ON khebab_orders
  FOR UPDATE TO authenticated USING (true);

-- ============ SEED DATA: INGREDIENTS ============
INSERT INTO ingredients (name, category, price, icon, in_stock, display_order) VALUES
('Beef', 'meat', 15, '🥩', true, 1),
('Chicken', 'meat', 12, '🍗', true, 2),
('Goat', 'meat', 18, '🐐', true, 3),
('Lamb', 'meat', 20, '🐑', true, 4),
('Pork', 'meat', 14, '🥓', true, 5),
('Turkey', 'meat', 16, '🦃', true, 6),
('Bell Pepper', 'veggie', 2, '🫑', true, 7),
('Onion', 'veggie', 2, '🧅', true, 8),
('Tomato', 'veggie', 2, '🍅', true, 9),
('Mushroom', 'veggie', 2, '🍄', true, 10),
('Pineapple', 'veggie', 2, '🍍', true, 11),
('Zucchini', 'veggie', 2, '🥒', true, 12),
('Cherry Tomato', 'veggie', 2, '🍅', true, 13),
('Spicy', 'seasoning', 0, '🌶️', true, 14),
('Garlic', 'seasoning', 0, '🧄', true, 15),
('Herb', 'seasoning', 0, '🌿', true, 16),
('Lemon Pepper', 'seasoning', 0, '🍋', true, 17),
('BBQ', 'seasoning', 0, '🔥', true, 18),
('Chili Sauce', 'sauce', 1, '🌶️', true, 19),
('Yogurt Sauce', 'sauce', 1, '🥛', true, 20),
('BBQ Sauce', 'sauce', 1, '🍯', true, 21),
('Garlic Sauce', 'sauce', 1, '🧄', true, 22),
('No Sauce', 'sauce', 0, '🚫', true, 23)
ON CONFLICT DO NOTHING;

-- ============ SEED DATA: MENU ITEMS ============
INSERT INTO menu_items (name, description, price, category, ingredients, is_popular, display_order) VALUES
('Classic Beef Skewer', 'Beef with bell pepper, onion, and tomato. Spicy seasoning with chili sauce.', 25, 'Classic', ARRAY['Beef', 'Bell Pepper', 'Onion', 'Tomato', 'Spicy', 'Chili Sauce'], true, 1),
('Chicken Deluxe', 'Grilled chicken with mushroom, onion, and garlic seasoning. Yogurt sauce.', 22, 'Classic', ARRAY['Chicken', 'Mushroom', 'Onion', 'Garlic', 'Yogurt Sauce'], true, 2),
('Goat Special', 'Marinated goat meat with bell pepper, cherry tomato, and herb seasoning.', 30, 'Premium', ARRAY['Goat', 'Bell Pepper', 'Cherry Tomato', 'Herb', 'Chili Sauce'], false, 3),
('Lamb Grill', 'New Zealand lamb with zucchini, pineapple, and lemon pepper seasoning.', 35, 'Premium', ARRAY['Lamb', 'Zucchini', 'Pineapple', 'Lemon Pepper', 'Garlic Sauce'], false, 4),
('Mixed Meat Feast', 'Beef and chicken combo with full veggie selection. BBQ seasoning and sauce.', 40, 'Combo', ARRAY['Beef', 'Chicken', 'Bell Pepper', 'Onion', 'Tomato', 'Mushroom', 'BBQ', 'BBQ Sauce'], true, 5),
('Turkey Lite', 'Lean turkey with zucchini, cherry tomato, and herb seasoning. No sauce.', 24, 'Lite', ARRAY['Turkey', 'Zucchini', 'Cherry Tomato', 'Herb', 'No Sauce'], false, 6)
ON CONFLICT DO NOTHING;

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_display_order ON ingredients(display_order);
CREATE INDEX IF NOT EXISTS idx_orders_status ON khebab_orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON khebab_orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON khebab_orders(created_at DESC);

-- ============ AUTO-UPDATE updated_at ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ingredients_updated_at BEFORE UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER khebab_orders_updated_at BEFORE UPDATE ON khebab_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============ ENABLE REAL-TIME ============
-- Run this to enable real-time on orders table for live tracking
ALTER PUBLICATION supabase_realtime ADD TABLE khebab_orders;
