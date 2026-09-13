'use client';

import React, { useState, useMemo } from 'react';
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
  RotateCcw,
  Volume2,
  VolumeX,
  MoreVertical,
  Pause,
  AlertTriangle,
  Layers,
  Sparkles,
  Users,
  Umbrella,
  Zap
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute, calculateAllRouteOptions } from '../../services/navigationService';
import { RouteType } from '../../types/campus';

export const MobileNavOverlay: React.FC = () => {
  const { 
    activeRoute, 
    setActiveRoute, 
    routeType,
    setRouteType,
    isLiveNavActive, 
    setLiveNavActive,
    isNavPaused,
    setNavPaused,
    currentNavStepIndex,
    setCurrentNavStepIndex,
    isArrivalModalOpen,
    setArrivalModalOpen,
    isRouteOverviewOpen,
    setRouteOverviewOpen,
    isPathIssueModalOpen,
    setPathIssueModalOpen,
    reportPathIssue,
    rerouteNavigation,
    voiceEnabled,
    setVoiceEnabled,
    setSelectedBuildingId,
    setSelectedRoom,
    setFloorPlanOpen,
    buildings
  } = useCampusStore();

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [hazardType, setHazardType] = useState('Blocked walkway');
  const [hazardNotes, setHazardNotes] = useState('');

  // Multi-route options for destination preview
  const routeOptions = useMemo(() => {
    if (!activeRoute) return null;
    return calculateAllRouteOptions(activeRoute.fromLocation, activeRoute.toLocation);
  }, [activeRoute?.fromLocation, activeRoute?.toLocation]);

  if (!activeRoute) return null;

  const steps = activeRoute.steps || [];
  const currentStep = steps[currentNavStepIndex] || steps[0] || {
    instruction: `Proceed along campus path to ${activeRoute.toLocation}`,
    distanceMeters: activeRoute.totalDistanceMeters,
    turnType: 'straight'
  };

  const isIndoorStep = Boolean(currentStep.indoorTransition);

  // Handlers
  const handleStartLiveNav = () => {
    setLiveNavActive(true);
    setCurrentNavStepIndex(0);
  };

  const handleEndNav = () => {
    setLiveNavActive(false);
    setActiveRoute(null);
    setArrivalModalOpen(false);
    setShowOptionsMenu(false);
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

  const handleSelectRouteProfile = (type: RouteType) => {
    setRouteType(type);
  };

  const handleReportHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locName = currentStep.landmark || activeRoute.toLocation;
    reportPathIssue(hazardType, locName, hazardNotes);
    setHazardNotes('');
  };

  const getTurnIcon = (turnType?: string) => {
    switch (turnType) {
      case 'left':
      case 'slight_left':
        return <div className="text-3xl font-black text-cyan-400">↰</div>;
      case 'right':
      case 'slight_right':
        return <div className="text-3xl font-black text-cyan-400">↱</div>;
      case 'entrance':
        return <div className="text-2xl">🚪</div>;
      case 'elevator':
        return <div className="text-2xl">🛗</div>;
      case 'stairs':
        return <div className="text-2xl">🪜</div>;
      case 'arrive':
        return <div className="text-2xl">🏁</div>;
      default:
        return <div className="text-3xl font-black text-cyan-400">↑</div>;
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* STATE 1: ACTIVE LIVE NAVIGATION MODE (100dvh Edge-to-Edge)   */}
      {/* ------------------------------------------------------------- */}
      {isLiveNavActive ? (
        <div className="lg:hidden fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          
          {/* TOP FLOATING HUD CARD */}
          <div className="w-full bg-slate-900/98 backdrop-blur-xl text-white rounded-3xl p-3.5 shadow-2xl border border-slate-800 pointer-events-auto flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-200">
            
            {/* Exit / Back Button */}
            <button
              type="button"
              onClick={() => setLiveNavActive(false)}
              className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              title="Exit Navigation"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Destination, Distance & ETA */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <h3 className="font-extrabold text-white text-sm tracking-tight truncate">
                  {activeRoute.toLocation}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 mt-0.5">
                <span>{activeRoute.totalDistanceMeters} m</span>
                <span>•</span>
                <span>~{activeRoute.estimatedWalkingMinutes} min</span>
                {activeRoute.etaText && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-sans font-extrabold">{activeRoute.etaText}</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Voice Mute/Unmute & Options */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center active:scale-95 transition-all ${
                  voiceEnabled ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                }`}
                title={voiceEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center active:scale-95 transition-transform"
                title="Navigation Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ACTIVE NAVIGATION OPTIONS DROPDOWN MODAL */}
          {showOptionsMenu && (
            <div className="fixed inset-0 z-50 pointer-events-auto bg-slate-950/40 backdrop-blur-xs flex flex-col justify-end p-3 animate-in fade-in duration-150">
              <div className="w-full bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">Navigation Options</h4>
                  <button
                    type="button"
                    onClick={() => setShowOptionsMenu(false)}
                    className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNavPaused(!isNavPaused);
                      setShowOptionsMenu(false);
                    }}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 active:scale-95"
                  >
                    {isNavPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-amber-600" />}
                    <span>{isNavPaused ? 'Resume Navigation' : 'Pause Navigation'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRouteOverviewOpen(true);
                      setShowOptionsMenu(false);
                    }}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 active:scale-95"
                  >
                    <NavIcon className="w-4 h-4 text-cyan-600" />
                    <span>Route Steps</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setPathIssueModalOpen(true);
                  }}
                  className="w-full p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Report Path Hazard / Obstacle</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowOptionsMenu(false);
                    rerouteNavigation();
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-600" />
                  <span>Recalculate Route</span>
                </button>

                <button
                  type="button"
                  onClick={handleEndNav}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black active:scale-95 transition-transform"
                >
                  End Navigation
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM FLOATING TURN INSTRUCTION CARD */}
          <div className="w-full bg-white/98 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-slate-200/90 pointer-events-auto space-y-3 animate-in slide-in-from-bottom-4 duration-200">
            
            {/* Step Direction & Primary Text */}
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-md">
                {getTurnIcon(currentStep.turnType)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Step {currentNavStepIndex + 1} of {steps.length || 1}</span>
                  <span className="font-mono text-cyan-700 font-black">{currentStep.distanceMeters} m</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5 line-clamp-2">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            {/* Indoor Multi-Story Transition Banner (When entering building / floor) */}
            {isIndoorStep && currentStep.indoorTransition && (
              <div className="p-2.5 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 text-xs">
                    🏢
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-cyan-950 truncate">
                      {currentStep.indoorTransition.buildingName}
                    </div>
                    <div className="text-[10px] text-cyan-700 font-bold">
                      Floor {currentStep.indoorTransition.floorNumber} • {currentStep.indoorTransition.roomCode || 'Indoor Area'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFloorPlanOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold shrink-0 active:scale-95"
                >
                  Floor Plan
                </button>
              </div>
            )}

            {/* Navigation Stepper Controls */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                disabled={currentNavStepIndex === 0}
                onClick={handlePrevStep}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 text-xs font-extrabold flex items-center gap-1 active:scale-95 transition-transform touch-target-48"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV</span>
              </button>

              <button
                type="button"
                onClick={() => setRouteOverviewOpen(true)}
                className="px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1 active:scale-95 touch-target-48"
                title="View All Steps"
              >
                <span>Steps</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform touch-target-48"
              >
                <span>{currentNavStepIndex === steps.length - 1 ? 'ARRIVE' : 'NEXT TURN'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        
        /* ------------------------------------------------------------- */
        /* STATE 2: DESTINATION PREVIEW & CLEAR ROUTE OPTIONS SHEET     */
        /* ------------------------------------------------------------- */
        <div className="lg:hidden fixed bottom-16 left-3 right-3 z-40 pointer-events-auto animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-full bg-white/98 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-slate-200/90 space-y-3.5">
            
            {/* Header: Destination name & Close */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-extrabold uppercase">
                  <NavIcon className="w-3 h-3 text-cyan-600" />
                  <span>Route Preview</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeRoute.toLocation}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeRoute.totalDistanceMeters} m • ~{activeRoute.estimatedWalkingMinutes} min walk • {activeRoute.etaText || 'On Time'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveRoute(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                title="Close Route"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ROUTE OPTIONS CARDS (Fastest, Accessible, Less Crowded, Covered) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Option 1: Fastest */}
              <button
                type="button"
                onClick={() => handleSelectRouteProfile('fastest')}
                className={`p-2.5 rounded-2xl text-left transition-all active:scale-95 border ${
                  routeType === 'fastest'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Footprints className={`w-3.5 h-3.5 ${routeType === 'fastest' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <span className="text-[11px] font-extrabold">Fastest</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    routeType === 'fastest' ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-200 text-slate-600'
                  }`}>
                    Rec
                  </span>
                </div>
                <div className="text-xs font-mono font-bold mt-1">
                  {routeOptions?.fastest.totalDistanceMeters || 420} m • {routeOptions?.fastest.estimatedWalkingMinutes || 6} min
                </div>
              </button>

              {/* Option 2: Accessible */}
              <button
                type="button"
                onClick={() => handleSelectRouteProfile('accessible')}
                className={`p-2.5 rounded-2xl text-left transition-all active:scale-95 border ${
                  routeType === 'accessible'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Accessibility className={`w-3.5 h-3.5 ${routeType === 'accessible' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className="text-[11px] font-extrabold">♿ Accessible</span>
                </div>
                <div className="text-xs font-mono font-bold mt-1">
                  {routeOptions?.accessible.totalDistanceMeters || 510} m • {routeOptions?.accessible.estimatedWalkingMinutes || 7} min
                </div>
              </button>

              {/* Option 3: Less Crowded */}
              <button
                type="button"
                onClick={() => handleSelectRouteProfile('crowd')}
                className={`p-2.5 rounded-2xl text-left transition-all active:scale-95 border ${
                  routeType === 'crowd'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Users className={`w-3.5 h-3.5 ${routeType === 'crowd' ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span className="text-[11px] font-extrabold">👥 Less Crowded</span>
                </div>
                <div className="text-xs font-mono font-bold mt-1">
                  {routeOptions?.crowd.totalDistanceMeters || 460} m • {routeOptions?.crowd.estimatedWalkingMinutes || 6} min
                </div>
              </button>

              {/* Option 4: Covered / Indoor */}
              <button
                type="button"
                onClick={() => handleSelectRouteProfile('covered')}
                className={`p-2.5 rounded-2xl text-left transition-all active:scale-95 border ${
                  routeType === 'covered'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Umbrella className={`w-3.5 h-3.5 ${routeType === 'covered' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className="text-[11px] font-extrabold">☂ Covered Walk</span>
                </div>
                <div className="text-xs font-mono font-bold mt-1">
                  {routeOptions?.covered.totalDistanceMeters || 540} m • {routeOptions?.covered.estimatedWalkingMinutes || 7} min
                </div>
              </button>
            </div>

            {/* Action Buttons: START and CANCEL */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveRoute(null)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleStartLiveNav}
                className="flex-1 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START NAVIGATION</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STATE 3: ARRIVAL STATE MODAL (✓ YOU HAVE ARRIVED)             */}
      {/* ------------------------------------------------------------- */}
      {isArrivalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-md animate-bounce">
              ✓
            </div>

            <div>
              <div className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                YOU HAVE ARRIVED
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {activeRoute.toLocation}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Computer Science Block • Floor 2 • AI & Data Science Wing
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700 space-y-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trip Distance:</span>
                <span className="font-mono font-bold text-slate-900">{activeRoute.totalDistanceMeters} m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-mono font-bold text-slate-900">~{activeRoute.estimatedWalkingMinutes} min</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setArrivalModalOpen(false);
                  setFloorPlanOpen(true);
                }}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs active:scale-95 transition-transform"
              >
                VIEW ROOM
              </button>

              <button
                type="button"
                onClick={handleEndNav}
                className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs active:scale-95 transition-transform shadow-md"
              >
                END TRIP
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STATE 4: ROUTE OVERVIEW MODAL (Full Waypoint & Turn Checklist) */}
      {/* ------------------------------------------------------------- */}
      {isRouteOverviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex flex-col justify-end lg:hidden pointer-events-auto animate-in fade-in duration-150">
          <div className="w-full bg-white rounded-t-3xl p-4 shadow-2xl border-t border-slate-200 max-h-[80vh] flex flex-col pb-[max(1rem,env(safe-area-inset-bottom))]">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Route Steps & Waypoints</h4>
                <p className="text-[11px] text-slate-500">{activeRoute.totalDistanceMeters} m • ~{activeRoute.estimatedWalkingMinutes} min</p>
              </div>
              <button
                type="button"
                onClick={() => setRouteOverviewOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {steps.map((step, sIdx) => {
                const isCompleted = sIdx < currentNavStepIndex;
                const isCurrent = sIdx === currentNavStepIndex;

                return (
                  <div
                    key={sIdx}
                    onClick={() => {
                      setCurrentNavStepIndex(sIdx);
                      setRouteOverviewOpen(false);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 text-xs ${
                      isCurrent
                        ? 'bg-cyan-50/80 border-cyan-300 font-extrabold text-slate-900 shadow-xs'
                        : isCompleted
                        ? 'bg-slate-50/60 border-slate-100 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs ${
                      isCurrent ? 'bg-cyan-600 text-white' : isCompleted ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {sIdx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="truncate">{step.instruction}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{step.distanceMeters} m</div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-extrabold text-cyan-600 uppercase">Active</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setRouteOverviewOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs active:scale-95 shadow-md mt-2"
            >
              RESUME NAVIGATION
            </button>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STATE 5: PATH HAZARD REPORTING MODAL                          */}
      {/* ------------------------------------------------------------- */}
      {isPathIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 pointer-events-auto">
          <form 
            onSubmit={handleReportHazardSubmit}
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h4 className="font-extrabold text-slate-900 text-sm">Report Path Hazard</h4>
              </div>
              <button
                type="button"
                onClick={() => setPathIssueModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Tag an obstruction along your walking path to alert campus dispatch and reroute other students.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Issue Type</label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none"
              >
                <option value="Blocked walkway">Blocked walkway</option>
                <option value="Construction">Active Construction</option>
                <option value="Flooded path">Flooded path / Water pooling</option>
                <option value="Damaged walkway">Damaged walkway / Broken pavement</option>
                <option value="Locked entrance">Locked building entrance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Optional Notes</label>
              <input
                type="text"
                value={hazardNotes}
                onChange={(e) => setHazardNotes(e.target.value)}
                placeholder="e.g. Scaffolding near entrance"
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPathIssueModalOpen(false)}
                className="py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md"
              >
                Submit Alert
              </button>
            </div>

          </form>
        </div>
      )}

    </>
  );
};
