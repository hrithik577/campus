'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Navigation, 
  Layers, 
  Wrench, 
  X,
  Clock,
  Users,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';
import { MobileBottomSheet } from '../common/MobileBottomSheet';

interface MobileBuildingSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileBuildingSheet: React.FC<MobileBuildingSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { 
    buildings, 
    selectedBuildingId, 
    setSelectedRoom, 
    setActiveRoute,
    setFloorPlanOpen,
    setReportModalOpen,
    setSelectedBuildingId,
  } = useCampusStore();

  if (!selectedBuildingId) return null;

  const building = buildings.find(b => b.id === selectedBuildingId);
  if (!building) return null;

  // Calculate live distance from route engine
  const quickRoute = calculateCampusRoute('node-north-gate', building.id, 'fastest');
  const distance = quickRoute?.totalDistanceMeters ?? 0;
  const walkMins = quickRoute?.estimatedWalkingMinutes ?? 0;

  const handleDirections = () => {
    const route = calculateCampusRoute('node-north-gate', building.id, 'fastest');
    setActiveRoute(route);
    onClose();
    router.push('/navigate');
  };

  const handleViewFloorPlan = () => {
    setFloorPlanOpen(true);
  };

  const handleReport = () => {
    setReportModalOpen(true);
  };

  const statusColor = building.status === 'available'
    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : building.status === 'crowded'
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-slate-500 bg-slate-50 border-slate-200';

  const crowdColor = building.crowdLevel === 'low'
    ? 'text-emerald-600'
    : building.crowdLevel === 'medium'
    ? 'text-amber-600'
    : 'text-rose-600';

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="half"
    >
      <div className="space-y-0 pb-2">

        {/* ── PLACE HEADER (Google Maps style) ──────────────────────── */}
        <div className="px-4 pt-1 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Category badge */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 text-[9px] font-extrabold uppercase tracking-wide">
                  {building.category}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[9px] font-extrabold uppercase">
                  {building.code}
                </span>
              </div>
              
              {/* Place name */}
              <h2 className="text-xl font-black text-slate-900 leading-tight">{building.name}</h2>
              
              {/* Status + distance */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {building.status.toUpperCase()}
                </span>
                {distance > 0 && (
                  <span className="text-xs text-slate-500 font-medium">
                    {distance} m · {walkMins} min walk
                  </span>
                )}
              </div>
              
              {/* Short description */}
              {building.description && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{building.description}</p>
              )}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 active:scale-95"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── PRIMARY ACTIONS (Google Maps style: Directions, Floor Plan, Report) ── */}
        <div className="px-4 py-3 border-b border-slate-100">
          {/* DIRECTIONS — primary full-width CTA */}
          <button
            type="button"
            onClick={handleDirections}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all mb-2.5"
          >
            <Navigation className="w-5 h-5 fill-white stroke-none" />
            Directions
          </button>

          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleViewFloorPlan}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Layers className="w-4 h-4 text-cyan-600" />
              Floor Plan
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              Report Issue
            </button>
          </div>
        </div>

        {/* ── LIVE TELEMETRY ───────────────────────────────────────── */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">Live Status</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-50 rounded-xl text-center space-y-0.5">
              <div className={`text-base font-black ${crowdColor}`}>{building.occupancyPercentage}%</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">Occupied</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-center space-y-0.5">
              <div className="text-base font-black text-slate-900">{building.capacity}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">Capacity</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl text-center space-y-0.5">
              <div className="text-base font-black text-slate-900">{building.floorsCount}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">Floors</div>
            </div>
          </div>

          {/* Opening hours */}
          <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{building.openingHours}</span>
          </div>
        </div>

        {/* ── FACILITIES ───────────────────────────────────────────── */}
        {building.facilities && building.facilities.length > 0 && (
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Facilities</div>
            <div className="flex flex-wrap gap-1.5">
              {building.facilities.slice(0, 6).map((f, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── POPULAR ROOMS ─────────────────────────────────────────── */}
        {building.popularRooms && building.popularRooms.length > 0 && (
          <div className="px-4 py-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Popular Spaces</div>
            <div className="space-y-1.5">
              {building.popularRooms.slice(0, 3).map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoom(room);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 flex items-center justify-between text-left transition-all active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">{room.code}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        room.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{room.name} · Floor {room.floor} · {room.capacity} seats</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </MobileBottomSheet>
  );
};
