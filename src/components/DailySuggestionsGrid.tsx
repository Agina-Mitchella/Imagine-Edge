import React from 'react';
import {
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Heart,
  Sparkles,
  Clock,
  Coins,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ScoredFoodItem, getFoodGroupLabel, getPrepLevelLabel } from '../utils/recommendationEngine';
import { FoodItem } from '../types/nutrition';

interface DailySuggestionsGridProps {
  dailyItems: ScoredFoodItem[];
  onSwapItem: (foodId: string) => void;
  onToggleSave: (foodId: string) => void;
  onToggleEnjoyed: (foodId: string) => void;
  onSelectFoodDetails: (food: FoodItem, whyShown: string, sourceNote: string) => void;
}

export const DailySuggestionsGrid: React.FC<DailySuggestionsGridProps> = ({
  dailyItems,
  onSwapItem,
  onToggleSave,
  onToggleEnjoyed,
  onSelectFoodDetails,
}) => {
  // Compute diversity statistics for the user
  const foodGroupsSet = new Set(dailyItems.map((item) => item.food.foodGroup));
  const prepLevelsSet = new Set(dailyItems.map((item) => item.food.prepLevel));

  return (
    <div className="space-y-6">
      {/* Diversity Verification & Integrity Badge Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-600 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="text-stone-900 font-semibold">{foodGroupsSet.size} Food Groups</strong>{' '}
              covered (Requirement: &ge;3)
            </span>
          </div>

          <span className="hidden sm:inline text-stone-300">|</span>

          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="text-stone-900 font-semibold">{prepLevelsSet.size} Prep Levels</strong>{' '}
              mixed (Ready-to-eat & Cooked)
            </span>
          </div>

          <span className="hidden sm:inline text-stone-300">|</span>

          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong className="text-stone-900 font-semibold">7-Day Diversity</strong> rule enforced
            </span>
          </div>
        </div>

        <div className="text-[11px] text-stone-400 font-mono">
          Deterministic Daily Seed Active
        </div>
      </div>

      {/* Grid of Food Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dailyItems.map((item) => {
          const { food, isUnseen, isSaved, isEnjoyed, whyShownRationale, whyShownSource } = item;

          return (
            <article
              key={food.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-stone-200 hover:border-stone-300 p-6 shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Top Row: Unseen "New to you" tag, Food Group, Origin */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* "New to you" tag on unseen items */}
                    {isUnseen && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold tracking-tight">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        New to you
                      </span>
                    )}

                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      {getFoodGroupLabel(food.foodGroup)}
                    </span>

                    <span className="text-stone-300">·</span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {getPrepLevelLabel(food.prepLevel)}
                    </span>
                  </div>

                  {/* Origin tag */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    <Globe2 className="w-3 h-3 text-stone-500" />
                    {food.origin === 'east-african' ? 'East African' : 'Global Common'}
                  </span>
                </div>

                {/* Title & Local Name */}
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-snug">
                    {food.name}
                  </h3>
                  {food.localName && (
                    <p className="text-xs font-semibold text-rose-700 font-mono mt-0.5">
                      {food.localName}
                    </p>
                  )}
                </div>

                {/* Short Description & Regional notes */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                  {food.description}
                </p>

                {/* Key Nutrients */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {food.keyNutrients.map((nutr) => (
                    <span
                      key={nutr}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                    >
                      {nutr}
                    </span>
                  ))}
                </div>

                {/* "Why this is shown": Strictly tied to reported symptoms and approved source notes */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 mb-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Why this is shown:</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-normal">
                    {whyShownRationale}
                  </p>
                  <p className="text-[10.5px] text-stone-400 font-mono pt-1 border-t border-stone-200/60">
                    Source: {whyShownSource}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Row: Swap action + Save + Enjoyed + Recipe */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                {/* Swap Action: Replaces item with another from a DIFFERENT food group */}
                <button
                  type="button"
                  onClick={() => onSwapItem(food.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  title="Swap with an item from a different food group"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
                  <span>Swap</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Mark as Enjoyed (allows 7-day re-entry) */}
                  <button
                    type="button"
                    onClick={() => onToggleEnjoyed(food.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isEnjoyed
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-stone-500 hover:bg-stone-100'
                    }`}
                    title={
                      isEnjoyed
                        ? 'Marked as enjoyed (can appear within 7 days)'
                        : 'Mark as enjoyed'
                    }
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isEnjoyed ? 'fill-rose-600 text-rose-600' : 'text-stone-400'
                      }`}
                    />
                    <span className="hidden sm:inline">
                      {isEnjoyed ? 'Enjoyed' : 'Enjoy'}
                    </span>
                  </button>

                  {/* Bookmark / Save */}
                  <button
                    type="button"
                    onClick={() => onToggleSave(food.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isSaved
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-stone-500 hover:bg-stone-100'
                    }`}
                    title={isSaved ? 'Saved to staples' : 'Save item'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-stone-400" />
                    )}
                  </button>

                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() => onSelectFoodDetails(food, whyShownRationale, whyShownSource)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
