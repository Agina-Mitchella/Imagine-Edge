import React, { useState } from 'react';
import {
  Compass,
  Filter,
  Clock,
  Globe2,
  Bookmark,
  BookmarkCheck,
  Heart,
  Info,
} from 'lucide-react';
import { FoodItem, CyclePhase, FoodGroup, PrepLevel, Origin } from '../types/nutrition';
import { PHASE_METADATA } from '../data/foodCatalogue';
import { getFoodGroupLabel, getPrepLevelLabel } from '../utils/recommendationEngine';

interface PhaseExplorerProps {
  initialPhase: CyclePhase;
  catalogue: FoodItem[];
  savedItemIds: string[];
  enjoyedItemIds: string[];
  onToggleSave: (foodId: string) => void;
  onToggleEnjoyed: (foodId: string) => void;
  onSelectFoodDetails: (food: FoodItem, whyShown: string, sourceNote: string) => void;
}

export const PhaseExplorer: React.FC<PhaseExplorerProps> = ({
  initialPhase,
  catalogue,
  savedItemIds,
  enjoyedItemIds,
  onToggleSave,
  onToggleEnjoyed,
  onSelectFoodDetails,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(initialPhase);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedPrep, setSelectedPrep] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');

  const phaseMeta = PHASE_METADATA[selectedPhase];

  // Eligible pool for selected phase (active items only)
  const eligiblePool = catalogue.filter(
    (item) => item.status === 'active' && item.applicablePhases.includes(selectedPhase)
  );

  // Apply in-explorer filters
  const filteredPool = eligiblePool.filter((item) => {
    if (selectedGroup !== 'all' && item.foodGroup !== selectedGroup) return false;
    if (selectedPrep !== 'all' && item.prepLevel !== selectedPrep) return false;
    if (selectedOrigin !== 'all' && item.origin !== selectedOrigin) return false;
    return true;
  });

  const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

  return (
    <div className="space-y-8">
      {/* Phase Selector Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-3">
          {phases.map((p) => {
            const meta = PHASE_METADATA[p];
            const count = catalogue.filter(
              (item) => item.status === 'active' && item.applicablePhases.includes(p)
            ).length;
            const isActive = selectedPhase === p;

            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPhase(p)}
                className={`relative px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <span>{meta.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count} items
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Biological Phase Overview Card (No unsubstantiated health claims) */}
      <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {phaseMeta.dayRange}
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              {phaseMeta.name} Context
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 self-start sm:self-auto font-mono">
            {eligiblePool.length} Active Eligible Foods
          </span>
        </div>

        <p className="text-sm text-stone-700 leading-relaxed font-normal">
          {phaseMeta.physioSummary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-bold text-stone-900 block mb-1">
              Physiological Nutrient Focus:
            </span>
            <p className="text-stone-600 leading-normal">
              {phaseMeta.keyNutrientFocus.join(' · ')}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="font-bold text-stone-900 block mb-1">
              Culinary & Preparation Themes:
            </span>
            <p className="text-stone-600 leading-normal">{phaseMeta.culinaryThemes}</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-stone-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            Filter pool:
          </span>

          {/* Food Group */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs outline-none"
          >
            <option value="all">All Food Groups</option>
            <option value="complex_carbs">Complex Carbs & Grains</option>
            <option value="lean_proteins">Proteins & Legumes</option>
            <option value="leafy_greens">Leafy Greens & Veggies</option>
            <option value="fruits_antioxidants">Fruits & Antioxidants</option>
            <option value="healthy_fats">Healthy Fats & Seeds</option>
            <option value="hydration_broths">Hydration & Broths</option>
          </select>

          {/* Prep Level */}
          <select
            value={selectedPrep}
            onChange={(e) => setSelectedPrep(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs outline-none"
          >
            <option value="all">All Prep Levels</option>
            <option value="ready-to-eat">Ready-to-eat (&lt;5 min)</option>
            <option value="light-prep">Light prep (5–15 min)</option>
            <option value="cook">Cook (&ge;15 min)</option>
          </select>

          {/* Origin */}
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs outline-none"
          >
            <option value="all">All Culinary Origins</option>
            <option value="east-african">East African Heritage</option>
            <option value="global">Global Common</option>
          </select>
        </div>

        <span className="text-stone-500 font-mono text-[11px]">
          Showing {filteredPool.length} of {eligiblePool.length} eligible
        </span>
      </div>

      {/* Grid of Eligible Foods for this Phase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPool.map((food) => {
          const isSaved = savedItemIds.includes(food.id);
          const isEnjoyed = enjoyedItemIds.includes(food.id);

          return (
            <article
              key={food.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
                  <span className="font-semibold text-stone-500 uppercase tracking-wider">
                    {getFoodGroupLabel(food.foodGroup)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                    {food.origin === 'east-african' ? 'East African' : 'Global'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 tracking-tight leading-snug">
                  {food.name}
                </h3>
                {food.localName && (
                  <p className="text-xs font-semibold text-rose-700 font-mono mb-2">
                    {food.localName}
                  </p>
                )}

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                  {food.description}
                </p>

                {/* Nutrients tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {food.keyNutrients.slice(0, 3).map((nutr) => (
                    <span
                      key={nutr}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10.5px]"
                    >
                      {nutr}
                    </span>
                  ))}
                </div>

                {/* Prep & Source Note */}
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{getPrepLevelLabel(food.prepLevel)}</span>
                  </div>
                  <p className="line-clamp-1 italic text-[10.5px]">
                    Ref: {food.generalSourceNote}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleEnjoyed(food.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isEnjoyed ? 'text-rose-600 bg-rose-50' : 'text-stone-400 hover:text-stone-700'
                    }`}
                    title={isEnjoyed ? 'Enjoyed' : 'Mark enjoyed'}
                  >
                    <Heart className={`w-4 h-4 ${isEnjoyed ? 'fill-rose-600' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSave(food.id)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isSaved ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-stone-700'
                    }`}
                    title={isSaved ? 'Saved' : 'Save'}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectFoodDetails(food, food.generalRationale, food.generalSourceNote)
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  View Details
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
