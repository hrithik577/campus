'use client';

import React, { useState, useMemo } from 'react';
import { 
  DoorOpen, 
  Search, 
  X, 
  Filter, 
  ChevronRight, 
  Users, 
  Clock, 
  GraduationCap, 
  ArrowRight,
  Navigation
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { facultyService } from '../../services/facultyService';
import { MobileBottomSheet } from '../common/MobileBottomSheet';
import { ClassroomRecord } from '../../types/campus';

interface ClassroomDirectorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassroomDirectorySheet: React.FC<ClassroomDirectorySheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    setSelectedClassroomId, 
    setFacultyDirectoryOpen 
  } = useCampusStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'available' | 'occupied' | 'floor2' | 'floor3'>('all');

  const allClassrooms = useMemo(() => facultyService.getAllClassrooms(), []);

  const filteredClassrooms = useMemo(() => {
    let list = allClassrooms;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const roomFaculty = facultyService.getFacultyForRoom(c.id);
        return (
          c.roomNumber.toLowerCase().includes(q) ||
          c.block.toLowerCase().includes(q) ||
          c.buildingName.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          roomFaculty.some((f) => f.name.toLowerCase().includes(q) || (f.subject && f.subject.toLowerCase().includes(q)))
        );
      });
    }

    if (filterType === 'available') {
      list = list.filter((c) => c.currentStatus === 'available');
    } else if (filterType === 'occupied') {
      list = list.filter((c) => c.currentStatus === 'occupied');
    } else if (filterType === 'floor2') {
      list = list.filter((c) => c.floor === 2);
    } else if (filterType === 'floor3') {
      list = list.filter((c) => c.floor === 3);
    }

    return list;
  }, [allClassrooms, searchQuery, filterType]);

  const handleSelectRoom = (room: ClassroomRecord) => {
    setSelectedClassroomId(room.id);
  };

  const handleOpenFaculty = () => {
    onClose();
    setFacultyDirectoryOpen(true);
  };

  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} initialSnap="half">
      <div className="pb-6 space-y-3">
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="px-4 pt-1 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">Classrooms & Faculty Rooms</h2>
              <p className="text-[10px] text-slate-500 font-medium">AB2 Academic Block Live Status</p>
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

        {/* ── SWITCHER BANNER: Jump to Faculty ─────────────────────── */}
        <div className="px-4">
          <button
            type="button"
            onClick={handleOpenFaculty}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 flex items-center justify-between text-left hover:border-violet-300 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-violet-600 shrink-0" />
              <div>
                <span className="text-xs font-black text-slate-900">Find by Faculty Member</span>
                <span className="text-[10px] text-slate-600 block">Search professors, cabins, and availability</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-violet-700 shrink-0">
              <span>View Faculty</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* ── SEARCH BAR ───────────────────────────────────────────── */}
        <div className="px-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Room 217, 317, 201, or teacher name..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── FILTER PILLS ─────────────────────────────────────────── */}
        <div className="px-4 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: `All Rooms (${allClassrooms.length})` },
            { id: 'available', label: `🟢 Available Now` },
            { id: 'occupied', label: `🔴 Occupied` },
            { id: 'floor2', label: `Floor 2` },
            { id: 'floor3', label: `Floor 3` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CLASSROOM LIST ───────────────────────────────────────── */}
        <div className="px-4 space-y-2 max-h-[52vh] overflow-y-auto pr-1">
          {filteredClassrooms.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <DoorOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold text-slate-600">No rooms found</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Try searching for "217", "317", or "AB2"</p>
            </div>
          ) : (
            filteredClassrooms.map((room) => {
              const faculty = facultyService.getFacultyForRoom(room.id);
              const availableFacultyCount = faculty.filter((f) => f.isAvailable).length;

              return (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-sm transition-all cursor-pointer space-y-2.5 active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex flex-col items-center justify-center font-black shrink-0 shadow-sm">
                        <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Room</span>
                        <span className="text-sm leading-none mt-0.5">{room.roomNumber}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-900 truncate">
                            {room.type === 'faculty_room' ? 'Faculty Cabin Room' : 'Lecture Classroom'}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              room.currentStatus === 'available'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                room.currentStatus === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                              }`}
                            />
                            {room.currentStatus}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                          Floor {room.floor} · {room.block} Block · Capacity: {room.capacity} seats
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
                  </div>

                  {/* Faculty in room chips */}
                  {faculty.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Assigned Faculty ({faculty.length})</span>
                        <span className="text-cyan-600">{availableFacultyCount} available now</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {faculty.map((f) => (
                          <div
                            key={f.id}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                f.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                              }`}
                            />
                            <span>{f.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next class or availability timing */}
                  {room.nextClass && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">{room.nextClass}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </MobileBottomSheet>
  );
};
