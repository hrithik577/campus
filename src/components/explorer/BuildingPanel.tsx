'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building, 
  Room 
} from '../../types/campus';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Wrench, 
  Clock, 
  Accessibility, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  X
} from 'lucide-react';

export const BuildingPanel: React.FC = () => {
  const router = useRouter();
  const { 
    buildings, 
    selectedBuildingId, 
    setSelectedBuildingId,
    setActiveRoute,
    setFloorPlanOpen,
    setReportModalOpen
  } = useCampusStore();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!selectedBuildingId) return null;

  const bldg = buildings.find(b => b.id === selectedBuildingId);
  if (!bldg) return null;

  const handleStartNavigation = () => {
    const route = calculateCampusRoute('node-north-gate', bldg.id);
    setActiveRoute(route);
    router.push('/explore');
  };

  return (
    <div className={`w-full bg-white rounded-t-3xl lg:rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
      isExpanded ? 'max-h-[88vh]' : 'max-h-[60vh] lg:max-h-[85vh]'
    }`}>
      
      {/* Mobile Bottom Sheet Touch Drag Indicator & Expand Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center cursor-pointer lg:hidden touch-target"
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-1" />
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>{isExpanded ? 'Collapse Panel' : 'Swipe / Tap for Full Details'}</span>
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
        <button
          type="button"
          onClick={() => setSelectedBuildingId(null)}
          className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors touch-target flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
            {bldg.code}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {bldg.category}
          </span>
          <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            bldg.status === 'available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            ● {bldg.status.toUpperCase()}
          </span>
        </div>

        <h2 className="text-lg font-extrabold text-white leading-tight">{bldg.name}</h2>
        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">{bldg.description}</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-slate-100">
        
        {/* Telemetry Metrics Row */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Occupancy</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-extrabold text-slate-900">{bldg.occupancyPercentage}%</span>
              <span className="text-xs text-slate-500 font-medium">({bldg.currentOccupancy}/{bldg.capacity})</span>
            </div>
            {/* Occupancy Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  bldg.occupancyPercentage > 75 ? 'bg-rose-500' : bldg.occupancyPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${bldg.occupancyPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-400">Crowd Density</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${
                bldg.crowdLevel === 'high' ? 'bg-rose-500' : bldg.crowdLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {bldg.crowdLevel}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              Hardware: <span className="font-bold text-slate-700">{bldg.equipmentOperationalPct}% operational</span>
            </div>
          </div>
        </div>

        {/* Operating Hours & Accessibility */}
        <div className="pt-3 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="font-semibold text-slate-900">Hours:</span>
            <span>{bldg.openingHours}</span>
          </div>

          <div className="flex items-start gap-2 text-slate-700">
            <Accessibility className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Accessibility:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {bldg.accessibilityFeatures.map((acc, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-medium border border-teal-200/60">
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rooms List */}
        {bldg.popularRooms.length > 0 && (
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Rooms & Labs</span>
              <button
                type="button"
                onClick={() => setFloorPlanOpen(true)}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 touch-target"
              >
                Floor Blueprint <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {bldg.popularRooms.map((room) => (
                <div 
                  key={room.id}
                  className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{room.code} - {room.name}</div>
                    <div className="text-[11px] text-slate-500">Floor {room.floor} • Capacity {room.capacity}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    room.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    ● {room.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs (Min Touch Target 44px) */}
        <div className="pt-3 space-y-2">
          <button
            type="button"
            onClick={handleStartNavigation}
            className="w-full min-h-[44px] py-3 rounded-2xl bg-slate-900 text-white hover:bg-cyan-600 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            Start Turn-by-Turn Navigation
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFloorPlanOpen(true)}
              className="min-h-[44px] py-2.5 rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/80 active:scale-[0.98]"
            >
              <Layers className="w-4 h-4 text-slate-600" />
              View Floors
            </button>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="min-h-[44px] py-2.5 rounded-2xl bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-200/80 active:scale-[0.98]"
            >
              <Wrench className="w-4 h-4 text-amber-600" />
              Report Issue
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
