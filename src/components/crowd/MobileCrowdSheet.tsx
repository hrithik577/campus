'use client';

import React from 'react';
import { Activity, Clock, Flame, Users, X, Sparkles } from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { MobileBottomSheet } from '../common/MobileBottomSheet';

interface MobileCrowdSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileCrowdSheet: React.FC<MobileCrowdSheetProps> = ({
  isOpen,
  onClose
}) => {
  const { buildings, setSelectedBuildingId } = useCampusStore();

  const totalOccupancy = Math.round(
    buildings.reduce((acc, b) => acc + b.occupancyPercentage, 0) / buildings.length
  );

  const busyBuildings = [...buildings]
    .sort((a, b) => b.occupancyPercentage - a.occupancyPercentage)
    .slice(0, 4);

  const handleSelectBuilding = (id: string) => {
    setSelectedBuildingId(id);
    onClose();
  };

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="half"
    >
      <div className="space-y-4 text-slate-900 pb-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">CAMPUS PULSE</h2>
              <span className="text-[10px] text-slate-400 font-mono">Live Crowd Density Telemetry</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 touch-target-48"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Activity Gauge Card */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Overall Activity Gauge
            </span>
            <div className="text-3xl font-extrabold text-white">{totalOccupancy}%</div>
            <div className="text-xs text-slate-300 font-medium">Moderate Campus Load</div>
          </div>

          <div className="w-16 h-16 rounded-full border-4 border-cyan-400 flex items-center justify-center text-sm font-black text-cyan-300 bg-slate-800">
            {totalOccupancy}%
          </div>
        </div>

        {/* Busy Locations Breakdown */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">High Crowd Zones (Tap to inspect)</div>
          <div className="space-y-2">
            {busyBuildings.map((b) => (
              <div 
                key={b.id} 
                onClick={() => handleSelectBuilding(b.id)}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/80 space-y-1.5 cursor-pointer touch-target-48 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">{b.name} ({b.code})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    b.occupancyPercentage > 75 ? 'bg-rose-100 text-rose-800' :
                    b.occupancyPercentage > 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {b.occupancyPercentage}% BUSY
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      b.occupancyPercentage > 75 ? 'bg-rose-500' :
                      b.occupancyPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${b.occupancyPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Time To Visit Recommendations */}
        <div className="p-3.5 rounded-2xl bg-cyan-50/80 border border-cyan-200 space-y-2">
          <div className="flex items-center gap-2 text-cyan-900 font-extrabold text-xs">
            <Clock className="w-4 h-4 text-cyan-700" />
            BEST TIME TO VISIT (LOW CROWD)
          </div>

          <div className="space-y-1.5 text-xs text-slate-800 font-medium">
            <div 
              onClick={() => handleSelectBuilding('central-lib')}
              className="flex items-center justify-between p-2 rounded-xl bg-white/70 hover:bg-white cursor-pointer active:scale-95 transition-all touch-target-48"
            >
              <span className="font-semibold text-slate-900">Central Library</span>
              <span className="font-bold text-cyan-900">2:00 PM – 4:00 PM →</span>
            </div>
            <div 
              onClick={() => handleSelectBuilding('cafeteria-north')}
              className="flex items-center justify-between p-2 rounded-xl bg-white/70 hover:bg-white cursor-pointer active:scale-95 transition-all touch-target-48"
            >
              <span className="font-semibold text-slate-900">North Campus Cafe</span>
              <span className="font-bold text-cyan-900">10:30 AM – 11:45 AM →</span>
            </div>
          </div>
        </div>

      </div>
    </MobileBottomSheet>
  );
};
