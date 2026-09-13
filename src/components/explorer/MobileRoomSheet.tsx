'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Navigation, 
  Layers, 
  Wrench, 
  X,
  Users,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle
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
  onClose
}) => {
  const router = useRouter();
  const { 
    selectedRoom, 
    setSelectedRoom,
    setActiveRoute,
    setFloorPlanOpen,
    setReportModalOpen
  } = useCampusStore();

  if (!selectedRoom) return null;

  const handleStartNavigation = () => {
    const route = calculateCampusRoute('node-north-gate', selectedRoom.buildingId);
    setActiveRoute(route);
    onClose();
  };

  const handleViewFloor = () => {
    setFloorPlanOpen(true);
    onClose();
  };

  const handleReport = () => {
    setReportModalOpen(true);
  };

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="half"
    >
      <div className="space-y-4 text-slate-900 pb-4">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 text-white">
                {selectedRoom.code}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-50 text-cyan-800 border border-cyan-200">
                Floor {selectedRoom.floor}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                selectedRoom.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  selectedRoom.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                } animate-pulse`} />
                {selectedRoom.status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">{selectedRoom.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{selectedRoom.buildingName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 touch-target-48"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleStartNavigation}
            className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all touch-target-48"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>NAVIGATE</span>
          </button>

          <button
            type="button"
            onClick={handleViewFloor}
            className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-target-48"
          >
            <Layers className="w-4 h-4 text-cyan-700" />
            <span>VIEW FLOOR</span>
          </button>

          <button
            type="button"
            onClick={handleReport}
            className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-target-48"
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>REPORT</span>
          </button>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
              <Users className="w-3.5 h-3.5 text-cyan-600" />
              Occupancy
            </div>
            <div className="text-lg font-extrabold text-slate-900">{selectedRoom.currentOccupancy} / {selectedRoom.capacity}</div>
            <div className="text-[10px] text-slate-500 font-medium">Available Seats</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Equipment Health
            </div>
            <div className="text-lg font-extrabold text-slate-900">87%</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Sensor Calibrated</div>
          </div>
        </div>

        {/* Schedule */}
        {selectedRoom.nextScheduledClass && (
          <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-700" />
              <div>
                <div className="text-[10px] uppercase font-extrabold text-cyan-800">Next Scheduled Class</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedRoom.nextScheduledClass}</div>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Badges */}
        {selectedRoom.equipment.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Available Equipment</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedRoom.equipment.map((eq, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </MobileBottomSheet>
  );
};
