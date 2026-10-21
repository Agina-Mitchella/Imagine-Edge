import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle,
  PlusCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { FoodItem, CyclePhase, FoodGroup, PrepLevel, Origin, DietaryPattern, Allergen } from '../types/nutrition';
import { getFoodGroupLabel, getPrepLevelLabel } from '../utils/recommendationEngine';

interface CatalogueReviewDrawerProps {
  catalogue: FoodItem[];
  onApproveDraft: (foodId: string) => void;
  onAddDraftItem: (item: FoodItem) => void;
  onClose: () => void;
}

export const CatalogueReviewDrawer: React.FC<CatalogueReviewDrawerProps> = ({
  catalogue,
  onApproveDraft,
  onAddDraftItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'active' | 'add'>('drafts');

  const draftItems = catalogue.filter((item) => item.status === 'draft');
  const activeItems = catalogue.filter((item) => item.status === 'active');

  // New item form state
  const [newName, setNewName] = useState('');
  const [newLocalName, setNewLocalName] = useState('');
  const [newFoodGroup, setNewFoodGroup] = useState<FoodGroup>('leafy_greens');
  const [newPrepLevel, setNewPrepLevel] = useState<PrepLevel>('cook');
  const [newPrepTime, setNewPrepTime] = useState(15);
  const [newOrigin, setNewOrigin] = useState<Origin>('east-african');
  const [newPhases, setNewPhases] = useState<CyclePhase[]>(['menstrual', 'follicular']);
  const [newNutrients, setNewNutrients] = useState('Iron, Vitamin C, Calcium');
  const [newDesc, setNewDesc] = useState('');
  const [newGeneralRationale, setNewGeneralRationale] = useState('');
  const [newSourceNote, setNewSourceNote] = useState('');

  const togglePhase = (p: CyclePhase) => {
    setNewPhases((prev) =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter((x) => x !== p) : prev) : [...prev, p]
    );
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: FoodItem = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      localName: newLocalName.trim() || undefined,
      foodGroup: newFoodGroup,
      prepLevel: newPrepLevel,
      prepTimeMinutes: Number(newPrepTime) || 10,
      budget: 'budget',
      origin: newOrigin,
      regionNotes: 'User submitted community/heritage entry',
      applicablePhases: newPhases,
      dietarySuitability: ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'halal'],
      allergens: [],
      keyNutrients: newNutrients.split(',').map((s) => s.trim()).filter(Boolean),
      description: newDesc.trim() || 'Nutritious whole food entry.',
      prepTips: 'Prepare gently to retain micronutrient integrity.',
      status: 'draft', // Critical rule: New entries stay draft until reviewed!
      symptomSupportMap: {},
      generalRationale:
        newGeneralRationale.trim() ||
        'Provides balanced macronutrients and micronutrients for general phase vitality.',
      generalSourceNote:
        newSourceNote.trim() || 'Kenya National Food Composition Tables / USDA FoodData Central.',
      imagePlaceholderNote: `${newName} fresh prep photo`,
    };

    onAddDraftItem(newItem);
    setActiveTab('drafts');
    // reset form
    setNewName('');
    setNewLocalName('');
    setNewDesc('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catalogue-title"
    >
      <div className="relative w-full max-w-4xl bg-white text-stone-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto no-scrollbar space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-700">
              Governance & Clinical Review
            </span>
            <h2 id="catalogue-title" className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Catalogue Management & Review
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Rule: <span className="font-semibold text-stone-700">New entries stay draft until reviewed.</span> Foods can appear in multiple phases.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'drafts'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Pending Review Drafts ({draftItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Active Catalogue ({activeItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'add'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Propose New Entry</span>
          </button>
        </div>

        {/* TAB 1: PENDING DRAFTS */}
        {activeTab === 'drafts' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Draft Isolation Enforced: </strong>
                <span>
                  Items below are staged in draft state. They are excluded from daily algorithm recommendations
                  until verified for dietary neutrality, approved citations, and multi-phase eligibility.
                </span>
              </div>
            </div>

            {draftItems.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs">
                All catalogue items have been reviewed! Click "Propose New Entry" to stage a new draft.
              </div>
            ) : (
              <div className="space-y-4">
                {draftItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-amber-300 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[11px] font-bold">
                          DRAFT REVIEW
                        </span>
                        <span className="text-xs font-semibold text-stone-500 uppercase">
                          {getFoodGroupLabel(item.foodGroup)}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs font-medium text-stone-600">
                          {item.origin === 'east-african' ? 'East African' : 'Global'}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-stone-900">
                        {item.name} {item.localName && `(${item.localName})`}
                      </h4>

                      <p className="text-xs text-stone-700 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-600">
                        <span className="font-semibold text-stone-800">
                          Eligible Phases ({item.applicablePhases.length}):
                        </span>
                        {item.applicablePhases.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded bg-white border border-stone-200 capitalize font-mono"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-stone-500 italic pt-1">
                        Source: {item.generalSourceNote}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onApproveDraft(item.id)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve to Active</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE CATALOGUE */}
        {activeTab === 'active' && (
          <div className="space-y-3">
            <p className="text-xs text-stone-600 mb-2">
              Currently active verified foods ({activeItems.length}) eligible for daily recommendation algorithm:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto no-scrollbar">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{item.name}</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-stone-500 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-2 text-[10.5px] text-stone-400 font-mono">
                    <span>{getFoodGroupLabel(item.foodGroup)}</span>
                    <span>·</span>
                    <span>Phases: {item.applicablePhases.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROPOSE NEW ENTRY */}
        {activeTab === 'add' && (
          <form onSubmit={handleCreateDraft} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-600">
              <strong className="text-stone-900 font-semibold">Staging Policy: </strong>
              Submitting this form adds a food entry in <span className="font-mono text-amber-800 font-bold">draft</span> status.
              It will remain draft until verified by the reviewer above.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Food Name (Common English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roasted Groundnuts (Peanuts)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Local / Cultural Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Njugu Karanga"
                  value={newLocalName}
                  onChange={(e) => setNewLocalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Food Group *</label>
                <select
                  value={newFoodGroup}
                  onChange={(e) => setNewFoodGroup(e.target.value as FoodGroup)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs"
                >
                  <option value="leafy_greens">Leafy Greens & Veggies</option>
                  <option value="lean_proteins">Proteins & Legumes</option>
                  <option value="complex_carbs">Complex Carbs & Grains</option>
                  <option value="healthy_fats">Healthy Fats & Seeds</option>
                  <option value="fruits_antioxidants">Fruits & Antioxidants</option>
                  <option value="hydration_broths">Hydration & Broths</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Prep Level *</label>
                <select
                  value={newPrepLevel}
                  onChange={(e) => setNewPrepLevel(e.target.value as PrepLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs"
                >
                  <option value="ready-to-eat">Ready-to-eat</option>
                  <option value="light-prep">Light prep</option>
                  <option value="cook">Cook</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Origin *</label>
                <select
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value as Origin)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs"
                >
                  <option value="east-african">East African Heritage</option>
                  <option value="global">Global Common</option>
                </select>
              </div>
            </div>

            {/* Applicable Phases (Multi-select) */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Applicable Phases (Foods can appear in multiple phases) *
              </label>
              <div className="flex flex-wrap gap-2">
                {(['menstrual', 'follicular', 'ovulatory', 'luteal'] as CyclePhase[]).map((phase) => {
                  const isChecked = newPhases.includes(phase);
                  return (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => togglePhase(phase)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${
                        isChecked
                          ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600'
                      }`}
                    >
                      {isChecked ? `✓ ${phase}` : `+ ${phase}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description & Source */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Description & Culinary Prep</label>
              <textarea
                rows={2}
                placeholder="Brief description of the ingredient, cooking preparation, or pairing..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Why this is shown (Neutral Nutritional Rationale)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rich in magnesium and plant protein..."
                  value={newGeneralRationale}
                  onChange={(e) => setNewGeneralRationale(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Approved Source Citation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kenya Food Comp Tables (2018) / USDA"
                  value={newSourceNote}
                  onChange={(e) => setNewSourceNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 outline-none text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                Save as Draft for Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
