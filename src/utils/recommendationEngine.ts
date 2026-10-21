import {
  FoodItem,
  DailyCheckIn,
  UserPreferences,
  UserInteractionState,
  FoodGroup,
  PrepLevel,
} from '../types/nutrition';

/**
 * 32-bit deterministic Mulberry32 PRNG
 */
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic hash of seed string
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Calculate item IDs recommended in the prior 7 days
 */
export function getRecent7DayItemIds(
  recommendationHistory: Record<string, string[]>,
  currentDateStr: string
): Set<string> {
  const recentIds = new Set<string>();
  const currentDate = new Date(currentDateStr);

  for (let d = 1; d <= 7; d++) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - d);
    const dateKey = pastDate.toISOString().split('T')[0];

    const itemsOnDate = recommendationHistory[dateKey];
    if (itemsOnDate) {
      itemsOnDate.forEach((id) => recentIds.add(id));
    }
  }

  return recentIds;
}

export interface ScoredFoodItem {
  food: FoodItem;
  score: number;
  matchedSymptoms: string[];
  isUnseen: boolean;
  isSaved: boolean;
  isEnjoyed: boolean;
  whyShownRationale: string;
  whyShownSource: string;
}

/**
 * Ranks all eligible foods for a given phase and daily check-in
 */
export function scoreAndRankFoods(
  catalogue: FoodItem[],
  checkIn: DailyCheckIn,
  preferences: UserPreferences,
  interactionState: UserInteractionState,
  prng: () => number
): ScoredFoodItem[] {
  const recent7DayIds = getRecent7DayItemIds(
    interactionState.recommendationHistory,
    checkIn.date
  );

  const scored: ScoredFoodItem[] = [];

  for (const food of catalogue) {
    // 1. New entries stay draft until reviewed
    if (food.status !== 'active') {
      continue;
    }

    // 2. Applicable for current phase
    if (!food.applicablePhases.includes(checkIn.currentPhase)) {
      continue;
    }

    // 3. Allergy Filter: exclude if food contains user allergen
    const hasAllergen = food.allergens.some((all) =>
      preferences.allergens.includes(all)
    );
    if (hasAllergen) {
      continue;
    }

    // 4. Dietary Pattern Filter: exclude if not suitable for user diet
    if (!food.dietarySuitability.includes(preferences.dietaryPattern)) {
      continue;
    }

    // 5. Budget preference filter (if specific budget requested)
    if (
      preferences.budgetPreference !== 'all' &&
      food.budget !== preferences.budgetPreference &&
      food.budget === 'premium'
    ) {
      // allow budget/moderate if user wants budget, filter out premium
      continue;
    }

    // 6. 7-Day History diversity rule:
    // No item repeats within 7 days unless the user saved it or marked it enjoyed
    const isSaved = interactionState.savedItemIds.includes(food.id);
    const isEnjoyed = interactionState.enjoyedItemIds.includes(food.id);
    const isRecent7Days = recent7DayIds.has(food.id);

    if (isRecent7Days && !isSaved && !isEnjoyed) {
      continue; // Exclude due to 7-day repeat rule
    }

    // 7. Base score & Check-in Symptom Ranking
    let score = 50;
    const matchedSymptoms: string[] = [];
    let whyShownRationale = food.generalRationale;
    let whyShownSource = food.generalSourceNote;

    // Evaluate reported symptoms
    for (const symptom of checkIn.symptoms) {
      const support = food.symptomSupportMap[symptom];
      if (support) {
        score += 35;
        matchedSymptoms.push(symptom);
        // Use specific symptom-grounded rationale
        whyShownRationale = support.rationale;
        whyShownSource = support.sourceNote;
      }
    }

    // Energy level ranking
    if (checkIn.energy === 'low') {
      if (food.prepLevel === 'ready-to-eat') score += 18;
      if (food.prepLevel === 'light-prep') score += 12;
      if (food.foodGroup === 'hydration_broths' || food.foodGroup === 'complex_carbs') {
        score += 10;
      }
    } else if (checkIn.energy === 'high') {
      if (food.prepLevel === 'cook') score += 10;
      if (food.foodGroup === 'lean_proteins') score += 10;
    }

    // Appetite level ranking
    if (checkIn.appetite === 'low') {
      if (food.prepLevel === 'ready-to-eat') score += 16;
      if (food.foodGroup === 'fruits_antioxidants' || food.foodGroup === 'hydration_broths') {
        score += 12;
      }
    } else if (checkIn.appetite === 'high') {
      if (food.foodGroup === 'lean_proteins' || food.foodGroup === 'complex_carbs') {
        score += 15;
      }
    }

    // Unseen Boost: Boost items the user hasn't viewed yet
    const isUnseen = !interactionState.viewedItemIds.includes(food.id);
    if (isUnseen) {
      score += 28;
    }

    // Enjoyed Boost
    if (isEnjoyed) {
      score += 14;
    }

    // Saved Boost
    if (isSaved) {
      score += 10;
    }

    // Deterministic tie-breaker jitter using seeded PRNG
    score += prng() * 8;

    scored.push({
      food,
      score,
      matchedSymptoms,
      isUnseen,
      isSaved,
      isEnjoyed,
      whyShownRationale,
      whyShownSource,
    });
  }

  // Sort descending by score
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Selects a diverse daily set of recommendations satisfying:
 * - Spans at least 3 distinct food groups
 * - Mixes prep levels (at least 2 distinct prep levels)
 * - Deterministic output based on inputs
 */
export function selectDailyDiverseSet(
  rankedCandidates: ScoredFoodItem[],
  targetCount = 4
): ScoredFoodItem[] {
  if (rankedCandidates.length <= targetCount) {
    return rankedCandidates;
  }

  const selected: ScoredFoodItem[] = [];
  const selectedFoodGroups = new Set<FoodGroup>();
  const selectedPrepLevels = new Set<PrepLevel>();

  // Always take top candidate first
  const first = rankedCandidates[0];
  selected.push(first);
  selectedFoodGroups.add(first.food.foodGroup);
  selectedPrepLevels.add(first.food.prepLevel);

  const remaining = rankedCandidates.slice(1);

  while (selected.length < targetCount && remaining.length > 0) {
    const slotsLeft = targetCount - selected.length;
    const groupsNeeded = Math.max(0, 3 - selectedFoodGroups.size);
    const prepsNeeded = Math.max(0, 2 - selectedPrepLevels.size);

    let bestIndex = -1;
    let bestHeuristicScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const addsNewGroup = !selectedFoodGroups.has(candidate.food.foodGroup);
      const addsNewPrep = !selectedPrepLevels.has(candidate.food.prepLevel);

      // If we are on our last spots and critically need group or prep diversity, enforce it
      if (slotsLeft <= groupsNeeded && !addsNewGroup) {
        continue;
      }
      if (slotsLeft <= prepsNeeded && !addsNewPrep && groupsNeeded === 0) {
        continue;
      }

      let heuristic = candidate.score;
      if (addsNewGroup) heuristic += 40;
      if (addsNewPrep) heuristic += 25;

      if (heuristic > bestHeuristicScore) {
        bestHeuristicScore = heuristic;
        bestIndex = i;
      }
    }

    // Fallback if strict filter eliminated all
    if (bestIndex === -1) {
      bestIndex = 0;
    }

    const chosen = remaining.splice(bestIndex, 1)[0];
    selected.push(chosen);
    selectedFoodGroups.add(chosen.food.foodGroup);
    selectedPrepLevels.add(chosen.food.prepLevel);
  }

  return selected;
}

