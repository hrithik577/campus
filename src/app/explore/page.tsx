'use client';

import React, { useState } from 'react';
import { MapControls } from '../../components/map/MapControls';
import { CampusMap } from '../../components/map/CampusMap';
import { BuildingPanel } from '../../components/explorer/BuildingPanel';
import { NavigationPanel } from '../../components/navigation/NavigationPanel';
import { MobileSearchBar } from '../../components/common/MobileSearchBar';
import { MobileBuildingSheet } from '../../components/explorer/MobileBuildingSheet';
import { MobileRoomSheet } from '../../components/explorer/MobileRoomSheet';
import { MobileCrowdSheet } from '../../components/crowd/MobileCrowdSheet';
import { MobileLayersSheet } from '../../components/map/MobileLayersSheet';
import { useCampusStore } from '../../services/campusStore';
import { Search, MapPin, Layers, Activity, Compass } from 'lucide-react';

export default function ExplorePage() {
  const { 
    selectedBuildingId,
    setSelectedBuildingId,
    selectedRoom,
    setSelectedRoom,
    activeRoute, 
    setCommandPaletteOpen,
    isNavPanelOpen,
    isLayersOpen,
    setLayersOpen,
    isCrowdOpen,
    setCrowdOpen
  } = useCampusStore();

  return (
    <div className="h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] lg:h-[calc(100vh-6.5rem)] w-full flex flex-col relative overflow-hidden">
      
      {/* MOBILE FLOATING TOP SEARCH BAR */}
      <MobileSearchBar />

      {/* DESKTOP TOP FILTER BAR (>= lg) */}
      <div className="hidden lg:flex items-center justify-between gap-3 mb-3">
        <MapControls />

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 text-xs font-semibold shadow-2xs transition-colors shrink-0"
        >
          <Search className="w-3.5 h-3.5 text-cyan-600" />
          <span>Search spaces ('/')</span>
        </button>
      </div>

      {/* MAIN SPATIAL OPERATING WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 relative overflow-hidden">
        
        {/* DESKTOP LEFT FLOATING SIDEBAR PANEL (>= lg) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-4 h-full overflow-y-auto z-20 space-y-4">
          {activeRoute || isNavPanelOpen ? (
            <NavigationPanel />
          ) : selectedBuildingId ? (
            <BuildingPanel />
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 mx-auto flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Select any building on the map</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click any building footprint on the digital twin canvas to inspect live telemetry occupancy, floor plans, equipment health, or trigger shortest-path navigation.
              </p>
            </div>
          )}
        </div>

        {/* PRIMARY INTERACTIVE CAMPUS MAP (100dvh on mobile) */}
        <div className="lg:col-span-8 xl:col-span-8 h-full w-full relative rounded-none lg:rounded-2xl overflow-hidden shadow-xl border-0 lg:border border-slate-200 bg-white">
          <CampusMap />

          {/* MOBILE EXTRA FLOATING QUICK TOGGLES (Layers & Pulse) */}
          <div className="lg:hidden absolute bottom-20 left-3 flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={() => setLayersOpen(true)}
              className="px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1.5 touch-target-48 active:scale-95"
            >
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>Layers</span>
            </button>

            <button
              type="button"
              onClick={() => setCrowdOpen(true)}
              className="px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1.5 touch-target-48 active:scale-95"
            >
              <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Pulse</span>
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE SHEETS (< lg) */}
      {/* 1. Navigation Panel Mobile Overlay */}
      {(activeRoute || isNavPanelOpen) && (
        <div className="lg:hidden fixed bottom-18 left-3 right-3 z-30 max-h-[60vh] overflow-y-auto">
          <NavigationPanel />
        </div>
      )}

      {/* 2. Building Sheet */}
      <MobileBuildingSheet
        isOpen={Boolean(selectedBuildingId && !selectedRoom && !activeRoute && !isNavPanelOpen)}
        onClose={() => setSelectedBuildingId(null)}
      />

      {/* 3. Room Sheet */}
      <MobileRoomSheet
        isOpen={Boolean(selectedRoom && !activeRoute && !isNavPanelOpen)}
        onClose={() => setSelectedRoom(null)}
      />

      {/* 4. Layers Sheet */}
      <MobileLayersSheet
        isOpen={isLayersOpen}
        onClose={() => setLayersOpen(false)}
      />

      {/* 5. Crowd Pulse Sheet */}
      <MobileCrowdSheet
        isOpen={isCrowdOpen}
        onClose={() => setCrowdOpen(false)}
      />

    </div>
  );
}
