'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';
import { Calendar, MapPin, Clock, Navigation } from 'lucide-react';

export default function EventsPage() {
  const router = useRouter();
  const { events, setActiveRoute } = useCampusStore();

  const handleNavigateToEvent = (buildingId: string) => {
    const route = calculateCampusRoute('node-north-gate', buildingId, 'fastest');
    if (route) setActiveRoute(route);
    router.push('/navigate');
  };

  const todayEvents = events.slice(0, 2);
  const upcomingEvents = events.slice(2);

  return (
    <div className="space-y-4 max-w-5xl mx-auto py-2 px-3.5 sm:px-0 pb-20 lg:pb-0">
      
      {/* Header Banner (Desktop Only) */}
      <div className="hidden lg:flex p-5 sm:p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              CAMPUS SCHEDULE
            </span>
            <span className="text-xs text-slate-400 font-mono">• Venue Mapping</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">Campus Events &amp; Keynotes</h1>
          <p className="text-xs text-slate-300 mt-1">
            Discover hackathons, academic keynotes, &amp; sports tournaments mapped to campus venues.
          </p>
        </div>
      </div>

      {/* TODAY SECTION */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">TODAY</h2>
        </div>

        <div className="space-y-3">
          {todayEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-cyan-50 text-cyan-800 border border-cyan-200">
                  {evt.category}
                </span>
                <span className="text-xs font-bold text-cyan-600 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {evt.time}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{evt.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span className="truncate">{evt.buildingName} ({evt.roomCode})</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigateToEvent(evt.buildingId)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 shrink-0 touch-target-48 active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NAVIGATE</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING SECTION */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">UPCOMING</h2>

        <div className="space-y-3">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                  {evt.category}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {evt.date} • {evt.time}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{evt.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.buildingName} ({evt.roomCode})</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigateToEvent(evt.buildingId)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 shrink-0 touch-target-48 active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NAVIGATE</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
