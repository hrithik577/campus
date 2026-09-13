'use client';

import React from 'react';
import { 
  Layers, 
  Building as BuildingIcon, 
  Utensils, 
  Trophy, 
  Car, 
  Home, 
  Activity, 
  Wrench, 
  Accessibility,
  X,
  Check,
  Dumbbell,
  ShoppingBag,
  HeartPulse,
  UtensilsCrossed,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { BuildingCategory } from '../../types/campus';
import { MobileBottomSheet } from '../common/MobileBottomSheet';

interface MobileLayersSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileLayersSheet: React.FC<MobileLayersSheetProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    activeCategoryFilter, 
    setActiveCategoryFilter,
    smartFilters,
    toggleSmartFilter
  } = useCampusStore();

  const categories: { key: BuildingCategory | 'all'; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'All Buildings', icon: Layers },
    { key: 'hostels', label: 'Hostel', icon: Home },
    { key: 'mess', label: 'Mess & Dining', icon: UtensilsCrossed },
    { key: 'mart', label: 'Student Mart', icon: ShoppingBag },
    { key: 'mrc', label: 'College MRC', icon: HeartPulse },
    { key: 'gym', label: 'Gym & Fitness', icon: Dumbbell },
    { key: 'basketball', label: 'Basketball Court', icon: Trophy },
    { key: 'football', label: 'Football Ground', icon: Activity },
    { key: 'library', label: 'Library', icon: BookOpen },
    { key: 'labs', label: 'Labs & Research', icon: Sparkles },
    { key: 'food', label: 'Food & Cafes', icon: Utensils },
    { key: 'academic', label: 'Academic Blocks', icon: BuildingIcon },
    { key: 'parking', label: 'Parking & EV', icon: Car },
  ];

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="half"
    >
      <div className="space-y-4 text-slate-900 pb-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">MAP LAYERS & OVERLAYS</h2>
              <span className="text-[10px] text-slate-400 font-mono">Spatial Filter Controls</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 touch-target-48"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Building Category Selectors */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Category Filters</div>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategoryFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    setActiveCategoryFilter(cat.key);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-bold transition-all min-h-[48px] touch-target-48 active:scale-95 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spatial Intelligence Telemetry Overlays */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Telemetry Overlays</div>
          
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => toggleSmartFilter('lowCrowd')}
              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all min-h-[48px] touch-target-48 active:scale-[0.99] ${
                smartFilters.lowCrowd
                  ? 'bg-cyan-50 text-cyan-950 border-cyan-300 ring-2 ring-cyan-400/40'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-rose-500" />
                <span>Crowd Density Heatmap</span>
              </div>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                smartFilters.lowCrowd ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white border-slate-300'
              }`}>
                {smartFilters.lowCrowd && <Check className="w-4 h-4" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleSmartFilter('maintenance')}
              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all min-h-[48px] touch-target-48 active:scale-[0.99] ${
                smartFilters.maintenance
                  ? 'bg-amber-50 text-amber-950 border-amber-300 ring-2 ring-amber-400/40'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Maintenance Alerts Layer</span>
              </div>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                smartFilters.maintenance ? 'bg-amber-600 text-white border-amber-600' : 'bg-white border-slate-300'
              }`}>
                {smartFilters.maintenance && <Check className="w-4 h-4" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleSmartFilter('accessible')}
              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all min-h-[48px] touch-target-48 active:scale-[0.99] ${
                smartFilters.accessible
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300 ring-2 ring-emerald-400/40'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Accessibility className="w-4 h-4 text-emerald-600" />
                <span>Wheelchair Accessibility Paths</span>
              </div>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                smartFilters.accessible ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300'
              }`}>
                {smartFilters.accessible && <Check className="w-4 h-4" />}
              </div>
            </button>
          </div>
        </div>

      </div>
    </MobileBottomSheet>
  );
};
