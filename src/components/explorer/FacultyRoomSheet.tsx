'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  DoorOpen,
  CheckCircle2,
  XCircle,
  Users,
  Layers,
  BookOpen,
} from 'lucide-react';
import { Faculty, FacultyRoom, Room } from '../../types/campus';

interface FacultyRoomSheetProps {
  buildingName: string;
  facultyRooms?: FacultyRoom[];
  classrooms?: Room[];
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

const AvailBadge: React.FC<{ available: boolean }> = ({ available }) =>
  available ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Available
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-extrabold uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Busy
    </span>
  );

import { useCampusStore } from '../../services/campusStore';

const FacultyRow: React.FC<{ f: Faculty; onSelect?: () => void }> = ({ f, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 hover:border-violet-200 transition-all text-left active:scale-[0.99] cursor-pointer"
  >
    <div
      className={`w-10 h-10 rounded-2xl ${f.avatarColor} flex items-center justify-center shrink-0 shadow-sm`}
    >
      <span className="text-white font-black text-xs">{initials(f.name)}</span>
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-extrabold text-slate-900 truncate">{f.name}</div>
      <div className="text-[10px] text-slate-500 font-medium truncate">{f.designation}</div>
      {f.subject && (
        <div className="text-[9px] text-cyan-600 font-bold mt-0.5 truncate">{f.subject}</div>
      )}
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      <AvailBadge available={f.isAvailable} />
      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
    </div>
  </button>
);

type AnyRoom = FacultyRoom | Room;

function isFacultyRoom(room: AnyRoom): room is FacultyRoom {
  return 'roomNo' in room;
}

const RoomCard: React.FC<{ room: AnyRoom; onClick: () => void }> = ({ room, onClick }) => {
  const label = isFacultyRoom(room) ? `Room ${room.roomNo}` : room.name;
  const sublabel = isFacultyRoom(room)
    ? `Floor ${room.floor} · ${room.block} Block`
    : `Floor ${room.floor} · ${room.code}`;
  const faculty = isFacultyRoom(room) ? room.faculty : room.faculty ?? [];
  const availCount = faculty.filter((f) => f.isAvailable).length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-3 rounded-xl bg-white border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/40 flex items-center justify-between text-left transition-all active:scale-[0.99] shadow-sm"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <DoorOpen className="w-4 h-4 text-slate-600" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-extrabold text-slate-900 truncate">{label}</div>
          <div className="text-[10px] text-slate-500 font-medium truncate">{sublabel}</div>
          <div className="text-[9px] text-slate-400 mt-0.5">
            {availCount}/{faculty.length} faculty available
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
            room.status === 'available'
              ? 'bg-emerald-100 text-emerald-700'
              : room.status === 'crowded'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {room.status}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </button>
  );
};

export const FacultyRoomSheet: React.FC<FacultyRoomSheetProps> = ({
  buildingName,
  facultyRooms = [],
  classrooms = [],
}) => {
  const { setSelectedFacultyId, setSelectedClassroomId } = useCampusStore();
  const [selectedRoom, setSelectedRoom] = useState<AnyRoom | null>(null);

  const allRooms: AnyRoom[] = [
    ...facultyRooms,
    ...classrooms.filter(
      (cr) =>
        cr.faculty && cr.faculty.length > 0 &&
        !facultyRooms.some((fr) => fr.id === cr.id)
    ),
  ];

  const selectedFaculty = selectedRoom
    ? isFacultyRoom(selectedRoom)
      ? selectedRoom.faculty
      : selectedRoom.faculty ?? []
    : [];

  const selectedLabel = selectedRoom
    ? isFacultyRoom(selectedRoom)
      ? `Room ${selectedRoom.roomNo}`
      : selectedRoom.name
    : '';

  const selectedFloor = selectedRoom ? selectedRoom.floor : null;
  const availableCount = selectedFaculty.filter((f) => f.isAvailable).length;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-1 pb-3 border-b border-slate-100 flex items-center gap-2">
        {selectedRoom ? (
          <button
            type="button"
            onClick={() => setSelectedRoom(null)}
            className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-800 active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            All Rooms
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-600" />
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {buildingName} · Faculty Rooms
            </span>
          </div>
        )}
        {selectedRoom && (
          <span className="text-[10px] font-bold text-slate-400 ml-auto truncate max-w-[100px]">
            {buildingName}
          </span>
        )}
      </div>

      {/* List view */}
      {!selectedRoom && (
        <div className="px-4 py-3 space-y-2">
          {allRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
              <BookOpen className="w-8 h-8" />
              <p className="text-xs font-bold">No faculty rooms found</p>
            </div>
          ) : (
            <>
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                Tap a classroom to view faculty
              </div>
              {allRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => setSelectedRoom(room)}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Detail view */}
      {selectedRoom && (
        <div className="px-4 py-3 space-y-3">
          {/* Room meta card */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-50 to-slate-50 border border-cyan-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-black text-slate-900">{selectedLabel}</div>
                {selectedFloor !== null && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                    <Layers className="w-3 h-3" />
                    Floor {selectedFloor}
                  </div>
                )}
              </div>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                  selectedRoom.status === 'available'
                    ? 'bg-emerald-100 text-emerald-700'
                    : selectedRoom.status === 'crowded'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {selectedRoom.status.toUpperCase()}
              </span>
            </div>
            {/* Availability summary */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">
                  {availableCount} Available
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-xs font-bold text-rose-600">
                  {selectedFaculty.length - availableCount} Busy
                </span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <Users className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] text-slate-500 font-medium">
                  {selectedFaculty.length} total
                </span>
              </div>
            </div>
          </div>

          {/* Faculty rows */}
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
            Faculty Members
          </div>
          {selectedFaculty.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No faculty assigned to this room.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedFaculty.map((f) => (
                <FacultyRow
                  key={f.id}
                  f={f}
                  onSelect={() => setSelectedFacultyId(f.id)}
                />
              ))}
            </div>
          )}

          {/* Suggestion */}
          {availableCount > 0 ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide">
                  Suggestion
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 leading-relaxed">
                {availableCount === 1
                  ? `${selectedFaculty.find((f) => f.isAvailable)?.name} is currently available for consultation.`
                  : `${availableCount} faculty members are available — you can visit them now!`}
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-1.5 mb-1">
                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wide">
                  All Busy
                </span>
              </div>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                All faculty in this room are currently busy. Please try another room or check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
