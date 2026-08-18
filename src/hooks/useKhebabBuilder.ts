import { useState, useCallback, useMemo } from 'react';
import type { Ingredient, SelectedItem, BuilderStep } from '../types';
import { STEP_FLOW } from '../types';

const STEP_PROGRESS: Record<BuilderStep, number> = {
  meat: 25,
  veggie: 50,
  sauce: 75,
  review: 100,
};

export function useKhebabBuilder(allIngredients: Ingredient[]) {
  const [currentStep, setCurrentStep] = useState<BuilderStep>('meat');
  const [selections, setSelections] = useState<SelectedItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const groupedIngredients = useMemo(() => {
    const groups: Record<string, Ingredient[]> = {
      meat: [],
      veggie: [],
      seasoning: [],
      sauce: [],
    };
    allIngredients
      .filter(i => i.in_stock)
      .sort((a, b) => a.display_order - b.display_order)
      .forEach(i => {
        if (groups[i.category]) groups[i.category].push(i);
      });
    return groups;
  }, [allIngredients]);

  const selectedItems = useMemo(() => {
    return selections;
  }, [selections]);

  const totalPrice = useMemo(() => {
    const itemsTotal = selections.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return itemsTotal * quantity;
  }, [selections, quantity]);

  const progress = useMemo(() => STEP_PROGRESS[currentStep], [currentStep]);

  const getSelection = useCallback(
    (ingredientId: string) => selections.find(s => s.ingredient_id === ingredientId),
    [selections]
  );

  const toggleIngredient = useCallback((ingredient: Ingredient) => {
    setSelections(prev => {
      const existing = prev.find(s => s.ingredient_id === ingredient.id);
      if (existing) {
        return prev.filter(s => s.ingredient_id !== ingredient.id);
      }
      return [
        ...prev,
        {
          ingredient_id: ingredient.id,
          name: ingredient.name,
          category: ingredient.category,
          quantity: 1,
          price: ingredient.price,
          icon: ingredient.icon,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((ingredientId: string, delta: number) => {
    setSelections(prev =>
      prev
        .map(s => {
          if (s.ingredient_id !== ingredientId) return s;
          const newQty = s.quantity + delta;
          return newQty <= 0 ? null : { ...s, quantity: newQty };
        })
        .filter(Boolean) as SelectedItem[]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSelections([]);
    setQuantity(1);
    setSpecialInstructions('');
    setCurrentStep('meat');
  }, []);

  const goToStep = useCallback((step: BuilderStep) => setCurrentStep(step), []);

  const nextStep = useCallback(() => {
    const idx = STEP_FLOW.indexOf(currentStep);
    if (idx < STEP_FLOW.length - 1) setCurrentStep(STEP_FLOW[idx + 1]);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const idx = STEP_FLOW.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEP_FLOW[idx - 1]);
  }, [currentStep]);

  return {
    currentStep,
    selections: selectedItems,
    groupedIngredients,
    totalPrice,
    progress,
    quantity,
    specialInstructions,
    getSelection,
    toggleIngredient,
    updateQuantity,
    setQuantity,
    setSpecialInstructions,
    clearAll,
    goToStep,
    nextStep,
    prevStep,
  };
}
