'use client';

import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Accessibility, 
  Footprints, 
  X, 
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { GRAPH_NODES, INITIAL_BUILDINGS } from '../../data/mockCampusData';
import { calculateCampusRoute } from '../../services/navigationService';

export const NavigationPanel: React.FC = () => {
  const { 
    activeRoute, 
    setActiveRoute, 
    isNavPanelOpen, 
    setNavPanelOpen,
    selectedBuildingId
  } = useCampusStore();

  const [fromLocation, setFromLocation] = useState('node-north-gate');
  const [toLocation, setToLocation] = useState(selectedBuildingId || 'cs-block');
  const [routeMode, setRouteMode] = useState<'fastest' | 'accessible'>('fastest');

  React.useEffect(() => {
    if (selectedBuildingId) {
      setToLocation(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  if (!isNavPanelOpen && !activeRoute) return null;

  const handleCalculateRoute = () => {
    const route = calculateCampusRoute(fromLocation, toLocation, routeMode === 'accessible');
    setActiveRoute(route);
  };

  const handleClearRoute = () => {
    setActiveRoute(null);
    setNavPanelOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in duration-200">
      
      {/* Waypoint Header */}
      {activeRoute ? (
        <div className="p-4 bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">Live Navigation Engine</span>
            </div>

            <button
              type="button"
              onClick={handleClearRoute}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-colors touch-target-48"
            >
              END NAVIGATION
            </button>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">{activeRoute.toLocation}</h3>
            <p className="text-xs text-cyan-300 font-mono mt-0.5">
              {activeRoute.totalDistanceMeters} m • ~{activeRoute.estimatedWalkingMinutes} min walk
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            Navigation Waypoint Planner
          </h3>
          <button
            type="button"
            onClick={() => setNavPanelOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg touch-target-48"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Route Profile Mode Tabs (FASTEST / ACCESSIBLE) */}
      <div className="p-3 bg-slate-100 border-b border-slate-200 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setRouteMode('fastest');
              const route = calculateCampusRoute(fromLocation, toLocation, false);
              setActiveRoute(route);
            }}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all touch-target-48 active:scale-95 ${
              routeMode === 'fastest'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Footprints className="w-4 h-4 text-cyan-400" />
            <span>FASTEST</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRouteMode('accessible');
              const route = calculateCampusRoute(fromLocation, toLocation, true);
              setActiveRoute(route);
            }}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all touch-target-48 active:scale-95 ${
              routeMode === 'accessible'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Accessibility className="w-4 h-4 text-emerald-400" />
            <span>ACCESSIBLE</span>
          </button>
        </div>

        {/* Origin & Destination Dropdowns */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">From</label>
            <select
              value={fromLocation}
              onChange={(e) => {
                setFromLocation(e.target.value);
                const route = calculateCampusRoute(e.target.value, toLocation, routeMode === 'accessible');
                setActiveRoute(route);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="node-north-gate">📍 North Gate</option>
              <option value="node-south-gate">📍 South Gate</option>
              <option value="node-central-plaza">📍 Central Quad</option>
              {INITIAL_BUILDINGS.map(b => (
                <option key={b.id} value={b.id}>🏢 {b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">To</label>
            <select
              value={toLocation}
              onChange={(e) => {
                setToLocation(e.target.value);
                const route = calculateCampusRoute(fromLocation, e.target.value, routeMode === 'accessible');
                setActiveRoute(route);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="cs-block">💻 Lab 204 (CS Block)</option>
              <option value="central-lib">📚 Quiet Zone (Library)</option>
              <option value="cafeteria-main">🍽️ Central Cafeteria</option>
              {INITIAL_BUILDINGS.map(b => (
                <option key={b.id} value={b.id}>🏢 {b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Route Action Button */}
        {!activeRoute && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCalculateRoute}
              className="w-full min-h-[48px] rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all touch-target-48 active:scale-95"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>START NAVIGATION</span>
            </button>
          </div>
        )}
      </div>

      {/* Turn-by-Turn Steps */}
      {activeRoute && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Turn-by-Turn Guidance</div>
          <div className="space-y-3 border-l-2 border-cyan-500 ml-3 pl-4 relative">
            {activeRoute.steps.map((step, idx) => (
              <div key={idx} className="relative text-xs">
                <span className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-600" />
                <div className="font-extrabold text-slate-900 leading-snug">{step.instruction}</div>
                {step.distanceMeters > 0 && (
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{step.distanceMeters} m</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
