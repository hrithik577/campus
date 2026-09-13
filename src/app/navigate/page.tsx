'use client';

import React from 'react';
import { NavigationPanel } from '../../components/navigation/NavigationPanel';
import { CampusMap } from '../../components/map/CampusMap';
import { useCampusStore } from '../../services/campusStore';
import { Navigation } from 'lucide-react';

export default function NavigatePage() {
  return (
    <div className="space-y-4 h-[calc(100dvh-7rem)] flex flex-col px-3 sm:px-0">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 relative">
        {/* DESKTOP SIDE PANEL (>= lg) */}
        <div className="hidden lg:block lg:col-span-4 h-full overflow-y-auto">
          <NavigationPanel />
        </div>

        {/* MAP CONTAINER (Full height on mobile, 8 cols on desktop) */}
        <div className="col-span-1 lg:col-span-8 h-full relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl">
          <CampusMap />
        </div>

        {/* MOBILE FLOATING OVERLAY (< lg) */}
        <div className="block lg:hidden fixed bottom-16 left-3 right-3 z-30 max-h-[50vh] overflow-y-auto">
          <NavigationPanel />
        </div>
      </div>
    </div>
  );
}
