import React from 'react';
import {
  X,
  Clock,
  Globe2,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Heart,
  ChefHat,
  Sparkles,
} from 'lucide-react';
import { FoodItem } from '../types/nutrition';
import { getFoodGroupLabel, getPrepLevelLabel } from '../utils/recommendationEngine';

interface FoodDetailsModalProps {
  food: FoodItem | null;
  whyShownRationale: string;
  whyShownSource: string;
  isSaved: boolean;
  isEnjoyed: boolean;
  onToggleSave: (foodId: string) => void;
  onToggleEnjoyed: (foodId: string) => void;
  onClose: () => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  food,
  whyShownRationale,
  whyShownSource,
  isSaved,
  isEnjoyed,
  onToggleSave,
  onToggleEnjoyed,
  onClose,
}) => {
  if (!food) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white text-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto no-scrollbar space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                {getFoodGroupLabel(food.foodGroup)}
              </span>
              <span className="text-stone-300">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600">
                <Globe2 className="w-3 h-3 text-stone-400" />
                {food.origin === 'east-african' ? 'East African Heritage' : 'Global Common'}
              </span>
            </div>

            <h2 id="food-modal-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {food.name}
            </h2>
            {food.localName && (
              <p className="text-sm font-semibold text-rose-700 font-mono mt-0.5">
                {food.localName}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nutritional & Cultural Description */}
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>{food.description}</p>
          {food.regionNotes && (
            <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
              <strong className="text-stone-700 not-italic font-semibold">Cultural & Regional Context: </strong>
              {food.regionNotes}
            </p>
          )}
        </div>

        {/* "Why this is shown": strictly grounded in reported symptoms & source notes */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-950">
            <ShieldCheck className="w-4 h-4 text-rose-700 shrink-0" />
            <span>Why This Is Suggested For You Today:</span>
          </div>
          <p className="text-rose-900 leading-relaxed">
            {whyShownRationale}
          </p>
          <p className="text-[10.5px] text-rose-700 font-mono pt-1 border-t border-rose-200/80">
            Approved Citation: {whyShownSource}
          </p>
        </div>

        {/* Nutrients & Prep Advice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Key Nutrients
            </span>
            <div className="flex flex-wrap gap-1.5">
              {food.keyNutrients.map((n) => (
                <span
                  key={n}
                  className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-800 text-[11px] font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-stone-600" />
              Preparation Guidance ({food.prepTimeMinutes} mins)
            </span>
            <p className="text-stone-600 leading-normal">{food.prepTips}</p>
          </div>
        </div>

        {/* Multi-phase applicability */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
          <span className="font-semibold text-stone-800">Suited for phases:</span>
          {food.applicablePhases.map((phase) => (
            <span
              key={phase}
              className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 capitalize font-mono text-[11px]"
            >
              {phase}
            </span>
          ))}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleEnjoyed(food.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                isEnjoyed
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isEnjoyed ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{isEnjoyed ? 'Marked as Enjoyed' : 'Mark Enjoyed'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleSave(food.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                isSaved
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved to Staples' : 'Save Item'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
