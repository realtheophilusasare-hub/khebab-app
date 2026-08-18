import type { Ingredient, SelectedItem } from '../types';
import { formatPrice, categoryBg } from '../lib/utils';
import '../styles/IngredientCard.css';

interface Props {
  ingredient: Ingredient;
  selected?: SelectedItem;
  onToggle: (ingredient: Ingredient) => void;
  onQuantityChange: (id: string, delta: number) => void;
  multiSelect?: boolean;
}

export function IngredientCard({
  ingredient,
  selected,
  onToggle,
  onQuantityChange,
  multiSelect = true,
}: Props) {
  const isSelected = !!selected;

  return (
    <div
      className={`ingredient-card ${isSelected ? 'selected' : ''}`}
      style={{ background: isSelected ? categoryBg(ingredient.category) : undefined }}
      onClick={() => onToggle(ingredient)}
    >
      <div className="ingredient-card-icon">{ingredient.icon}</div>
      <div className="ingredient-card-info">
        <span className="ingredient-card-name">{ingredient.name}</span>
        <span className="ingredient-card-price">
          {ingredient.price === 0 ? 'Free' : formatPrice(ingredient.price)}
        </span>
      </div>

      {multiSelect && (
        <div className="ingredient-card-checkbox">
          {isSelected && <span className="check-mark">✓</span>}
        </div>
      )}

      {isSelected && selected!.quantity > 1 && (
        <div className="ingredient-card-qty" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onQuantityChange(ingredient.id, -1)}>−</button>
          <span>{selected!.quantity}</span>
          <button onClick={() => onQuantityChange(ingredient.id, 1)}>+</button>
        </div>
      )}
    </div>
  );
}
