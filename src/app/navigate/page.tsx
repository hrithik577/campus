'use client';

import React, { useEffect } from 'react';
import { NavigationPanel } from '../../components/navigation/NavigationPanel';
import { MobileNavOverlay } from '../../components/navigation/MobileNavOverlay';
import { CampusMap } from '../../components/map/CampusMap';
import { MobileSearchBar } from '../../components/common/MobileSearchBar';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';
import { Navigation, Zap, BookOpen, Coffee, Mic } from 'lucide-react';

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const quickDestinations = [
    { label: 'Lab 204', to: 'cs-block', emoji: '💻' },
    { label: 'Library', to: 'central-lib', emoji: '📚' },
    { label: 'Cafeteria', to: 'cafeteria-main', emoji: '🍽️' },
    { label: 'Auditorium', to: 'auditorium-main', emoji: '🎭' },
    { label: 'Hostel', to: 'hostel-h1', emoji: '🏠' },
    { label: 'Gym', to: 'sports-complex', emoji: '💪' },
  ];

  return (
    <div
      className={`relative w-full flex flex-col overflow-hidden ${
        isLiveNavActive
          ? 'h-[100dvh]'
          : 'h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] lg:h-[calc(100vh-6.5rem)]'
      }`}
    >
      {/* ── DESKTOP HEADER ────────────────────────────────────────────── */}
      {!isLiveNavActive && (
        <div className="hidden lg:flex items-center justify-between border-b border-slate-200 pb-3 mb-3 shrink-0">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-600" />
              Campus Navigation
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Turn-by-turn indoor+outdoor navigation with voice guidance.
            </p>
          </div>
        </div>
      )}

      {/* ── QUICK DESTINATION CHIPS (mobile, not during any nav state) ── */}
      {!isLiveNavActive && !activeRoute && (
        <div className="lg:hidden px-3 pt-3 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
            Quick:
          </span>
          {quickDestinations.map((dest) => (
            <button
              key={dest.label}
              type="button"
              onClick={() => {
                const route = calculateCampusRoute('node-north-gate', dest.to, routeType);
                if (route) setActiveRoute(route);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-white text-slate-700 border border-slate-200 shadow-sm active:scale-95 shrink-0 transition-transform"
            >
              <span>{dest.emoji}</span>
              {dest.label}
            </button>
          ))}
        </div>
      )}

      {/* ── MAIN LAYOUT ───────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 relative overflow-hidden">

        {/* Desktop sidebar */}
        <div className="hidden lg:block lg:col-span-4 h-full overflow-y-auto z-20">
          <NavigationPanel />
        </div>

        {/* Map — full-bleed on mobile, rounded card on desktop */}
        <div
          className={`lg:col-span-8 h-full relative overflow-hidden ${
            isLiveNavActive
              ? 'rounded-none'
              : 'rounded-none lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-xl'
          } bg-slate-100`}
        >
          <CampusMap />

          {/* Search bar floats over map on mobile when no route set */}
          {!isLiveNavActive && !activeRoute && (
            <div className="lg:hidden absolute top-0 left-0 right-0 z-30">
              <MobileSearchBar />
            </div>
          )}
        </div>

        {/* Mobile Nav Overlay — handles all mobile navigation UI states */}
        <MobileNavOverlay />
      </div>
    </div>
  );
}
