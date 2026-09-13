'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Navigation as NavIcon, 
  Footprints, 
  Accessibility, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Compass,
  MapPin,
  Building as BuildingIcon,
  Play,
  RotateCcw
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';

export const MobileNavOverlay: React.FC = () => {
  const { 
    activeRoute, 
    setActiveRoute, 
    isLiveNavActive, 
    setLiveNavActive,
    currentNavStepIndex,
    setCurrentNavStepIndex,
    isArrivalModalOpen,
    setArrivalModalOpen,
    setSelectedBuildingId,
    setSelectedRoom,
    setFloorPlanOpen,
    buildings
  } = useCampusStore();

  const [routeMode, setRouteMode] = useState<'fastest' | 'accessible'>('fastest');

  if (!activeRoute) return null;

  const steps = activeRoute.steps || [];
  const currentStep = steps[currentNavStepIndex] || steps[0] || {
    instruction: `Proceed along campus path to ${activeRoute.toLocation}`,
    distanceMeters: activeRoute.totalDistanceMeters
  };

  const handleStartLiveNav = () => {
    setLiveNavActive(true);
    setCurrentNavStepIndex(0);
  };

  const handleEndNav = () => {
    setLiveNavActive(false);
    setActiveRoute(null);
    setArrivalModalOpen(false);
  };

  const handleNextStep = () => {
    if (currentNavStepIndex < steps.length - 1) {
      setCurrentNavStepIndex(currentNavStepIndex + 1);
    } else {
      setArrivalModalOpen(true);
    }
  };

  const handlePrevStep = () => {
    if (currentNavStepIndex > 0) {
      setCurrentNavStepIndex(currentNavStepIndex - 1);
    }
  };

  const handleModeChange = (mode: 'fastest' | 'accessible') => {
    setRouteMode(mode);
    const newRoute = calculateCampusRoute('node-north-gate', activeRoute.toLocation, mode === 'accessible');
    if (newRoute) setActiveRoute(newRoute);
  };

  const getTurnIcon = (instruction: string) => {
    const text = instruction.toLowerCase();
    if (text.includes('left')) return <div className="text-3xl font-bold text-cyan-400">↰</div>;
    if (text.includes('right')) return <div className="text-3xl font-bold text-cyan-400">↱</div>;
    if (text.includes('arrive') || text.includes('destination')) return <div className="text-3xl font-bold text-emerald-400">🏁</div>;
    return <div className="text-3xl font-bold text-cyan-400">↑</div>;
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* STATE 1: ACTIVE LIVE NAVIGATION MODE (Full-Bleed Map Controls) */}
      {/* ------------------------------------------------------------- */}
      {isLiveNavActive ? (
        <div className="lg:hidden fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-3.5 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.8rem,env(safe-area-inset-bottom))]">
          
          {/* TOP FLOATING DESTINATION & ETA CARD */}
          <div className="w-full bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-4 shadow-2xl border border-slate-800 pointer-events-auto flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
            <button
              type="button"
              onClick={() => setLiveNavActive(false)}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              title="Exit Live Nav"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="font-black text-white text-base tracking-tight truncate">{activeRoute.toLocation}</h3>
              </div>
              <p className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                {activeRoute.totalDistanceMeters} m • ~{activeRoute.estimatedWalkingMinutes} min walk
              </p>
            </div>

            <button
              type="button"
              onClick={handleEndNav}
              className="px-3 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shrink-0 active:scale-95 transition-transform shadow-md"
            >
              END
            </button>
          </div>

          {/* BOTTOM FLOATING TURN INSTRUCTION CARD */}
          <div className="w-full bg-white/98 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-slate-200/90 pointer-events-auto space-y-3 animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Step Direction & Instruction */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-md">
                {getTurnIcon(currentStep.instruction)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Step {currentNavStepIndex + 1} of {steps.length || 1}</span>
                  <span className="font-mono text-cyan-600 font-bold">{currentStep.distanceMeters} m</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5 line-clamp-2">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            {/* Step Navigation Actions */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                disabled={currentNavStepIndex === 0}
                onClick={handlePrevStep}
                className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 text-xs font-extrabold flex items-center gap-1 active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <span>{currentNavStepIndex === steps.length - 1 ? 'ARRIVE AT VENUE' : 'NEXT TURN'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        
        /* ------------------------------------------------------------- */
        /* STATE 2: ROUTE PREVIEW BOTTOM SHEET (Before Starting Navigation) */
        /* ------------------------------------------------------------- */
        <div className="lg:hidden fixed bottom-16 left-3 right-3 z-40 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-full bg-white/98 backdrop-blur-xl rounded-3xl p-4.5 shadow-2xl border border-slate-200/90 space-y-4">
            
            {/* Header Title & Close */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-extrabold uppercase">
                  <NavIcon className="w-3 h-3 text-cyan-600" />
                  Route Preview
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeRoute.toLocation}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeRoute.totalDistanceMeters} m • ~{activeRoute.estimatedWalkingMinutes} min walk from North Gate
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveRoute(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Route Profile Selection (FASTEST vs ACCESSIBLE) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleModeChange('fastest')}
                className={`p-3 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  routeMode === 'fastest'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Footprints className="w-4 h-4 text-cyan-400" />
                  <span>FASTEST</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">{activeRoute.totalDistanceMeters} m • {activeRoute.estimatedWalkingMinutes}m</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('accessible')}
                className={`p-3 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                  routeMode === 'accessible'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Accessibility className="w-4 h-4 text-emerald-400" />
                  <span>ACCESSIBLE</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">Step-free ramp paths</span>
              </button>
            </div>

            {/* Start Live Navigation Button */}
            <button
              type="button"
              onClick={handleStartLiveNav}
              className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START NAVIGATION MODE</span>
            </button>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ARRIVAL EXPERIENCE MODAL */}
      {/* ------------------------------------------------------------- */}
      {isArrivalModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 pointer-events-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Goal Reached
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">YOU'VE ARRIVED!</h3>
              <p className="text-sm font-bold text-slate-700 mt-1">{activeRoute.toLocation}</p>
              <p className="text-xs text-slate-400 mt-0.5">You have completed your campus walking route.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setArrivalModalOpen(false);
                  setFloorPlanOpen(true);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-xs font-extrabold active:scale-95 transition-transform"
              >
                VIEW ROOM
              </button>

              <button
                type="button"
                onClick={handleEndNav}
                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-extrabold hover:bg-slate-200 active:scale-95 transition-transform"
              >
                END
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
