'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Navigation, 
  ArrowLeft, 
  X, 
  Sparkles, 
  Utensils, 
  BookOpen,
  Layers,
  Building as BuildingIcon
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';

interface MobileSearchBarProps {
  onSelectResult?: (buildingId: string, roomCode?: string) => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({ onSelectResult }) => {
  const router = useRouter();
  const { 
    buildings, 
    setSelectedBuildingId, 
    setSelectedRoom,
    setActiveRoute 
  } = useCampusStore();

  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  // Categorized Search Results
  const matchingBuildings = buildings.filter(b => 
    b.name.toLowerCase().includes(q) ||
    b.code.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q) ||
    b.facilities.some(f => f.toLowerCase().includes(q))
  );

  const popularRooms = buildings.flatMap(b => b.popularRooms).filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.code.toLowerCase().includes(q) ||
    r.type.toLowerCase().includes(q)
  );

  const handleSelectBuilding = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setSelectedRoom(null);
    setIsFocused(false);
    setQuery('');
    if (onSelectResult) onSelectResult(buildingId);
    router.push('/explore');
  };

  const handleSelectRoom = (buildingId: string, room: any) => {
    setSelectedBuildingId(buildingId);
    setSelectedRoom(room);
    setIsFocused(false);
    setQuery('');
    if (onSelectResult) onSelectResult(buildingId, room.code);
    router.push('/explore');
  };

  const handleStartNavigation = (buildingId: string) => {
    const route = calculateCampusRoute('node-north-gate', buildingId);
    setActiveRoute(route);
    setIsFocused(false);
    setQuery('');
    router.push('/explore');
  };

  return (
    <>
      {/* Default Floating Search Field at top of Mobile Viewport */}
      <div className="lg:hidden absolute top-3 left-3 right-3 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsFocused(true)}
          className="w-full h-13 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl px-4 flex items-center justify-between text-left touch-target-48 active:scale-[0.99] transition-all"
        >
          <div className="flex items-center gap-3 text-slate-500">
            <Search className="w-5 h-5 text-cyan-600" />
            <span className="text-xs font-semibold text-slate-700">Search campus, rooms, labs...</span>
          </div>
          <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-mono font-bold text-slate-500 uppercase">
            SEARCH
          </span>
        </button>
      </div>

      {/* Expanded Full-Screen Mobile Search Sheet */}
      {isFocused && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col lg:hidden animate-in fade-in duration-150 pt-[env(safe-area-inset-top,0px)]">
          
          {/* Top Header: ← Search */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFocused(false)}
              className="w-10 h-10 text-slate-600 hover:text-slate-900 rounded-xl touch-target-48 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search buildings, rooms, labs..."
                className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-10 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 touch-target-48"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search Suggestions & Intelligent Results */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100 pb-[max(2rem,env(safe-area-inset-bottom))]">
            
            {/* Preset Quick Suggestions */}
            {query === '' && (
              <div className="space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Popular Spaces</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'LAB 204', bldgId: 'cs-block' },
                    { label: 'GRAND AUDITORIUM', bldgId: 'auditorium-main' },
                    { label: 'CENTRAL LIBRARY', bldgId: 'central-lib' },
                    { label: 'CENTRAL CAFETERIA', bldgId: 'cafeteria-main' },
                    { label: 'AI & ROBOTICS LAB', bldgId: 'ai-robotics' },
                    { label: 'SPORTS ARENA', bldgId: 'sports-complex' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSelectBuilding(item.bldgId)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 text-slate-800 text-xs font-semibold touch-target-48 active:scale-95 transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms Results */}
            {popularRooms.length > 0 && (
              <div className="pt-3 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rooms & Laboratories</div>
                {popularRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleSelectRoom(room.buildingId, room)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50/50 border border-slate-200 flex items-center justify-between touch-target-48 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{room.code} — {room.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {room.buildingName} • {room.floor === 0 ? 'Ground Floor' : `${room.floor}nd Floor`} • 420 m
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartNavigation(room.buildingId);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1 min-h-[36px]"
                    >
                      <Navigation className="w-3 h-3 text-cyan-400" />
                      Navigate
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buildings Results */}
            {matchingBuildings.length > 0 && (
              <div className="pt-3 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Campus Complexes</div>
                {matchingBuildings.map((building) => (
                  <div
                    key={building.id}
                    onClick={() => handleSelectBuilding(building.id)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50/50 border border-slate-200 flex items-center justify-between touch-target-48 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{building.name} ({building.code})</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {building.category.toUpperCase()} • {building.occupancyPercentage}% Occupied • 280 m
                      </div>
                    </div>

                    <span className="text-xs font-bold text-cyan-600">Select →</span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}
    </>
  );
};
