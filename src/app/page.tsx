'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Activity, 
  Layers, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  Bot,
  Zap,
  Building as BuildingIcon,
  CheckCircle2,
  Eye,
  TrendingUp,
  Sliders,
  Radio,
  Clock,
  Compass
} from 'lucide-react';
import { CampusMap } from '../components/map/CampusMap';
import { useCampusStore } from '../services/campusStore';

export default function LandingPage() {
  const { setAiAssistantOpen } = useCampusStore();

  return (
    <div className="space-y-10 sm:space-y-24 py-3 sm:py-10 px-4 sm:px-0 pb-16 lg:pb-0">
      
      {/* --- HERO & LIVING SPATIAL VISUALIZATION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        
        {/* Hero Content */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[10px] sm:text-[11px]">SPATIAL DIGITAL TWIN OS</span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
              CAMPUS<span className="text-cyan-600">TWIN</span>
            </h1>
            <p className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-800">
              Your campus. Digitally alive.
            </p>
          </div>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
            Explore spaces, navigate intelligently and understand campus activity through one living digital twin.
          </p>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 pt-1">
            <Link
              href="/explore"
              className="min-h-[48px] px-4 py-3 rounded-2xl sm:rounded-xl bg-slate-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-cyan-600 transition-all shadow-md group touch-target-48 active:scale-95"
            >
              <MapPin className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
              <span>EXPLORE CAMPUS</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setAiAssistantOpen(true)}
              className="min-h-[48px] px-4 py-3 rounded-2xl sm:rounded-xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-2xs touch-target-48 active:scale-95"
            >
              <Bot className="w-4 h-4 text-cyan-600" />
              <span>ASK CAMPUS AI</span>
            </button>
          </div>
        </div>

        {/* Hero Visual - Living Spatial Map */}
        <div className="lg:col-span-6 h-[320px] sm:h-[480px] w-full relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-slate-900/5 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
          <div className="relative w-full h-full rounded-3xl sm:rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden bg-white animate-[mapBreathe_8s_easeInOut_infinite]">
            <CampusMap highlightBuildingId="cs-block" />
            
            {/* Live Telemetry Overlay Pill */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-[10px] sm:text-xs font-bold text-slate-800 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              SPATIAL TELEMETRY STREAM • LIVE
            </div>
          </div>
        </div>

      </div>

      {/* --- CAMPUS LIVE TELEMETRY COUNTERS --- */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-bold">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            CAMPUS LIVE METRICS
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            REAL-TIME
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400">68%</div>
            <div className="text-[10px] sm:text-xs text-slate-300 font-extrabold uppercase">Campus Activity</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">24</div>
            <div className="text-[10px] sm:text-xs text-slate-300 font-extrabold uppercase">Buildings</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">186</div>
            <div className="text-[10px] sm:text-xs text-slate-300 font-extrabold uppercase">Facilities</div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">7</div>
            <div className="text-[10px] sm:text-xs text-slate-300 font-extrabold uppercase">Open Issues</div>
          </div>
        </div>
      </div>

      {/* --- THREE CORE CAPABILITIES --- */}
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">INTELLIGENCE PLATFORM</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">One campus. One digital intelligence layer.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-cyan-300 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">SPATIAL</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand every building, room, lab, and facility with multi-floor architectural blueprints.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-cyan-300 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">REAL-TIME</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              See live operational status, cafeteria crowds, equipment health, and quiet study zone occupancy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-cyan-300 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">INTELLIGENT</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask Campus AI natural questions, pinpoint locations instantly, and start turn-by-turn navigation.
            </p>
          </div>
        </div>
      </div>

      {/* --- FINAL CTA --- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white text-center space-y-4 sm:space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Step into the digital campus.</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Experience spatial digital twin technology deployed for Amity University.
        </p>

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg active:scale-95"
        >
          <span>Explore Campus Twin OS</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
