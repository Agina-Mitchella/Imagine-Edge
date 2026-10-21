import React from 'react';
import { X, SlidersHorizontal, Check, AlertTriangle } from 'lucide-react';
import { UserPreferences, DietaryPattern, Allergen, BudgetTier } from '../types/nutrition';

interface DietaryPreferencesModalProps {
  isOpen: boolean;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onClose: () => void;
}

export const DietaryPreferencesModal: React.FC<DietaryPreferencesModalProps> = ({
  isOpen,
  preferences,
  onUpdatePreferences,
  onClose,
}) => {
  if (!isOpen) return null;

  const dietaryPatterns: { id: DietaryPattern; label: string }[] = [
    { id: 'omnivore', label: 'Omnivore (All foods)' },
    { id: 'vegetarian', label: 'Vegetarian (No meat/fish)' },
    { id: 'vegan', label: 'Vegan (100% plant-based)' },
    { id: 'pescatarian', label: 'Pescatarian (Fish & plants)' },
    { id: 'halal', label: 'Halal suitable' },
  ];

  const allergensList: { id: Allergen; label: string }[] = [
    { id: 'gluten', label: 'Gluten / Wheat' },
    { id: 'dairy', label: 'Dairy / Lactose' },
    { id: 'nuts', label: 'Tree Nuts (Walnuts, Almonds)' },
    { id: 'peanuts', label: 'Peanuts' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'soy', label: 'Soy' },
    { id: 'eggs', label: 'Eggs' },
  ];

  const toggleAllergen = (allergen: Allergen) => {
    const current = preferences.allergens;
    const updated = current.includes(allergen)
      ? current.filter((a) => a !== allergen)
      : [...current, allergen];
    onUpdatePreferences({ allergens: updated });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preferences-title"
    >
      <div className="relative w-full max-w-xl bg-white text-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto no-scrollbar space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-700">
              Filter Priorities
            </span>
            <h2 id="preferences-title" className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Dietary & Allergy Rules
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Priority 1: Strict Allergy Exclusions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">
              Allergies & Intolerances (Strict First-Pass Filter)
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Any ingredient containing selected allergens will be completely excluded prior to daily ranking.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {allergensList.map((allergen) => {
              const isSelected = preferences.allergens.includes(allergen.id);
              return (
                <button
                  key={allergen.id}
                  type="button"
                  onClick={() => toggleAllergen(allergen.id)}
                  className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{allergen.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority 2: Dietary Pattern */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <h3 className="text-sm font-bold text-stone-900">Dietary Pattern</h3>
          <div className="space-y-2">
            {dietaryPatterns.map((dp) => {
              const isSelected = preferences.dietaryPattern === dp.id;
              return (
                <button
                  key={dp.id}
                  type="button"
                  onClick={() => onUpdatePreferences({ dietaryPattern: dp.id })}
                  className={`w-full p-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-stone-900 border-stone-900 text-white font-semibold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{dp.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority 3: Budget Preference */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <h3 className="text-sm font-bold text-stone-900">Budget Range Preference</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'all', label: 'Any Budget' },
              { id: 'budget', label: 'Budget Friendly' },
              { id: 'moderate', label: 'Moderate' },
              { id: 'premium', label: 'Specialty / Prem.' },
            ].map((b) => {
              const isSelected = preferences.budgetPreference === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onUpdatePreferences({ budgetPreference: b.id as any })}
                  className={`p-2.5 rounded-xl border text-center transition-all font-medium ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
