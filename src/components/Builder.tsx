import { useMemo } from 'react';
import type { Ingredient, SelectedItem, BuilderStep } from '../types';
import { IngredientCard } from './IngredientCard';
import { SkewerVisualization } from './SkewerVisualization';
import { StepIndicator, BuildProgressBar } from './ProgressBar';
import { AddOnsCarousel } from './AddOnsCarousel';
import { formatPrice } from '../lib/utils';
import '../styles/Builder.css';

interface Props {
  currentStep: BuilderStep;
  groupedIngredients: Record<string, Ingredient[]>;
  selections: SelectedItem[];
  totalPrice: number;
  progress: number;
  quantity: number;
  specialInstructions: string;
  completedSteps: BuilderStep[];
  onToggleIngredient: (ingredient: Ingredient) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onStepClick: (step: BuilderStep) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onQuantityChange: (qty: number) => void;
  onSpecialInstructionsChange: (val: string) => void;
  onClearAll: () => void;
  onAddToCart: () => void;
  getSelection: (id: string) => SelectedItem | undefined;
}

const PRO_TIPS = [
  'Mix meats for the best flavor combination',
  'Pineapple adds a sweet caramelized touch',
  'Garlic seasoning pairs perfectly with chicken',
  'Goat meat tastes best with spicy seasoning',
  'Yogurt sauce balances spicy flavors beautifully',
];

export function Builder(props: Props) {
  const {
    currentStep,
    groupedIngredients,
    selections,
    totalPrice,
    progress,
    quantity,
    specialInstructions,
    completedSteps,
    onToggleIngredient,
    onUpdateQuantity,
    onStepClick,
    onNextStep,
    onPrevStep,
    onQuantityChange,
    onSpecialInstructionsChange,
    onClearAll,
    onAddToCart,
    getSelection,
  } = props;

  const selectedIds = useMemo(
    () => selections.map(s => s.ingredient_id),
    [selections]
  );

  const proTip = useMemo(() => {
    const tipIndex = selections.length % PRO_TIPS.length;
    return PRO_TIPS[tipIndex];
  }, [selections.length]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'meat':
        return (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Choose Your Meat</h2>
              <p className="step-subtitle">Select one or more — mix for the best flavor</p>
            </div>
            <div className="ingredient-grid">
              {groupedIngredients.meat?.map(ingredient => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  selected={getSelection(ingredient.id)}
                  onToggle={onToggleIngredient}
                  onQuantityChange={onUpdateQuantity}
                  multiSelect
                />
              ))}
            </div>
          </div>
        );

      case 'veggie':
        return (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Add Veggies</h2>
              <p className="step-subtitle">Fresh vegetables to complement your meat</p>
            </div>
            <div className="ingredient-grid">
              {groupedIngredients.veggie?.map(ingredient => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  selected={getSelection(ingredient.id)}
                  onToggle={onToggleIngredient}
                  onQuantityChange={onUpdateQuantity}
                  multiSelect
                />
              ))}
            </div>
            {/* Popular add-ons carousel */}
            <AddOnsCarousel
              ingredients={groupedIngredients.veggie || []}
              selectedIds={selectedIds}
              onQuickAdd={onToggleIngredient}
            />
          </div>
        );

      case 'sauce':
        return (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Sauces & Spice</h2>
              <p className="step-subtitle">Choose your seasoning and sauce</p>
            </div>
            <div className="sauce-section">
              <h3 className="section-label">Seasoning</h3>
              <div className="ingredient-grid horizontal">
                {groupedIngredients.seasoning?.map(ingredient => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    selected={getSelection(ingredient.id)}
                    onToggle={onToggleIngredient}
                    onQuantityChange={onUpdateQuantity}
                    multiSelect
                  />
                ))}
              </div>
              <h3 className="section-label">Sauce</h3>
              <div className="ingredient-grid horizontal">
                {groupedIngredients.sauce?.map(ingredient => (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    selected={getSelection(ingredient.id)}
                    onToggle={onToggleIngredient}
                    onQuantityChange={onUpdateQuantity}
                    multiSelect
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="step-content">
            <div className="step-header">
              <h2 className="step-title">Review & Order</h2>
              <p className="step-subtitle">Almost there — check your khebab</p>
            </div>

            <div className="review-section">
              <div className="review-quantity">
                <label className="review-label">Quantity</label>
                <div className="qty-control">
                  <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => onQuantityChange(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="review-instructions">
                <label className="review-label">Special Instructions</label>
                <textarea
                  className="instructions-input"
                  placeholder="e.g. extra well done, no onions on the skewer..."
                  value={specialInstructions}
                  onChange={e => onSpecialInstructionsChange(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="review-trust">
                <div className="trust-badge">
                  <span>🌿</span> Fresh Ingredients
                </div>
                <div className="trust-badge">
                  <span>🔥</span> Grilled to Perfection
                </div>
                <div className="trust-badge">
                  <span>🛡️</span> Hygienic & Safe
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="builder-container">
      <StepIndicator
        currentStep={currentStep}
        onStepClick={onStepClick}
        completedSteps={completedSteps}
      />

      <BuildProgressBar progress={progress} />

      {selections.length > 0 && currentStep !== 'review' && (
        <div className="pro-tip">
          <span className="pro-tip-icon">💡</span>
          <span className="pro-tip-text">{proTip}</span>
        </div>
      )}

      <div className="builder-layout">
        <div className="builder-main">
          {renderStepContent()}

          <div className="builder-nav">
            {currentStep !== 'meat' && (
              <button className="btn-secondary" onClick={onPrevStep}>
                ← Back
              </button>
            )}
            {currentStep !== 'review' ? (
              <button
                className="btn-primary"
                onClick={onNextStep}
                disabled={currentStep === 'meat' && !selections.some(s => s.category === 'meat')}
              >
                Continue →
              </button>
            ) : (
              <div className="review-actions">
                <button className="btn-ghost" onClick={onClearAll}>
                  Start Over
                </button>
                <button
                  className="btn-primary btn-add-cart"
                  onClick={onAddToCart}
                  disabled={selections.length === 0}
                >
                  Add to Cart · {formatPrice(totalPrice)}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="builder-side">
          <SkewerVisualization selections={selections} />
          {totalPrice > 0 && (
            <div className="total-bar">
              <span className="total-label">Total</span>
              <span className="total-value">{formatPrice(totalPrice)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
