'use client';

import React from 'react';
import { Users, Clock, Flame, ShieldAlert, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';

export const CrowdIntelligenceView: React.FC = () => {
  const { buildings } = useCampusStore();

  const highCrowdBuildings = buildings.filter(b => b.crowdLevel === 'high');
  const mediumCrowdBuildings = buildings.filter(b => b.crowdLevel === 'medium');
  const lowCrowdBuildings = buildings.filter(b => b.crowdLevel === 'low');

  const totalOccupancy = Math.round(
    buildings.reduce((acc, b) => acc + b.occupancyPercentage, 0) / buildings.length
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              REAL-TIME INTELLIGENCE
            </span>
            <span className="text-xs text-slate-400 font-mono">• Updated live</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Campus Crowd & Density Center</h2>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <TrendingUp className="w-6 h-6 text-cyan-600" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Overall Campus Load</div>
            <div className="text-xl font-extrabold text-slate-900">{totalOccupancy}% Activity</div>
          </div>
        </div>
      </div>

      {/* Crowd Level Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* High Crowd */}
        <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-rose-950 text-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              High Crowd Zone
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
              {highCrowdBuildings.length} Locations
            </span>
          </div>

          <div className="space-y-2">
            {highCrowdBuildings.map(b => (
              <div key={b.id} className="p-2.5 rounded-lg bg-white border border-rose-200/60 shadow-2xs flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{b.name}</div>
                  <div className="text-[11px] text-slate-500">{b.currentOccupancy} / {b.capacity} people</div>
                </div>
                <span className="font-extrabold text-rose-600">{b.occupancyPercentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medium Crowd */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              Moderate Crowd Zone
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {mediumCrowdBuildings.length} Locations
            </span>
          </div>

          <div className="space-y-2">
            {mediumCrowdBuildings.map(b => (
              <div key={b.id} className="p-2.5 rounded-lg bg-white border border-amber-200/60 shadow-2xs flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{b.name}</div>
                  <div className="text-[11px] text-slate-500">{b.currentOccupancy} / {b.capacity} people</div>
                </div>
                <span className="font-extrabold text-amber-600">{b.occupancyPercentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Crowd */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Quiet / Low Crowd
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {lowCrowdBuildings.length} Locations
            </span>
          </div>

          <div className="space-y-2">
            {lowCrowdBuildings.map(b => (
              <div key={b.id} className="p-2.5 rounded-lg bg-white border border-emerald-200/60 shadow-2xs flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{b.name}</div>
                  <div className="text-[11px] text-slate-500">{b.currentOccupancy} / {b.capacity} people</div>
                </div>
                <span className="font-extrabold text-emerald-600">{b.occupancyPercentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Best Time to Visit Recommendations */}
      <div className="pt-2">
        <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          Optimal Visit Scheduler (&quot;Best Time to Visit&quot;)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">Central Library</div>
              <div className="text-cyan-700 font-semibold mt-0.5">Recommended Visit: 02:00 PM – 04:00 PM</div>
              <p className="text-slate-500 text-[11px] mt-1">
                Post-lunch hours see 40% reduction in quiet study hall occupancy.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">Central Cafeteria</div>
              <div className="text-cyan-700 font-semibold mt-0.5">Recommended Visit: 03:30 PM – 05:00 PM</div>
              <p className="text-slate-500 text-[11px] mt-1">
                Avoid peak 01:00 PM - 02:30 PM lunch rush. Afternoon tea slot has minimal queue times.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
