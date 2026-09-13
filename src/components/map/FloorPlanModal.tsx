'use client';

import React, { useState } from 'react';
import { X, Layers, Users, Cpu, Navigation, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';
import { useRouter } from 'next/navigation';

export const FloorPlanModal: React.FC = () => {
  const router = useRouter();
  const { 
    isFloorPlanOpen, 
    setFloorPlanOpen, 
    selectedBuildingId, 
    buildings,
    setSelectedRoom,
    setActiveRoute 
  } = useCampusStore();

  const [activeFloor, setActiveFloor] = useState<number>(2);

  if (!isFloorPlanOpen || !selectedBuildingId) return null;

  const building = buildings.find(b => b.id === selectedBuildingId);
  if (!building) return null;

  const roomsForBuilding = building.popularRooms;

  const handleStartNavigationToRoom = (roomCode: string) => {
    const route = calculateCampusRoute('node-north-gate', building.id);
    setActiveRoute(route);
    setFloorPlanOpen(false);
    router.push('/explore');
  };

  const handleSelectRoom = (room: any) => {
    setSelectedRoom(room);
    setFloorPlanOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end lg:items-center justify-center p-0 lg:p-4 animate-in fade-in duration-150 pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full max-w-4xl bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[94dvh] lg:h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                FLOOR PLAN VIEWER
              </span>
              <span className="text-xs text-slate-400 font-mono">• {building.code}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1 text-white">{building.name} Blueprint</h2>
          </div>
          <button
            onClick={() => setFloorPlanOpen(false)}
            className="w-10 h-10 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors touch-target-48 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Selection Bar */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 px-4">
          {['G', '1', '2', '3'].map((flLabel, idx) => {
            const floorNum = idx === 0 ? 0 : idx;
            const isActive = activeFloor === (floorNum === 0 ? 1 : floorNum);
            return (
              <button
                key={flLabel}
                onClick={() => setActiveFloor(floorNum === 0 ? 1 : floorNum)}
                className={`min-w-[48px] min-h-[44px] px-4 py-2 rounded-xl text-xs font-extrabold transition-all touch-target-48 active:scale-95 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-200/60'
                }`}
              >
                Floor {flLabel}
              </button>
            );
          })}
        </div>

        {/* Interactive Floor Blueprint */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-600" />
                Floor {activeFloor} Rooms & Laboratories
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {roomsForBuilding.length} Rooms
              </span>
            </div>

            {/* Room Blueprint Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roomsForBuilding.map((room) => {
                const isAvailable = room.status === 'available';
                return (
                  <div
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-cyan-400 transition-all bg-white flex flex-col justify-between space-y-3 cursor-pointer touch-target-48"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-slate-100 text-slate-800">
                          {room.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          ● {room.status.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm">{room.name}</h4>
                      
                      <div className="mt-2 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>Occupancy:</span>
                          <span className="font-bold text-slate-800">{room.currentOccupancy} / {room.capacity} seats</span>
                        </div>
                        {room.nextScheduledClass && (
                          <div className="text-[11px] text-cyan-800 font-semibold bg-cyan-50 p-2 rounded-xl mt-2">
                            ⏰ {room.nextScheduledClass}
                          </div>
                        )}
                      </div>

                      {/* Equipment Tags */}
                      {room.equipment.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Equipment</div>
                          <div className="flex flex-wrap gap-1">
                            {room.equipment.map((eq, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] text-slate-700 font-semibold">
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartNavigationToRoom(room.code);
                      }}
                      className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white hover:bg-cyan-600 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      Navigate to {room.code}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
