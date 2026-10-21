import React, { useState } from 'react';
import {
  Calendar,
  Zap,
  UtensilsCrossed,
  Activity,
  ChevronDown,
  ChevronUp,
  Info,
  RotateCcw,
} from 'lucide-react';
import { DailyCheckIn, CyclePhase, EnergyLevel, AppetiteLevel, Symptom } from '../types/nutrition';
import { PHASE_METADATA } from '../data/foodCatalogue';

interface CheckInBannerProps {
  checkIn: DailyCheckIn;
  onUpdateCheckIn: (updated: Partial<DailyCheckIn>) => void;
  onResetCheckIn: () => void;
}

const AVAILABLE_SYMPTOMS: { id: Symptom; label: string; icon: string }[] = [
  { id: 'cramps', label: 'Cramping / Pelvic tension', icon: '⚡' },
  { id: 'bloating', label: 'Bloating / Fluid retention', icon: '💧' },
  { id: 'fatigue', label: 'Fatigue / Low stamina', icon: '🔋' },
  { id: 'brain_fog', label: 'Brain fog / Sluggish focus', icon: '🌫️' },
  { id: 'cravings', label: 'Sweet or savory cravings', icon: '🍫' },
  { id: 'mood_swings', label: 'Mood sensitivity', icon: '🌊' },
  { id: 'headaches', label: 'Headaches / Tension', icon: '💆' },
  { id: 'breast_tenderness', label: 'Breast tenderness', icon: '🌸' },
  { id: 'heavy_flow', label: 'Heavy flow', icon: '🩸' },
  { id: 'nausea', label: 'Nausea / Queasy stomach', icon: '🍵' },
];

export const CheckInBanner: React.FC<CheckInBannerProps> = ({
  checkIn,
  onUpdateCheckIn,
  onResetCheckIn,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const phaseMeta = PHASE_METADATA[checkIn.currentPhase];

  const handlePhaseChange = (phase: CyclePhase) => {
    let day = 3;
    if (phase === 'follicular') day = 8;
    if (phase === 'ovulatory') day = 14;
    if (phase === 'luteal') day = 21;
    onUpdateCheckIn({ currentPhase: phase, cycleDay: day });
  };

  const toggleSymptom = (symptom: Symptom) => {
    const current = checkIn.symptoms;
    const updated = current.includes(symptom)
      ? current.filter((s) => s !== symptom)
      : [...current, symptom];
    onUpdateCheckIn({ symptoms: updated });
  };

  return (
    <section className="bg-white border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Main Bar: Phase + Energy + Appetite + Symptoms summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Cycle Day & Phase Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
              <Calendar className="w-4 h-4 text-stone-600" />
              <span className="text-xs font-bold text-stone-900">
                Today: {checkIn.date} (Day {checkIn.cycleDay})
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
              {(['menstrual', 'follicular', 'ovulatory', 'luteal'] as CyclePhase[]).map((phase) => {
                const isActive = checkIn.currentPhase === phase;
                return (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => handlePhaseChange(phase)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all capitalize ${
                      isActive
                        ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {phase}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center: Energy & Appetite Quick Pills */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Energy */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-500 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Energy:
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                {(['low', 'moderate', 'high'] as EnergyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onUpdateCheckIn({ energy: lvl })}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                      checkIn.energy === lvl
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Appetite */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-500 flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                Appetite:
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                {(['low', 'moderate', 'high'] as AppetiteLevel[]).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => onUpdateCheckIn({ appetite: app })}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                      checkIn.appetite === app
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Full Symptom Check-in */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-rose-600" />
              <span>
                Symptoms ({checkIn.symptoms.length})
              </span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Symptoms Picker */}
        {isExpanded && (
          <div className="pt-4 border-t border-stone-100 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-stone-700">
                Select today's reported symptoms to calibrate nutrient rankings:
              </p>
              {checkIn.symptoms.length > 0 && (
                <button
                  type="button"
                  onClick={onResetCheckIn}
                  className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear all symptoms</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SYMPTOMS.map((sym) => {
                const isSelected = checkIn.symptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{sym.icon}</span>
                    <span>{sym.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Neutral Physiological Phase Rationale */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800 font-semibold">{phaseMeta.name} Context: </strong>
                <span>{phaseMeta.physioSummary} </span>
                <span className="font-semibold text-stone-700">Nutrient focus: </span>
                <span>{phaseMeta.keyNutrientFocus.join(' · ')}.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
