'use client';

import React from 'react';
import { 
  Layers, 
  Users, 
  Accessibility, 
  Clock, 
  Wrench,
  BookOpen,
  Utensils,
  Dumbbell,
  Home,
  Car,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { BuildingCategory } from '../../types/campus';

export const MapControls: React.FC = () => {
  const { 
    activeCategoryFilter, 
    setActiveCategoryFilter,
    smartFilters,
    toggleSmartFilter
  } = useCampusStore();

  const categories: { key: BuildingCategory | 'all'; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'All', icon: Layers },
    { key: 'academic', label: 'Academic', icon: BookOpen },
    { key: 'labs', label: 'Labs', icon: Sparkles },
    { key: 'library', label: 'Library', icon: BookOpen },
    { key: 'food', label: 'Food', icon: Utensils },
    { key: 'sports', label: 'Sports', icon: Dumbbell },
    { key: 'hostels', label: 'Hostels', icon: Home },
    { key: 'parking', label: 'Parking', icon: Car },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategoryFilter === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Smart Filter Toggles */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
        <button
          onClick={() => toggleSmartFilter('availableNow')}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
            smartFilters.availableNow
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Available Now
        </button>

        <button
          onClick={() => toggleSmartFilter('lowCrowd')}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
            smartFilters.lowCrowd
              ? 'bg-cyan-50 border-cyan-300 text-cyan-700 font-semibold'
              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3 h-3 text-cyan-600" />
          Low Crowd
        </button>

        <button
          onClick={() => toggleSmartFilter('accessible')}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
            smartFilters.accessible
              ? 'bg-teal-50 border-teal-300 text-teal-700 font-semibold'
              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Accessibility className="w-3 h-3 text-teal-600" />
          Accessible
        </button>

        <button
          onClick={() => toggleSmartFilter('maintenance')}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
            smartFilters.maintenance
              ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold'
              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Wrench className="w-3 h-3 text-amber-600" />
          Open Maintenance
        </button>
      </div>
    </div>
  );
};
