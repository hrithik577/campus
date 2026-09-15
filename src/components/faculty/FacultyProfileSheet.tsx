'use client';

import React from 'react';
import { 
  X, 
  MapPin, 
  DoorOpen, 
  Clock, 
  Navigation, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { facultyService } from '../../services/facultyService';
import { calculateCampusRoute } from '../../services/navigationService';
import { MobileBottomSheet } from '../common/MobileBottomSheet';
import { useRouter } from 'next/navigation';

interface FacultyProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  facultyId: string | null;
}

export const FacultyProfileSheet: React.FC<FacultyProfileSheetProps> = ({
  isOpen,
  onClose,
  facultyId,
}) => {
  const router = useRouter();
  const { 
    setSelectedClassroomId, 
    setActiveRoute,
    setSelectedBuildingId 
  } = useCampusStore();

  if (!facultyId) return null;

  const faculty = facultyService.getFacultyById(facultyId);
  if (!faculty) return null;

  const availInfo = facultyService.getFacultyAvailability(faculty.id);

  function initials(name: string) {
    return name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '')
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  const handleNavigate = () => {
    const route = calculateCampusRoute('node-north-gate', faculty.buildingId || 'ab2-block', 'fastest');
    setActiveRoute(route);
    onClose();
    router.push('/navigate');
  };

  const handleViewRoom = () => {
    if (faculty.roomId) {
      setSelectedClassroomId(faculty.roomId);
    }
  };

  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} initialSnap="half">
      <div className="pb-6 space-y-4">
        {/* ── HEADER WITH AVATAR ────────────────────────────────────── */}
        <div className="px-4 pt-1 pb-3 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl ${faculty.avatarColor} text-white flex items-center justify-center font-black text-xl shadow-md`}
              >
                {initials(faculty.name)}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  {faculty.name}
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  {faculty.designation}
                </p>
                <p className="text-[11px] text-violet-600 font-extrabold mt-0.5">
                  {faculty.subject}
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
        </div>

        {/* ── AVAILABILITY STATUS BANNER ────────────────────────────── */}
        <div className="px-4">
          <div
            className={`p-3.5 rounded-2xl border ${
              faculty.isAvailable
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : faculty.availabilityStatus === 'in_class'
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    faculty.isAvailable
                      ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-200'
                      : faculty.availabilityStatus === 'in_class'
                      ? 'bg-amber-500 ring-4 ring-amber-200'
                      : 'bg-rose-500 ring-4 ring-rose-200'
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-wide">
                  {availInfo.label}
                </span>
              </div>
              <span className="text-[10px] font-semibold opacity-75">
                Schedule-based
              </span>
            </div>
            <p className="text-xs font-medium mt-1.5 opacity-90">
              {availInfo.details}
            </p>
            {faculty.officeHours && (
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-current/10 text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span>Office Hours: {faculty.officeHours}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── LOCATION / ROOM CARD ──────────────────────────────────── */}
        <div className="px-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Assigned Faculty Room
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                  <DoorOpen className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">
                    Room {faculty.roomNo}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Floor {faculty.floor} · {faculty.block} Block ({faculty.buildingName})
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleViewRoom}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-violet-300 text-violet-700 font-extrabold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              >
                <span>View Room</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ── TODAY'S SCHEDULE ──────────────────────────────────────── */}
        {faculty.scheduleToday && faculty.scheduleToday.length > 0 && (
          <div className="px-4">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Today's Schedule
            </div>
            <div className="space-y-1.5">
              {faculty.scheduleToday.map((slot, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-800 truncate">
                      {slot.label}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {slot.time}
                      {slot.roomNumber && (
                        <>
                          <span>•</span>
                          <span>Room {slot.roomNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase shrink-0 ${
                      slot.type === 'class'
                        ? 'bg-blue-100 text-blue-700'
                        : slot.type === 'free'
                        ? 'bg-emerald-100 text-emerald-700'
                        : slot.type === 'office_hours'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {slot.type.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTACT ──────────────────────────────────────────────── */}
        <div className="px-4">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Contact Faculty
          </div>
          <div className="grid grid-cols-2 gap-2">
            {faculty.email && (
              <a
                href={`mailto:${faculty.email}`}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center gap-2 text-slate-700 transition-all"
              >
                <Mail className="w-4 h-4 text-violet-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Email</div>
                  <div className="text-[11px] font-bold truncate">{faculty.email}</div>
                </div>
              </a>
            )}
            {faculty.phone && (
              <a
                href={`tel:${faculty.phone}`}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center gap-2 text-slate-700 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Phone</div>
                  <div className="text-[11px] font-bold truncate">{faculty.phone}</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* ── PRIMARY ACTION BUTTON ─────────────────────────────────── */}
        <div className="px-4 pt-1">
          <button
            type="button"
            onClick={handleNavigate}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 active:scale-[0.98] transition-all"
          >
            <Navigation className="w-4 h-4 fill-white stroke-none" />
            Navigate to Room {faculty.roomNo} ({faculty.block})
          </button>
        </div>
      </div>
    </MobileBottomSheet>
  );
};
