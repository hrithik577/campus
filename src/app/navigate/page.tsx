'use client';

import React, { useEffect } from 'react';
import { NavigationPanel } from '../../components/navigation/NavigationPanel';
import { MobileNavOverlay } from '../../components/navigation/MobileNavOverlay';
import { CampusMap } from '../../components/map/CampusMap';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';
import { INITIAL_BUILDINGS } from '../../data/mockCampusData';
import { Navigation, MapPin, Search, ArrowRight } from 'lucide-react';

export default function NavigatePage() {
  const { 
    activeRoute, 
    setActiveRoute, 
    selectedBuildingId, 
    isLiveNavActive,
    setRouteType,
    routeType,
  } = useCampusStore();

  // Pre-load a route when landing on navigate page if none set
  useEffect(() => {
    if (!activeRoute) {
      const targetId = selectedBuildingId || 'cs-block';
      const route = calculateCampusRoute('node-north-gate', targetId, 'fastest');
      if (route) setActiveRoute(route);
    }
  }, [activeRoute, selectedBuildingId, setActiveRoute]);

  // Quick destination chips for desktop + mobile search
  const quickDestinations = [
    { label: 'Lab 204', from: 'node-north-gate', to: 'cs-block', emoji: '💻' },
    { label: 'Library', from: 'node-north-gate', to: 'central-lib', emoji: '📚' },
    { label: 'Cafeteria', from: 'node-north-gate', to: 'cafeteria-main', emoji: '🍽️' },
    { label: 'Auditorium', from: 'node-north-gate', to: 'auditorium-main', emoji: '🎭' },
  ];

  return (
    // During live nav: full-screen on mobile (fixed overlay handles UI)
    // Normal mode: standard padded layout
    <div className={`relative w-full ${
      isLiveNavActive
        ? 'h-screen' // map fills viewport; overlay positions absolutely
        : 'h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] lg:h-[calc(100vh-6.5rem)]'
    } flex flex-col overflow-hidden`}>

      {/* ── DESKTOP HEADER (hidden on mobile, hidden during live nav) ── */}
      {!isLiveNavActive && (
        <div className="hidden lg:flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-600" />
              Campus Navigation
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Turn-by-turn directions between any campus location — with voice guidance and indoor floor navigation.
            </p>
          </div>
        </div>
      )}

      {/* ── QUICK DESTINATION CHIPS (mobile, not live) ────────────── */}
      {!isLiveNavActive && (
        <div className="lg:hidden px-3 pt-3 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">Go to:</span>
          {quickDestinations.map((dest) => (
            <button
              key={dest.label}
              type="button"
              onClick={() => {
                const route = calculateCampusRoute(dest.from, dest.to, routeType);
                if (route) setActiveRoute(route);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                activeRoute?.toLocation.toLowerCase().includes(dest.label.toLowerCase())
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 shadow-sm'
              }`}
            >
              <span>{dest.emoji}</span>
              {dest.label}
            </button>
          ))}
        </div>
      )}

      {/* ── MAIN LAYOUT ────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 relative overflow-hidden">
        
        {/* Desktop side panel */}
        <div className="hidden lg:block lg:col-span-4 h-full overflow-y-auto z-20">
          <NavigationPanel />
        </div>

        {/* Map (full-bleed on mobile) */}
        <div className={`lg:col-span-8 h-full relative overflow-hidden border-0 ${
          isLiveNavActive
            ? 'rounded-none'
            : 'rounded-none lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-xl'
        } bg-white`}>
          <CampusMap />
        </div>

        {/* Mobile overlay (destination preview + live nav HUD) */}
        <MobileNavOverlay />
      </div>
    </div>
  );
}
