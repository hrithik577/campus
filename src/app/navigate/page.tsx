'use client';

import React from 'react';
import { NavigationPanel } from '../../components/navigation/NavigationPanel';
import { CampusMap } from '../../components/map/CampusMap';
import { useCampusStore } from '../../services/campusStore';
import { Navigation } from 'lucide-react';

export default function NavigatePage() {
  return (
    <div className="h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] lg:h-[calc(100vh-6.5rem)] w-full flex flex-col relative overflow-hidden">
      {/* DESKTOP HEADER (Hidden on mobile) */}
      <div className="hidden lg:flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-600" />
            Campus Waypoint Navigation Engine
          </h1>
          <p className="text-xs text-slate-500">
            Calculate shortest path walking directions between any two campus locations with optional wheelchair accessible routing.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 relative overflow-hidden">
        {/* DESKTOP SIDE PANEL (>= lg) */}
        <div className="hidden lg:block lg:col-span-4 h-full overflow-y-auto z-20">
          <NavigationPanel />
        </div>

        {/* MAP CONTAINER (100dvh full-bleed on mobile, 8 cols on desktop) */}
        <div className="lg:col-span-8 h-full relative rounded-none lg:rounded-2xl overflow-hidden border-0 lg:border border-slate-200 bg-white shadow-xl">
          <CampusMap />
        </div>

        {/* MOBILE FLOATING NAVIGATION OVERLAY (< lg) */}
        <div className="lg:hidden fixed bottom-18 left-3 right-3 z-30 max-h-[60vh] overflow-y-auto">
          <NavigationPanel />
        </div>
      </div>
    </div>
  );
}
