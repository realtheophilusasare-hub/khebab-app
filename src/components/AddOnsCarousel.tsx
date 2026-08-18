import type { Ingredient } from '../types';
import { formatPrice } from '../lib/utils';
import '../styles/AddOnsCarousel.css';

interface Props {
  ingredients: Ingredient[];
  selectedIds: string[];
  onQuickAdd: (ingredient: Ingredient) => void;
}

export function AddOnsCarousel({ ingredients, selectedIds, onQuickAdd }: Props) {
  if (ingredients.length === 0) return null;

  return (
    <div className="addons-section">
      <div className="addons-header">
        <h3 className="addons-title">Popular Add-ons</h3>
        <span className="addons-subtitle">Quick add · {formatPrice(2)} each</span>
      </div>
      <div className="addons-carousel">
        {ingredients.map(ingredient => {
          const isSelected = selectedIds.includes(ingredient.id);
          return (
            <button
              key={ingredient.id}
              className={`addon-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onQuickAdd(ingredient)}
            >
              <span className="addon-icon">{ingredient.icon}</span>
              <span className="addon-name">{ingredient.name}</span>
              {isSelected && <span className="addon-check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
