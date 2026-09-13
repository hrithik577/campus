'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Navigation as NavIcon, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Volume2,
  VolumeX,
  MoreVertical,
  Pause,
  Play,
  AlertTriangle,
  RotateCcw,
  Clock,
  Building2,
  Layers,
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateAllRouteOptions } from '../../services/navigationService';
import { RouteType } from '../../types/campus';

// ─── Turn icon helper ──────────────────────────────────────────────────────────
function TurnIcon({ turnType, size = 'lg' }: { turnType?: string; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-3xl' : 'text-xl';
  switch (turnType) {
    case 'left':
    case 'slight_left':
      return <span className={`${cls} font-black text-cyan-400 leading-none`}>↰</span>;
    case 'right':
    case 'slight_right':
      return <span className={`${cls} font-black text-cyan-400 leading-none`}>↱</span>;
    case 'entrance':
      return <span className={size === 'lg' ? 'text-2xl' : 'text-lg'}>🚪</span>;
    case 'elevator':
      return <span className={size === 'lg' ? 'text-2xl' : 'text-lg'}>🛗</span>;
    case 'stairs':
      return <span className={size === 'lg' ? 'text-2xl' : 'text-lg'}>🪜</span>;
    case 'arrive':
      return <span className={size === 'lg' ? 'text-2xl' : 'text-lg'}>🏁</span>;
    default:
      return <span className={`${cls} font-black text-cyan-400 leading-none`}>↑</span>;
  }
}

// ─── ETA calculator ────────────────────────────────────────────────────────────
function calcETA(distanceMeters: number): string {
  const mins = Math.max(1, Math.round(distanceMeters / 75));
  const d = new Date(Date.now() + mins * 60 * 1000);
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = d.getHours() >= 12 ? 'PM' : 'AM';
  return `${h}:${m} ${ap}`;
}

// ─── Route option card ─────────────────────────────────────────────────────────
interface RouteCardProps {
  type: RouteType;
  label: string;
  emoji: string;
  badge?: string;
  distanceM: number;
  minutes: number;
  selected: boolean;
  onClick: () => void;
}

function RouteCard({ type, label, emoji, badge, distanceM, minutes, selected, onClick }: RouteCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-2xl text-left transition-all active:scale-95 border-2 relative ${
        selected
          ? 'bg-slate-900 text-white border-cyan-500 shadow-lg shadow-cyan-500/20'
          : 'bg-white hover:bg-slate-50 text-slate-800 border-transparent shadow-sm'
      }`}
    >
      {badge && (
        <span className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
          selected ? 'bg-cyan-500 text-white' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {badge}
        </span>
      )}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-base">{emoji}</span>
        <span className="text-[11px] font-extrabold">{label}</span>
      </div>
      <div className={`text-xs font-mono font-bold ${selected ? 'text-cyan-300' : 'text-slate-500'}`}>
        {distanceM} m · {minutes} min
      </div>
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
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
    setFloorPlanOpen,
    remainingDistanceMeters,
    navPhase,
    tickSimulation,
    advanceToNextStep,
    followMode,
    setFollowMode,
  } = useCampusStore();

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [hazardType, setHazardType] = useState('Blocked walkway');
  const [hazardNotes, setHazardNotes] = useState('');
  const [showApproachingBanner, setShowApproachingBanner] = useState(false);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Route options (Dijkstra multi-route) ───────────────────────────────────
  const routeOptions = useMemo(() => {
    if (!activeRoute) return null;
    return calculateAllRouteOptions(activeRoute.fromLocation, activeRoute.toLocation);
  }, [activeRoute?.fromLocation, activeRoute?.toLocation]); // eslint-disable-line

  // ── Live simulation timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (isLiveNavActive && !isNavPaused) {
      // Tick every 1.8s to decrement distance
      simIntervalRef.current = setInterval(() => {
        tickSimulation();
      }, 1800);

      // Auto-advance step every 14 seconds (simulates walking)
      stepTimerRef.current = setInterval(() => {
        advanceToNextStep();
      }, 14000);
    } else {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    }

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isLiveNavActive, isNavPaused, tickSimulation, advanceToNextStep]);

  // ── Approaching-turn banner ────────────────────────────────────────────────
  useEffect(() => {
    if (activeRoute && remainingDistanceMeters <= 40 && remainingDistanceMeters > 0) {
      setShowApproachingBanner(true);
      const t = setTimeout(() => setShowApproachingBanner(false), 4000);
      return () => clearTimeout(t);
    }
  }, [remainingDistanceMeters, activeRoute]);

  if (!activeRoute) return null;

  const steps = activeRoute.steps || [];
  const currentStep = steps[currentNavStepIndex] || steps[0] || {
    instruction: `Proceed to ${activeRoute.toLocation}`,
    distanceMeters: activeRoute.totalDistanceMeters,
    turnType: 'straight' as const,
  };
  const nextStep = steps[currentNavStepIndex + 1] || null;
  const isIndoorStep = Boolean(currentStep.indoorTransition);
  const isLastStep = currentNavStepIndex >= steps.length - 1;
  const liveDistance = isLiveNavActive ? Math.max(0, remainingDistanceMeters) : activeRoute.totalDistanceMeters;
  const liveMins = Math.max(1, Math.round(liveDistance / 75));
  const liveETA = calcETA(liveDistance);
  const progressPct = activeRoute.totalDistanceMeters > 0
    ? Math.round(((activeRoute.totalDistanceMeters - liveDistance) / activeRoute.totalDistanceMeters) * 100)
    : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStartLiveNav = () => {
    setLiveNavActive(true);
    setCurrentNavStepIndex(0);
  };

  const handleEndNav = () => {
    setLiveNavActive(false);
    setActiveRoute(null);
    setArrivalModalOpen(false);
    setShowOptionsMenu(false);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
  };

  const handleNextStep = () => {
    if (isLastStep) {
      setArrivalModalOpen(true);
    } else {
      advanceToNextStep();
    }
  };

  const handlePrevStep = () => {
    if (currentNavStepIndex > 0) {
      setCurrentNavStepIndex(currentNavStepIndex - 1);
    }
  };

  const handleReportHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locName = currentStep.landmark || activeRoute.toLocation;
    reportPathIssue(hazardType, locName, hazardNotes);
    setHazardNotes('');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIVE NAVIGATION MODE
  // ─────────────────────────────────────────────────────────────────────────────
  if (isLiveNavActive) {
    return (
      <>
        {/* ACTIVE LIVE NAV HUD — pointer-events-none wrapper so map is tappable */}
        <div className="lg:hidden fixed inset-0 z-40 pointer-events-none flex flex-col justify-between"
          style={{
            paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
          }}
        >
          {/* ── TOP HUD ─────────────────────────────────────────────────── */}
          <div className="pointer-events-auto space-y-2">
            <div className="w-full bg-slate-900/97 backdrop-blur-xl text-white rounded-3xl shadow-2xl border border-slate-700/60 flex items-center gap-3 px-3.5 py-3">
              {/* Back button */}
              <button
                type="button"
                onClick={() => setLiveNavActive(false)}
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                aria-label="Exit Navigation"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Destination + metrics */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="font-extrabold text-white text-sm tracking-tight truncate">
                    {activeRoute.toLocation}
                  </span>
                  {navPhase === 'indoor' && (
                    <span className="text-[9px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded-full shrink-0">INDOOR</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs font-mono font-bold text-cyan-300">
                  <span>{liveDistance} m</span>
                  <span>·</span>
                  <span>{liveMins} min</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-sans">{liveETA}</span>
                </div>
                {/* Progress bar */}
                <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Voice + Options */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center active:scale-95 transition-all ${
                    voiceEnabled ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-500'
                  }`}
                  aria-label={voiceEnabled ? 'Mute voice' : 'Enable voice'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOptionsMenu(true)}
                  className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Navigation options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Approaching-turn alert banner */}
            {showApproachingBanner && nextStep && (
              <div className="pointer-events-auto w-full bg-amber-500 text-slate-900 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
                <span className="text-xl">⚠️</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black uppercase">Approaching</div>
                  <div className="text-[11px] font-bold truncate">{nextStep.instruction}</div>
                </div>
                <span className="font-mono font-black text-sm">{liveDistance}m</span>
              </div>
            )}

            {/* Paused banner */}
            {isNavPaused && (
              <div className="pointer-events-auto w-full bg-amber-100 border border-amber-300 text-amber-900 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow">
                <div className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  <span className="text-xs font-black">Navigation Paused</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNavPaused(false)}
                  className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-black active:scale-95"
                >
                  Resume
                </button>
              </div>
            )}
          </div>

          {/* ── SPACER (map area) ──────────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── MAP CONTROLS ─────────────────────────────────────────── */}
          <div className="self-end mb-3 flex flex-col gap-2 pointer-events-auto">
            {!followMode && (
              <button
                type="button"
                onClick={() => setFollowMode(true)}
                className="bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200 px-3 py-2 text-xs font-extrabold flex items-center gap-1.5 active:scale-95 animate-in slide-in-from-right-2"
              >
                <NavIcon className="w-3.5 h-3.5 text-cyan-600" />
                Recenter
              </button>
            )}
          </div>

          {/* ── BOTTOM TURN INSTRUCTION CARD ─────────────────────────── */}
          <div className="pointer-events-auto w-full bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
            {/* Indoor transition banner */}
            {isIndoorStep && currentStep.indoorTransition && (
              <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider opacity-80">Indoor Navigation</div>
                    <div className="text-xs font-extrabold">
                      {currentStep.indoorTransition.buildingName} · Floor {currentStep.indoorTransition.floorNumber}
                      {currentStep.indoorTransition.roomCode && ` · ${currentStep.indoorTransition.roomCode}`}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFloorPlanOpen(true)}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-[11px] font-bold shrink-0 active:scale-95"
                >
                  Floor Plan
                </button>
              </div>
            )}

            <div className="p-4 space-y-3">
              {/* Primary instruction */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-md">
                  <TurnIcon turnType={currentStep.turnType} size="lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <span>Step {currentNavStepIndex + 1} of {steps.length}</span>
                    <span className="font-mono text-cyan-700 font-black text-xs">
                      {liveDistance > 0 ? `${liveDistance}m` : currentStep.distanceMeters > 0 ? `${currentStep.distanceMeters}m` : ''}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5 line-clamp-2">
                    {currentStep.instruction}
                  </p>
                  {currentStep.landmark && (
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{currentStep.landmark}</p>
                  )}
                </div>
              </div>

              {/* Next step preview */}
              {nextStep && (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-extrabold uppercase shrink-0">Then</span>
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    <TurnIcon turnType={nextStep.turnType} size="sm" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 truncate">{nextStep.instruction}</span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{nextStep.distanceMeters}m</span>
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentNavStepIndex === 0}
                  onClick={handlePrevStep}
                  className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setRouteOverviewOpen(true)}
                  className="px-3 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1 active:scale-95"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Steps
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`flex-1 h-11 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
                    isLastStep
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                  aria-label={isLastStep ? 'Arrive' : 'Next turn'}
                >
                  <span>{isLastStep ? '🏁 ARRIVE' : 'NEXT TURN'}</span>
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── OPTIONS MENU ────────────────────────────────────────────────────── */}
        {showOptionsMenu && (
          <div className="fixed inset-0 z-50 pointer-events-auto bg-slate-950/50 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-150 lg:hidden">
            <div
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
              className="w-full bg-white rounded-t-3xl p-4 shadow-2xl space-y-2"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-extrabold text-slate-900">Navigation Options</h4>
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
                  onClick={() => { setNavPaused(!isNavPaused); setShowOptionsMenu(false); }}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 active:scale-95"
                >
                  {isNavPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-amber-600" />}
                  {isNavPaused ? 'Resume' : 'Pause'}
                </button>

                <button
                  type="button"
                  onClick={() => { setRouteOverviewOpen(true); setShowOptionsMenu(false); }}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 active:scale-95"
                >
                  <NavIcon className="w-4 h-4 text-cyan-600" />
                  Route Steps
                </button>

                <button
                  type="button"
                  onClick={() => { setVoiceEnabled(!voiceEnabled); }}
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 active:scale-95 ${
                    voiceEnabled ? 'bg-cyan-50 border border-cyan-200 text-cyan-900' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4" />}
                  Voice {voiceEnabled ? 'On' : 'Off'}
                </button>

                <button
                  type="button"
                  onClick={() => { rerouteNavigation(); setShowOptionsMenu(false); }}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-indigo-600" />
                  Recalculate
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setShowOptionsMenu(false); setPathIssueModalOpen(true); }}
                className="w-full p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 active:scale-95"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Report Path Hazard
              </button>

              <button
                type="button"
                onClick={handleEndNav}
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm active:scale-95 transition-transform shadow-md"
              >
                End Navigation
              </button>
            </div>
          </div>
        )}

        {/* ── ROUTE OVERVIEW MODAL ─────────────────────────────────────────────── */}
        {isRouteOverviewOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex flex-col justify-end lg:hidden pointer-events-auto animate-in fade-in duration-150">
            <div
              style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
              className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[80vh] flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-100 shrink-0">
                <div>
                  <h4 className="font-extrabold text-slate-900">Route Overview</h4>
                  <p className="text-[11px] text-slate-500">{activeRoute.totalDistanceMeters} m · ~{activeRoute.estimatedWalkingMinutes} min · {liveETA}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRouteOverviewOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Progress summary */}
                <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-cyan-900">Progress</span>
                  <span className="font-extrabold text-cyan-700">{progressPct}% complete</span>
                </div>

                {steps.map((step, sIdx) => {
                  const isCompleted = sIdx < currentNavStepIndex;
                  const isCurrent = sIdx === currentNavStepIndex;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => { setCurrentNavStepIndex(sIdx); setRouteOverviewOpen(false); }}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center gap-3 text-xs text-left ${
                        isCurrent
                          ? 'bg-cyan-50 border-cyan-300 shadow-sm'
                          : isCompleted
                          ? 'bg-slate-50/50 border-slate-100 opacity-60'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs ${
                        isCurrent ? 'bg-cyan-600 text-white' : isCompleted ? 'bg-slate-300 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isCompleted ? '✓' : sIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`truncate font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>{step.instruction}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{step.distanceMeters} m</div>
                      </div>
                      {isCurrent && <span className="text-[10px] font-extrabold text-cyan-600 shrink-0">● Active</span>}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setRouteOverviewOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm active:scale-95 shadow-md"
                >
                  Resume Navigation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ARRIVAL MODAL ─────────────────────────────────────────────────────── */}
        {isArrivalModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 pointer-events-auto lg:hidden">
            <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 mx-auto flex items-center justify-center text-4xl shadow-xl animate-bounce">
                ✓
              </div>
              <div>
                <div className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">You Have Arrived</div>
                <h3 className="text-xl font-black text-slate-900 mt-1">{activeRoute.toLocation}</h3>
                {steps[steps.length - 1]?.indoorTransition && (
                  <p className="text-xs text-slate-500 mt-1">
                    {steps[steps.length - 1].indoorTransition!.buildingName} · Floor {steps[steps.length - 1].indoorTransition!.floorNumber}
                    {steps[steps.length - 1].indoorTransition!.roomCode && ` · ${steps[steps.length - 1].indoorTransition!.roomCode}`}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance</span>
                  <span className="font-mono font-bold">{activeRoute.totalDistanceMeters} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Walk time</span>
                  <span className="font-mono font-bold">~{activeRoute.estimatedWalkingMinutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route type</span>
                  <span className="font-bold capitalize">{activeRoute.routeType || 'fastest'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setArrivalModalOpen(false); setFloorPlanOpen(true); }}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs active:scale-95 transition-transform"
                >
                  View Room
                </button>
                <button
                  type="button"
                  onClick={handleEndNav}
                  className="py-3 rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs active:scale-95 transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PATH HAZARD MODAL ──────────────────────────────────────────────────── */}
        {isPathIssueModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 pointer-events-auto lg:hidden">
            <form
              onSubmit={handleReportHazardSubmit}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h4 className="font-extrabold text-slate-900">Report Path Hazard</h4>
                </div>
                <button type="button" onClick={() => setPathIssueModalOpen(false)} className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Tag an obstruction along your path to alert campus operations and reroute other students.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Issue Type</label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="Blocked walkway">Blocked walkway</option>
                  <option value="Construction">Active construction</option>
                  <option value="Flooded path">Flooded path</option>
                  <option value="Damaged walkway">Damaged walkway</option>
                  <option value="Locked entrance">Locked entrance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Notes (optional)</label>
                <input
                  type="text"
                  value={hazardNotes}
                  onChange={(e) => setHazardNotes(e.target.value)}
                  placeholder="e.g. Scaffolding near CS Block entrance"
                  className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setPathIssueModalOpen(false)} className="py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Cancel</button>
                <button type="submit" className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md">Submit Alert</button>
              </div>
            </form>
          </div>
        )}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DESTINATION PREVIEW + ROUTE SELECTION (not yet started)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="lg:hidden fixed left-3 right-3 z-40 pointer-events-auto animate-in slide-in-from-bottom-4 duration-250"
        style={{ bottom: 'max(4.5rem, calc(env(safe-area-inset-bottom) + 4rem))' }}
      >
        <div className="w-full bg-white/99 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">

          {/* ── DESTINATION HEADER ─────────────────────────────────────── */}
          <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-slate-100">
            <div className="min-w-0 flex-1">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 text-[9px] font-extrabold uppercase tracking-wider mb-1.5">
                <NavIcon className="w-2.5 h-2.5" />
                Route Preview
              </div>
              <h3 className="text-base font-black text-slate-900 leading-tight truncate">{activeRoute.toLocation}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                <Clock className="w-3 h-3" />
                <span>{activeRoute.estimatedWalkingMinutes} min walk</span>
                <span>·</span>
                <span>{activeRoute.totalDistanceMeters} m</span>
                <span>·</span>
                <span className="text-emerald-600 font-bold">{activeRoute.etaText || calcETA(activeRoute.totalDistanceMeters)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveRoute(null)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── ROUTE OPTIONS ──────────────────────────────────────────── */}
          <div className="px-4 py-3 space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Choose Route</div>
            <div className="grid grid-cols-2 gap-2">
              <RouteCard
                type="fastest"
                emoji="⚡"
                label="Fastest"
                badge="Rec."
                distanceM={routeOptions?.fastest.totalDistanceMeters ?? activeRoute.totalDistanceMeters}
                minutes={routeOptions?.fastest.estimatedWalkingMinutes ?? activeRoute.estimatedWalkingMinutes}
                selected={routeType === 'fastest'}
                onClick={() => setRouteType('fastest')}
              />
              <RouteCard
                type="accessible"
                emoji="♿"
                label="Accessible"
                distanceM={routeOptions?.accessible.totalDistanceMeters ?? Math.round(activeRoute.totalDistanceMeters * 1.15)}
                minutes={routeOptions?.accessible.estimatedWalkingMinutes ?? Math.ceil(activeRoute.estimatedWalkingMinutes * 1.15)}
                selected={routeType === 'accessible'}
                onClick={() => setRouteType('accessible')}
              />
              <RouteCard
                type="crowd"
                emoji="👥"
                label="Less Crowded"
                distanceM={routeOptions?.crowd.totalDistanceMeters ?? Math.round(activeRoute.totalDistanceMeters * 1.08)}
                minutes={routeOptions?.crowd.estimatedWalkingMinutes ?? Math.ceil(activeRoute.estimatedWalkingMinutes * 1.08)}
                selected={routeType === 'crowd'}
                onClick={() => setRouteType('crowd')}
              />
              <RouteCard
                type="covered"
                emoji="☂"
                label="Covered Walk"
                distanceM={routeOptions?.covered.totalDistanceMeters ?? Math.round(activeRoute.totalDistanceMeters * 1.22)}
                minutes={routeOptions?.covered.estimatedWalkingMinutes ?? Math.ceil(activeRoute.estimatedWalkingMinutes * 1.22)}
                selected={routeType === 'covered'}
                onClick={() => setRouteType('covered')}
              />
            </div>
          </div>

          {/* ── START BUTTON ───────────────────────────────────────────── */}
          <div className="px-4 pb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveRoute(null)}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 transition-transform"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartLiveNav}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white stroke-none" />
              Start Navigation
            </button>
          </div>
        </div>
      </div>

      {/* Route overview, path issue modals (also visible in preview mode) */}
      {isRouteOverviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex flex-col justify-end lg:hidden pointer-events-auto animate-in fade-in duration-150">
          <div
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
            className="w-full bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[75vh] flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-slate-100 shrink-0">
              <h4 className="font-extrabold text-slate-900">Route Steps</h4>
              <button type="button" onClick={() => setRouteOverviewOpen(false)} className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {steps.map((step, sIdx) => (
                <div key={sIdx} className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">{sIdx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{step.instruction}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{step.distanceMeters} m</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 shrink-0">
              <button type="button" onClick={() => setRouteOverviewOpen(false)} className="w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs active:scale-95">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
