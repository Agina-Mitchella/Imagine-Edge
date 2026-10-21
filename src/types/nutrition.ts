/**
 * Types and interfaces for the Cycle Phase Food Suggestions Platform
 */

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export type FoodGroup =
  | 'complex_carbs'
  | 'lean_proteins'
  | 'leafy_greens'
  | 'fruits_antioxidants'
  | 'healthy_fats'
  | 'hydration_broths';

export type PrepLevel = 'ready-to-eat' | 'light-prep' | 'cook';

export type BudgetTier = 'budget' | 'moderate' | 'premium';

export type Origin = 'east-african' | 'global' | 'hybrid';

export type Allergen =
  | 'gluten'
  | 'dairy'
  | 'nuts'
  | 'peanuts'
  | 'shellfish'
  | 'soy'
  | 'eggs';

export type DietaryPattern =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'halal';

export type Symptom =
  | 'cramps'
  | 'bloating'
  | 'fatigue'
  | 'brain_fog'
  | 'headaches'
  | 'mood_swings'
  | 'breast_tenderness'
  | 'cravings'
  | 'heavy_flow'
  | 'nausea';

export type EnergyLevel = 'low' | 'moderate' | 'high';
export type AppetiteLevel = 'low' | 'moderate' | 'high';

export interface SymptomSupportRationale {
  symptom: Symptom;
  rationale: string;
  sourceNote: string;
}

export interface FoodItem {
  id: string;
  name: string;
  localName?: string;
  foodGroup: FoodGroup;
  prepLevel: PrepLevel;
  prepTimeMinutes: number;
  budget: BudgetTier;
  origin: Origin;
  regionNotes: string;
  applicablePhases: CyclePhase[];
  dietarySuitability: DietaryPattern[];
  allergens: Allergen[];
  keyNutrients: string[];
  description: string;
  prepTips: string;
  status: 'active' | 'draft';
  symptomSupportMap: Partial<Record<Symptom, SymptomSupportRationale>>;
  generalRationale: string;
  generalSourceNote: string;
  imagePlaceholderNote: string;
}

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD
  cycleDay: number; // 1 - 35
  currentPhase: CyclePhase;
  energy: EnergyLevel;
  appetite: AppetiteLevel;
  symptoms: Symptom[];
  notes?: string;
}

export interface UserPreferences {
  userId: string;
  dietaryPattern: DietaryPattern;
  allergens: Allergen[];
  budgetPreference: BudgetTier | 'all';
  cycleLength: number;
  lastPeriodDate: string; // YYYY-MM-DD
}

export interface UserInteractionState {
  viewedItemIds: string[];
  savedItemIds: string[];
  enjoyedItemIds: string[];
  recommendationHistory: Record<string, string[]>; // { [YYYY-MM-DD]: itemIds[] }
  swappedItemsToday: Record<string, string>; // { [originalItemId]: replacementItemId }
}

export interface PhaseMetadata {
  id: CyclePhase;
  name: string;
  dayRange: string;
  physioSummary: string; // Neutral biological summary without medical claims
  keyNutrientFocus: string[];
  culinaryThemes: string;
}
