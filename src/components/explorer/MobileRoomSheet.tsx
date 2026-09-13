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
  ChevronLeft,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';
import { MobileBottomSheet } from '../common/MobileBottomSheet';

interface MobileRoomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileRoomSheet: React.FC<MobileRoomSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { 
    selectedRoom, 
    setSelectedRoom,
    setActiveRoute,
    setFloorPlanOpen,
    setReportModalOpen,
    selectedBuildingId,
    setSelectedBuildingId,
    buildings,
  } = useCampusStore();

  if (!selectedRoom) return null;

  const building = buildings.find(b => b.id === selectedRoom.buildingId);
  const quickRoute = calculateCampusRoute('node-north-gate', selectedRoom.buildingId, 'fastest');
  const distance = quickRoute?.totalDistanceMeters ?? 0;
  const walkMins = quickRoute?.estimatedWalkingMinutes ?? 0;

  const handleDirections = () => {
    const route = calculateCampusRoute('node-north-gate', selectedRoom.buildingId, 'fastest');
    setActiveRoute(route);
    onClose();
    router.push('/navigate');
  };

  const handleViewFloor = () => {
    setFloorPlanOpen(true);
  };

  const handleReport = () => {
    setReportModalOpen(true);
  };

  const handleBackToBuilding = () => {
    setSelectedRoom(null);
    if (selectedRoom.buildingId) {
      setSelectedBuildingId(selectedRoom.buildingId);
    }
  };

  const statusOk = selectedRoom.status === 'available';

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="half"
    >
      <div className="space-y-0 pb-2">

        {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
        <div className="px-4 pt-1 pb-3 border-b border-slate-100">
          <button
            type="button"
            onClick={handleBackToBuilding}
            className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-800 mb-2 active:scale-95"
          >
            <ChevronLeft className="w-3 h-3" />
            {building?.name || 'Building'}
          </button>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Room badges */}
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[9px] font-extrabold uppercase">
                  {selectedRoom.code}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 text-[9px] font-extrabold uppercase">
                  Floor {selectedRoom.floor}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border inline-flex items-center gap-1 ${
                  statusOk
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {selectedRoom.status.toUpperCase()}
                </span>
              </div>

              {/* Room name */}
              <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedRoom.name}</h2>
              
              {/* Building + distance */}
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {building?.name} · Floor {selectedRoom.floor}
                {distance > 0 && <> · {distance} m · {walkMins} min walk</>}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── PRIMARY DIRECTIONS CTA ────────────────────────────────── */}
        <div className="px-4 py-3 border-b border-slate-100">
          <button
            type="button"
            onClick={handleDirections}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all mb-2.5"
          >
            <Navigation className="w-5 h-5 fill-white stroke-none" />
            Directions to {selectedRoom.code}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleViewFloor}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Layers className="w-4 h-4 text-cyan-600" />
              Floor Plan
            </button>
            <button
              type="button"
              onClick={handleReport}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Wrench className="w-4 h-4 text-amber-500" />
              Report Issue
            </button>
          </div>
        </div>

        {/* ── ROOM DETAILS ─────────────────────────────────────────── */}
        <div className="px-4 py-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">Room Details</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
              <div className="text-xs font-black text-slate-900">{selectedRoom.capacity} seats</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">Capacity</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
              <div className="text-xs font-black text-slate-900 capitalize">{selectedRoom.type}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">Type</div>
            </div>
          </div>

          {/* Equipment list */}
          {selectedRoom.equipment && selectedRoom.equipment.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Equipment</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.equipment.map((eq, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                    <Cpu className="w-2.5 h-2.5 text-cyan-600" />
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Accessible badge */}
          {selectedRoom.isAccessible && (
            <div className="mt-3 p-2.5 bg-cyan-50 rounded-xl border border-cyan-200">
              <div className="flex items-center gap-1.5 text-cyan-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-extrabold uppercase">Accessible Room</span>
              </div>
              <p className="text-[10px] text-cyan-700 mt-0.5">This room is wheelchair accessible.</p>
            </div>
          )}
        </div>

      </div>
    </MobileBottomSheet>
  );
};
