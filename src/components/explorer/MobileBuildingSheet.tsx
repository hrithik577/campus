'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building as BuildingIcon, 
  MapPin, 
  Navigation, 
  Layers, 
  Wrench, 
  X,
  Thermometer,
  Wifi,
  Cpu,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2
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
  onClose
}) => {
  const router = useRouter();
  const { 
    buildings, 
    selectedBuildingId, 
    setSelectedRoom, 
    setActiveRoute,
    setFloorPlanOpen,
    setReportModalOpen
  } = useCampusStore();

  if (!selectedBuildingId) return null;

  const building = buildings.find(b => b.id === selectedBuildingId);
  if (!building) return null;

  const handleStartNavigation = () => {
    const route = calculateCampusRoute('node-north-gate', building.id);
    setActiveRoute(route);
    onClose();
    router.push('/navigate');
  };

  const handleOpenFloorPlan = () => {
    setFloorPlanOpen(true);
  };

  const handleOpenReport = () => {
    setReportModalOpen(true);
  };

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="half"
    >
      <div className="space-y-4 text-slate-900 pb-4">
        
        {/* Header Title & Status */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 text-white">
                {building.code}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-50 text-cyan-800 border border-cyan-200">
                {building.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {building.status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">{building.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{building.description}</p>
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
            onClick={handleOpenFloorPlan}
            className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-target-48"
          >
            <Layers className="w-4 h-4 text-cyan-700" />
            <span>FLOOR PLAN</span>
          </button>

          <button
            type="button"
            onClick={handleOpenReport}
            className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all touch-target-48"
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>REPORT</span>
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
              <Users className="w-3.5 h-3.5 text-cyan-600" />
              Occupancy
            </div>
            <div className="text-lg font-extrabold text-slate-900">{building.occupancyPercentage}%</div>
            <div className="text-[10px] text-slate-500">{building.currentOccupancy} / {building.capacity} occupants</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Temperature
            </div>
            <div className="text-lg font-extrabold text-slate-900">23.8°C</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Climate Optimal</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              Network State
            </div>
            <div className="text-lg font-extrabold text-slate-900">Good</div>
            <div className="text-[10px] text-slate-500">5G Campus Mesh • 420 Mbps</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
              <Cpu className="w-3.5 h-3.5 text-cyan-600" />
              Equipment
            </div>
            <div className="text-lg font-extrabold text-slate-900">{building.equipmentOperationalPct}%</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Fully Operational</div>
          </div>
        </div>

        {/* Popular Rooms Quick List */}
        <div className="space-y-2 pt-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Featured Rooms & Labs</div>
          <div className="space-y-1.5">
            {building.popularRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setFloorPlanOpen(true);
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between active:scale-[0.98] transition-all touch-target-48 cursor-pointer"
              >
                <div>
                  <div className="font-extrabold text-slate-900 text-xs">{room.code} — {room.name}</div>
                  <div className="text-[11px] text-slate-500">Floor {room.floor} • {room.currentOccupancy}/{room.capacity} occupied</div>
                </div>

                <span className="text-xs font-bold text-cyan-600">View Floor →</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MobileBottomSheet>
  );
};
