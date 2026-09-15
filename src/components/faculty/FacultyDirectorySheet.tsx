'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  GraduationCap, 
  DoorOpen, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter,
  Layers,
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { facultyService } from '../../services/facultyService';
import { calculateCampusRoute } from '../../services/navigationService';
import { MobileBottomSheet } from '../common/MobileBottomSheet';
import { Faculty } from '../../types/campus';
import { useRouter } from 'next/navigation';

interface FacultyDirectorySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacultyDirectorySheet: React.FC<FacultyDirectorySheetProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { 
    setSelectedFacultyId, 
    setSelectedClassroomId, 
    setClassroomDirectoryOpen,
    setActiveRoute 
  } = useCampusStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'available' | 'busy' | 'floor2' | 'floor3'>('all');

  const allFaculty = useMemo(() => facultyService.getAllFaculty(), []);

  const filteredFaculty = useMemo(() => {
    let list = allFaculty;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          (f.subject && f.subject.toLowerCase().includes(q)) ||
          (f.roomNo && f.roomNo.toLowerCase().includes(q)) ||
          (f.block && f.block.toLowerCase().includes(q))
      );
    }

    if (filterType === 'available') {
      list = list.filter((f) => f.isAvailable);
    } else if (filterType === 'busy') {
      list = list.filter((f) => !f.isAvailable);
    } else if (filterType === 'floor2') {
      list = list.filter((f) => f.floor === 2);
    } else if (filterType === 'floor3') {
      list = list.filter((f) => f.floor === 3);
    }

    return list;
  }, [allFaculty, searchQuery, filterType]);

  const handleSelectFaculty = (f: Faculty) => {
    setSelectedFacultyId(f.id);
  };

  const handleNavigateToFaculty = (e: React.MouseEvent, f: Faculty) => {
    e.stopPropagation();
    const route = calculateCampusRoute('node-north-gate', f.buildingId || 'ab2-block', 'fastest');
    setActiveRoute(route);
    onClose();
    router.push('/navigate');
  };

  const handleOpenClassrooms = () => {
    onClose();
    setClassroomDirectoryOpen(true);
  };

  function initials(name: string) {
    return name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '')
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} initialSnap="half">
      <div className="pb-6 space-y-3">
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="px-4 pt-1 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">Faculty Directory</h2>
              <p className="text-[10px] text-slate-500 font-medium">AB2 Academic Block & Engineering Faculty</p>
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

        {/* ── SWITCHER BANNER: Jump to Classrooms ─────────────────────── */}
        <div className="px-4">
          <button
            type="button"
            onClick={handleOpenClassrooms}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 flex items-center justify-between text-left hover:border-cyan-300 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <DoorOpen className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <span className="text-xs font-black text-slate-900">Looking for Classrooms?</span>
                <span className="text-[10px] text-slate-600 block">Check live room availability & schedules</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-700 shrink-0">
              <span>View Rooms</span>
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
              placeholder="Search faculty, subject, or Room 217 / 317..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
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
            { id: 'all', label: `All (${allFaculty.length})` },
            { id: 'available', label: `🟢 Available (${allFaculty.filter((f) => f.isAvailable).length})` },
            { id: 'busy', label: `🔴 In Class / Busy` },
            { id: 'floor2', label: `Floor 2 (Rooms 217, 201)` },
            { id: 'floor3', label: `Floor 3 (Room 317)` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── FACULTY CARDS ────────────────────────────────────────── */}
        <div className="px-4 space-y-2 max-h-[52vh] overflow-y-auto pr-1">
          {filteredFaculty.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold text-slate-600">No faculty members found</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Try searching for "Anugha", "Swathika", or "217"</p>
            </div>
          ) : (
            filteredFaculty.map((faculty) => (
              <div
                key={faculty.id}
                onClick={() => handleSelectFaculty(faculty)}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer space-y-2.5 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl ${faculty.avatarColor} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}
                    >
                      {initials(faculty.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {faculty.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            faculty.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : faculty.availabilityStatus === 'in_class'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              faculty.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-current'
                            }`}
                          />
                          {faculty.availabilityStatus === 'in_class'
                            ? 'In Class'
                            : faculty.isAvailable
                            ? 'Available'
                            : 'Busy'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium truncate">
                        {faculty.designation} · {faculty.department || 'CSE'}
                      </p>
                      {faculty.subject && (
                        <p className="text-[10px] font-bold text-violet-600 truncate mt-0.5">
                          {faculty.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
                </div>

                {/* Location & Navigation Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                      Room {faculty.roomNo}
                    </span>
                    <span>•</span>
                    <span>Floor {faculty.floor}</span>
                    <span>•</span>
                    <span>{faculty.block} Block</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleNavigateToFaculty(e, faculty)}
                    className="px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 font-extrabold flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Navigation className="w-3 h-3 fill-violet-700 stroke-none" />
                    Navigate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileBottomSheet>
  );
};
