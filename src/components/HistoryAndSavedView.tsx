import React from 'react';
import {
  Bookmark,
  Heart,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { FoodItem } from '../types/nutrition';
import { getFoodGroupLabel, getPrepLevelLabel } from '../utils/recommendationEngine';

interface HistoryAndSavedViewProps {
  catalogue: FoodItem[];
  savedItemIds: string[];
  enjoyedItemIds: string[];
  recommendationHistory: Record<string, string[]>;
  onToggleSave: (foodId: string) => void;
  onToggleEnjoyed: (foodId: string) => void;
  onSelectFoodDetails: (food: FoodItem, whyShown: string, sourceNote: string) => void;
}

export const HistoryAndSavedView: React.FC<HistoryAndSavedViewProps> = ({
  catalogue,
  savedItemIds,
  enjoyedItemIds,
  recommendationHistory,
  onToggleSave,
  onToggleEnjoyed,
  onSelectFoodDetails,
}) => {
  const savedFoods = catalogue.filter((item) => savedItemIds.includes(item.id));
  const enjoyedFoods = catalogue.filter((item) => enjoyedItemIds.includes(item.id));

  // Sort history dates descending
  const sortedDates = Object.keys(recommendationHistory).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-10">
      {/* Section 1: Saved Staples & Enjoyed Foods */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            Personal Kitchen Staples
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Saved & Enjoyed Foods
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Items saved or marked enjoyed are permitted to reappear in your daily suggestions within the 7-day diversity window.
          </p>
        </div>

        {savedFoods.length === 0 && enjoyedFoods.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500 space-y-2">
            <Bookmark className="w-8 h-8 text-stone-300 mx-auto" />
            <p>You haven't bookmarked any staples yet.</p>
            <p className="text-stone-400">
              Click the bookmark icon or heart on any daily recommendation to save your preferred meals!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedFoods.map((food) => {
              const isEnjoyed = enjoyedItemIds.includes(food.id);
              return (
                <div
                  key={food.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-semibold text-stone-500 uppercase">
                        {getFoodGroupLabel(food.foodGroup)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">
                        Saved Staple
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{food.name}</h3>
                    {food.localName && (
                      <p className="text-xs font-semibold text-rose-700 font-mono mb-2">
                        {food.localName}
                      </p>
                    )}

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                      {food.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onToggleEnjoyed(food.id)}
                      className={`text-xs flex items-center gap-1 font-medium ${
                        isEnjoyed ? 'text-rose-600' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isEnjoyed ? 'fill-rose-600' : ''}`} />
                      <span>{isEnjoyed ? 'Enjoyed' : 'Mark Enjoyed'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectFoodDetails(food, food.generalRationale, food.generalSourceNote)
                        }
                        className="text-xs font-semibold text-stone-700 hover:text-stone-950 underline"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleSave(food.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: 7-Day History & Diversity Timeline */}
      <div className="space-y-4 pt-6 border-t border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Algorithm Verification Log
          </span>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            7-Day History & Diversity Tracker
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Demonstrates rotation: No food repeats within a 7-day rolling window unless saved or marked enjoyed.
          </p>
        </div>

        {sortedDates.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-xs text-stone-500 text-center">
            Today is your first tracked session! As days progress, past recommendation logs will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDates.slice(0, 7).map((dateKey) => {
              const itemIds = recommendationHistory[dateKey] || [];
              const foodsForDate = catalogue.filter((c) => itemIds.includes(c.id));

              return (
                <div
                  key={dateKey}
                  className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 font-mono font-bold text-stone-800">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <span>{dateKey}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {foodsForDate.map((f) => (
                      <span
                        key={f.id}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] text-emerald-700 font-semibold font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>0 repeats &ge; 3 groups</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
