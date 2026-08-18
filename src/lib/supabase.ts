import { createClient } from '@supabase/supabase-js';
import type { Ingredient, KhebabOrder } from '../types';

// Initialize Supabase client
// In production, use environment variables: import.meta.env.VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============ INGREDIENTS ============

export async function fetchIngredients(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('in_stock', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }

  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: Number(item.price),
    icon: item.icon,
    in_stock: item.in_stock,
    display_order: item.display_order,
  }));
}

// ============ ORDERS ============

export async function createOrder(order: KhebabOrder): Promise<string> {
  const { data, error } = await supabase
    .from('khebab_orders')
    .insert({
      items: order.items,
      quantity: order.quantity,
      special_instructions: order.special_instructions,
      total_price: order.total_price,
      status: order.status,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      delivery_address: order.delivery_address,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  return data.id;
}

export async function fetchOrderByPhone(phone: string): Promise<KhebabOrder | null> {
  const { data, error } = await supabase
    .from('khebab_orders')
    .select('*')
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  if (!data) return null;

  return {
    items: data.items || [],
    quantity: data.quantity || 1,
    special_instructions: data.special_instructions || '',
    total_price: Number(data.total_price) || 0,
    status: data.status || 'pending',
    customer_name: data.customer_name || '',
    customer_phone: data.customer_phone || '',
    delivery_address: data.delivery_address || '',
  };
}

export async function fetchAllOrders(): Promise<KhebabOrder[]> {
  const { data, error } = await supabase
    .from('khebab_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return (data || []).map(item => ({
    items: item.items || [],
    quantity: item.quantity || 1,
    special_instructions: item.special_instructions || '',
    total_price: Number(item.total_price) || 0,
    status: item.status || 'pending',
    customer_name: item.customer_name || '',
    customer_phone: item.customer_phone || '',
    delivery_address: item.delivery_address || '',
  }));
}

// ============ MENU ITEMS ============

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  is_popular: boolean;
  display_order: number;
}

export async function fetchMenuItems(): Promise<MenuItemData[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }

  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    image: item.image || '',
    category: item.category || '',
    ingredients: item.ingredients || [],
    is_popular: item.is_popular || false,
    display_order: item.display_order || 0,
  }));
}

// ============ ORDER STATUS UPDATES ============

export async function updateOrderStatus(orderId: string, status: KhebabOrder['status']): Promise<void> {
  const { error } = await supabase
    .from('khebab_orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// ============ REAL-TIME ORDER TRACKING ============

export function subscribeToOrderStatus(
  orderId: string,
  callback: (status: KhebabOrder['status']) => void
) {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'khebab_orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        callback(payload.new.status);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
