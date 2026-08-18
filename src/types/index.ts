export type IngredientCategory = 'meat' | 'veggie' | 'seasoning' | 'sauce' | 'preset';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  price: number;
  icon: string;
  in_stock: boolean;
  display_order: number;
}

export interface SelectedItem {
  ingredient_id: string;
  name: string;
  category: IngredientCategory;
  quantity: number;
  price: number;
  icon: string;
}

export interface KhebabOrder {
  items: SelectedItem[];
  quantity: number;
  special_instructions: string;
  total_price: number;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'skewering'
  | 'grilling'
  | 'finishing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type BuilderStep = 'meat' | 'veggie' | 'sauce' | 'review';

export const STEP_FLOW: BuilderStep[] = ['meat', 'veggie', 'sauce', 'review'];

export const STEP_LABELS: Record<BuilderStep, string> = {
  meat: 'Choose Meat',
  veggie: 'Add Veggies',
  sauce: 'Sauces & Spice',
  review: 'Review & Order',
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'preparing',
  'skewering',
  'grilling',
  'finishing',
  'ready',
  'completed',
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  preparing: 'Preparing',
  skewering: 'Skewering',
  grilling: 'Grilling',
  finishing: 'Finishing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_PERCENTAGES: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 20,
  skewering: 40,
  grilling: 60,
  finishing: 80,
  ready: 100,
  completed: 100,
  cancelled: 0,
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#8892a6',
  preparing: '#f59e0b',
  skewering: '#f59e0b',
  grilling: '#f97316',
  finishing: '#fbbf24',
  ready: '#22c55e',
  completed: '#22c55e',
  cancelled: '#ef4444',
};
