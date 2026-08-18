import type { SelectedItem } from '../types';
import { categoryColor } from '../lib/utils';
import '../styles/SkewerVisualization.css';

interface Props {
  selections: SelectedItem[];
}

export function SkewerVisualization({ selections }: Props) {
  // Build the skewer: alternate meats and veggies, then seasonings/sauces at the bottom
  const meats = selections.filter(s => s.category === 'meat');
  const veggies = selections.filter(s => s.category === 'veggie');
  const seasonings = selections.filter(s => s.category === 'seasoning');
  const sauces = selections.filter(s => s.category === 'sauce');

  // Interleave meats and veggies on the skewer
  const skewerItems: SelectedItem[] = [];
  const maxLen = Math.max(meats.length, veggies.length);
  for (let i = 0; i < maxLen; i++) {
    if (meats[i]) skewerItems.push(meats[i]);
    if (veggies[i]) skewerItems.push(veggies[i]);
  }

  return (
    <div className="skewer-panel">
      <div className="skewer-panel-header">
        <h3 className="skewer-title">Your Khebab</h3>
        <span className="skewer-count">{selections.length} items</span>
      </div>

      {/* Visual skewer */}
      <div className="skewer-visual">
        <div className="skewer-stick">
          {selections.length === 0 ? (
            <p className="skewer-empty">Start building your khebab...</p>
          ) : (
            skewerItems.map((item, idx) => (
              <div
                key={`${item.ingredient_id}-${idx}`}
                className="skewer-dot"
                style={{
                  backgroundColor: categoryColor(item.category),
                  transform: `scale(${1 + (item.quantity - 1) * 0.15})`,
                }}
                title={`${item.name} x${item.quantity}`}
              >
                <span className="skewer-icon">{item.icon}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ingredient list */}
      <div className="skewer-ingredient-list">
        {selections.length === 0 ? (
          <p className="skewer-empty-list">No ingredients selected yet</p>
        ) : (
          selections.map(item => (
            <div key={item.ingredient_id} className="skewer-ingredient-row">
              <span className="ingredient-icon">{item.icon}</span>
              <span className="ingredient-name">{item.name}</span>
              <span className="ingredient-qty">x{item.quantity}</span>
            </div>
          ))
        )}
      </div>

      {/* Seasonings & sauces summary */}
      {(seasonings.length > 0 || sauces.length > 0) && (
        <div className="skewer-extras">
          {seasonings.length > 0 && (
            <div className="extra-row">
              <span className="extra-label">Seasoning:</span>
              <span className="extra-value">
                {seasonings.map(s => s.name).join(', ')}
              </span>
            </div>
          )}
          {sauces.length > 0 && (
            <div className="extra-row">
              <span className="extra-label">Sauce:</span>
              <span className="extra-value">
                {sauces.map(s => s.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
