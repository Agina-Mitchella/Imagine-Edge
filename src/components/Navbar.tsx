import React from 'react';
import { SlidersHorizontal, Sparkles, BookOpen, Compass, BookmarkCheck, Shield } from 'lucide-react';
import { CyclePhase } from '../types/nutrition';
import { PHASE_METADATA } from '../data/foodCatalogue';

interface NavbarProps {
  currentPhase: CyclePhase;
  activeView: 'daily' | 'explore' | 'saved' | 'catalogue';
  onSelectView: (view: 'daily' | 'explore' | 'saved' | 'catalogue') => void;
  onOpenPreferences: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPhase,
  activeView,
  onSelectView,
  onOpenPreferences,
  savedCount,
}) => {
  const phaseMeta = PHASE_METADATA[currentPhase];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand & Current Phase */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSelectView('daily')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 block leading-tight">
                  Nyota Phase Nutrition
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  East African & Global Cycle Food Suggestions
                </span>
              </div>
            </button>

            {/* Current Estimated Phase Badge */}
            <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>Current: {phaseMeta?.name || 'Menstrual'}</span>
              <span className="text-rose-400">·</span>
              <span className="font-mono text-[11px] text-rose-700">{phaseMeta?.dayRange}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-stone-600">
            <button
              type="button"
              onClick={() => onSelectView('daily')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'daily'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Daily Suggestions</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('explore')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeView === 'explore'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore: {phaseMeta?.name.split(' ')[0]}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('saved')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'saved'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Saved ({savedCount})</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('catalogue')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'catalogue'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Catalogue & Review</span>
            </button>
          </nav>

          {/* Right Action: Filters & Preferences */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPreferences}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              aria-label="Dietary and Cycle Preferences"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
