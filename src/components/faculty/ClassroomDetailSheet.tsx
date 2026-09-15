'use client';

import React from 'react';
import { 
  X, 
  DoorOpen, 
  Navigation, 
  Wrench, 
  Clock, 
  Users, 
  Calendar, 
  ChevronRight, 
  GraduationCap, 
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { facultyService } from '../../services/facultyService';
import { calculateCampusRoute } from '../../services/navigationService';
import { MobileBottomSheet } from '../common/MobileBottomSheet';
import { useRouter } from 'next/navigation';

interface ClassroomDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
}

export const ClassroomDetailSheet: React.FC<ClassroomDetailSheetProps> = ({
  isOpen,
  onClose,
  roomId,
}) => {
  const router = useRouter();
  const { 
    setSelectedFacultyId, 
    setSelectedClassroomId,
    setActiveRoute,
    setReportModalOpen 
  } = useCampusStore();

  if (!roomId) return null;

  const room = facultyService.getClassroomById(roomId) || facultyService.getClassroomByRoomNumber(roomId);
  if (!room) return null;

  const facultyList = facultyService.getFacultyForRoom(room.id);
  const nearbyRooms = facultyService.getNearbyClassrooms(room.id);

  function initials(name: string) {
    return name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '')
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  const handleNavigate = () => {
    const route = calculateCampusRoute('node-north-gate', room.buildingId || 'ab2-block', 'fastest');
    setActiveRoute(route);
    onClose();
    router.push('/navigate');
  };

  const handleReportIssue = () => {
    setReportModalOpen(true);
  };

  const handleSelectFaculty = (fId: string) => {
    setSelectedFacultyId(fId);
  };

  const handleSelectNearby = (nearId: string) => {
    setSelectedClassroomId(nearId);
  };

  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} initialSnap="half">
      <div className="pb-6 space-y-4">
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="px-4 pt-1 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex flex-col items-center justify-center font-black shadow-md shadow-cyan-500/20">
              <span className="text-[9px] uppercase tracking-wider opacity-80 leading-none">Room</span>
              <span className="text-base leading-none mt-0.5">{room.roomNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Room {room.roomNumber}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                  {room.block} Block
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Floor {room.floor} · {room.buildingName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── LIVE STATUS BANNER ───────────────────────────────────── */}
        <div className="px-4">
          <div
            className={`p-3.5 rounded-2xl border ${
              room.currentStatus === 'available'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    room.currentStatus === 'available'
                      ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-200'
                      : 'bg-rose-500 ring-4 ring-rose-200'
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-wide">
                  {room.currentStatus === 'available' ? 'Room Available Now' : 'Room Currently Occupied'}
                </span>
              </div>
              <span className="text-[10px] font-bold opacity-75">
                Capacity: {room.capacity} seats
              </span>
            </div>
            {room.nextClass && (
              <p className="text-xs font-semibold mt-1.5 opacity-90 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {room.nextClass}
              </p>
            )}
          </div>
        </div>

        {/* ── ASSIGNED TEACHERS / FACULTY ───────────────────────────── */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Faculty In This Room ({facultyList.length})
            </div>
            <span className="text-[10px] text-slate-400">Tap for teacher profile</span>
          </div>

          <div className="space-y-2">
            {facultyList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No faculty assigned directly to this classroom</p>
            ) : (
              facultyList.map((f) => (
                <div
                  key={f.id}
                  onClick={() => handleSelectFaculty(f.id)}
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-2.5 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl ${f.avatarColor} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm`}
                    >
                      {initials(f.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {f.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
                            f.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : f.availabilityStatus === 'in_class'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              f.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-current'
                            }`}
                          />
                          {f.availabilityStatus === 'in_class' ? 'In Class' : f.isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium truncate">
                        {f.designation} · {f.subject || 'Faculty'}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── TODAY'S SCHEDULE ─────────────────────────────────────── */}
        {room.schedule && room.schedule.length > 0 && (
          <div className="px-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Room Schedule Today
            </div>
            <div className="space-y-1.5">
              {room.schedule.map((item, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {item.subject}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.time}
                      {item.facultyName && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-semibold">{item.facultyName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase shrink-0 ${
                      item.status === 'ongoing'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'free'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NEARBY ROOMS ON SAME BLOCK/FLOOR ───────────────────────── */}
        {nearbyRooms.length > 0 && (
          <div className="px-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Nearby Rooms (AB2 Block)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nearbyRooms.map((near) => (
                <button
                  key={near.id}
                  type="button"
                  onClick={() => handleSelectNearby(near.id)}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-cyan-50/50 hover:border-cyan-200 text-left transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Room {near.roomNumber}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        near.currentStatus === 'available' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Floor {near.floor} · {near.type === 'faculty_room' ? 'Faculty' : 'Classroom'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTION BUTTONS ────────────────────────────────────────── */}
        <div className="px-4 pt-1 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleNavigate}
            className="col-span-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25 active:scale-[0.98] transition-all"
          >
            <Navigation className="w-4 h-4 fill-white stroke-none" />
            Navigate to Room {room.roomNumber}
          </button>
          <button
            type="button"
            onClick={handleReportIssue}
            className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Wrench className="w-4 h-4 text-amber-500" />
            Report
          </button>
        </div>
      </div>
    </MobileBottomSheet>
  );
};