/**
 * Swap Action:
 * Replaces one item in the set with another from a DIFFERENT food group,
 * still passing all allergy/dietary filters, 7-day repeat rules, and phase context.
 */
export function executeSwap(
  targetFoodId: string,
  currentSet: ScoredFoodItem[],
  rankedEligiblePool: ScoredFoodItem[]
): {
  newSet: ScoredFoodItem[];
  swappedInItem: ScoredFoodItem | null;
  previousFoodGroup: FoodGroup | null;
  newFoodGroup: FoodGroup | null;
} {
  const targetIndex = currentSet.findIndex((item) => item.food.id === targetFoodId);
  if (targetIndex === -1) {
    return {
      newSet: currentSet,
      swappedInItem: null,
      previousFoodGroup: null,
      newFoodGroup: null,
    };
  }

  const targetItem = currentSet[targetIndex];
  const targetFoodGroup = targetItem.food.foodGroup;
  const currentSetIds = new Set(currentSet.map((s) => s.food.id));

  // Find candidate from a DIFFERENT food group not currently in currentSet
  const candidatesDifferentGroup = rankedEligiblePool.filter(
    (item) => !currentSetIds.has(item.food.id) && item.food.foodGroup !== targetFoodGroup
  );

  if (candidatesDifferentGroup.length === 0) {
    // If no candidate from different group, take any non-duplicate candidate
    const fallbackCandidates = rankedEligiblePool.filter(
      (item) => !currentSetIds.has(item.food.id)
    );
    if (fallbackCandidates.length === 0) {
      return {
        newSet: currentSet,
        swappedInItem: null,
        previousFoodGroup: null,
        newFoodGroup: null,
      };
    }
    const replacement = fallbackCandidates[0];
    const newSet = [...currentSet];
    newSet[targetIndex] = replacement;
    return {
      newSet,
      swappedInItem: replacement,
      previousFoodGroup: targetFoodGroup,
      newFoodGroup: replacement.food.foodGroup,
    };
  }

  // Pick top candidate from different food group
  const replacement = candidatesDifferentGroup[0];
  const newSet = [...currentSet];
  newSet[targetIndex] = replacement;

  return {
    newSet,
    swappedInItem: replacement,
    previousFoodGroup: targetFoodGroup,
    newFoodGroup: replacement.food.foodGroup,
  };
}

/**
 * Human-readable food group label
 */
export function getFoodGroupLabel(fg: FoodGroup): string {
  switch (fg) {
    case 'complex_carbs':
      return 'Complex Carbs & Grains';
    case 'lean_proteins':
      return 'Proteins & Legumes';
    case 'leafy_greens':
      return 'Leafy Greens & Veggies';
    case 'fruits_antioxidants':
      return 'Fruits & Antioxidants';
    case 'healthy_fats':
      return 'Healthy Fats & Seeds';
    case 'hydration_broths':
      return 'Hydration & Broths';
    default:
      return fg;
  }
}

/**
 * Human-readable prep level label
 */
export function getPrepLevelLabel(pl: PrepLevel): string {
  switch (pl) {
    case 'ready-to-eat':
      return 'Ready-to-eat (<5 min)';
    case 'light-prep':
      return 'Light prep (5–15 min)';
    case 'cook':
      return 'Cook (15–30 min)';
    default:
      return pl;
  }
}
