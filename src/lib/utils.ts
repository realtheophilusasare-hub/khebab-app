import type { IngredientCategory } from '../types';

export function formatPrice(price: number): string {
  return `GHC ${price.toFixed(2)}`;
}

export function categoryColor(category: IngredientCategory): string {
  const colors: Record<IngredientCategory, string> = {
    meat: '#e74c3c',
    veggie: '#2ecc71',
    seasoning: '#f39c12',
    sauce: '#9b59b6',
    preset: '#3498db',
  };
  return colors[category] || '#95a5a6';
}

export function categoryBg(category: IngredientCategory): string {
  const colors: Record<IngredientCategory, string> = {
    meat: 'rgba(231, 76, 60, 0.15)',
    veggie: 'rgba(46, 204, 113, 0.15)',
    seasoning: 'rgba(243, 156, 18, 0.15)',
    sauce: 'rgba(155, 89, 182, 0.15)',
    preset: 'rgba(52, 152, 219, 0.15)',
  };
  return colors[category] || 'rgba(149, 165, 166, 0.15)';
}
