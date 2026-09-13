'use client';

import React, { useState, useMemo } from 'react';
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
  Building as BuildingIcon,
  CheckCircle2,
  Clock,
  Zap
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
    setActiveRoute,
    isLiveNavActive
  } = useCampusStore();

  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  // Highlight popular featured spaces
  const featuredSpaces = [
    {
      code: 'LAB 204',
      name: 'AI & Data Science Lab',
      buildingId: 'cs-block',
      buildingName: 'Computer Science Block',
      floor: 2,
      distance: '420 m',
      status: 'Available',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      code: 'LIB 301',
      name: 'Silent Reading Hall',
      buildingId: 'central-lib',
      buildingName: 'Central Library',
      floor: 3,
      distance: '650 m',
      status: 'Moderate',
      statusColor: 'text-cyan-700 bg-cyan-50 border-cyan-200'
    },
    {
      code: 'CAFE',
      name: 'Central Cafeteria',
      buildingId: 'cafeteria-main',
      buildingName: 'Dining Hall',
      floor: 0,
      distance: '180 m',
      status: 'Crowded',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      code: 'AUD-01',
      name: 'Grand University Auditorium',
      buildingId: 'auditorium-main',
      buildingName: 'Auditorium Complex',
      floor: 1,
      distance: '720 m',
      status: 'Available',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  // Filtered rooms
  const matchingRooms = useMemo(() => {
    if (!q) return [];
    return buildings.flatMap(b => b.popularRooms).filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.buildingName.toLowerCase().includes(q)
    );
  }, [buildings, q]);

  // Filtered buildings
  const matchingBuildings = useMemo(() => {
    if (!q) return [];
    return buildings.filter(b => 
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.facilities.some(f => f.toLowerCase().includes(q))
    );
  }, [buildings, q]);

  const handleSelectBuilding = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setSelectedRoom(null);
    setIsFocused(false);
    setQuery('');
    // Stay on /explore — building sheet will open (Place Card step)
  };

  const handleSelectRoom = (buildingId: string, room: any) => {
    setSelectedBuildingId(buildingId);
    setSelectedRoom(room);
    setIsFocused(false);
    setQuery('');
    // Stay on /explore — room sheet will open (Place Card step)
  };

  const handleQuickNavigate = (targetId: string) => {
    // Direct navigate shortcut from the Start button in results
    const route = calculateCampusRoute('node-north-gate', targetId, 'fastest');
    if (route) setActiveRoute(route);
    setIsFocused(false);
    setQuery('');
    router.push('/navigate');
  };

  if (isLiveNavActive) return null;

  return (
    <>
      {/* 1. Default Floating Search Pill over Map Viewport */}
      <div className="lg:hidden absolute top-2.5 left-3.5 right-3.5 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsFocused(true)}
          className="w-full h-11 bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-lg px-3.5 flex items-center justify-between text-left active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-slate-600 truncate">Search campus, rooms, labs...</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
            AMITY
          </span>
        </button>
      </div>

      {/* 2. Expanded Full-Screen Mobile Search View */}
      {isFocused && (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col lg:hidden animate-in fade-in duration-150 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
          
          {/* Top Search Header */}
          <div className="p-3 bg-white border-b border-slate-200/80 flex items-center gap-2 shrink-0 shadow-xs">
            <button
              type="button"
              onClick={() => setIsFocused(false)}
              className="w-10 h-10 text-slate-600 hover:text-slate-900 rounded-xl touch-target-48 flex items-center justify-center active:scale-95"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rooms, buildings, labs..."
                className="w-full h-11 bg-slate-100 border border-slate-200/80 rounded-xl pl-9 pr-9 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-cyan-600/30 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="w-8 h-8 absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Search Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 divide-y divide-slate-100">
            
            {/* When Query is Empty: Featured Spaces */}
            {query === '' && (
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    RECOMMENDED SPACES
                  </div>
                  <div className="space-y-2">
                    {featuredSpaces.map((item) => (
                      <div
                        key={item.code}
                        onClick={() => {
                          const bldg = buildings.find(b => b.id === item.buildingId);
                          const room = bldg?.popularRooms.find(r => r.code === item.code) || bldg?.popularRooms[0];
                          if (room) {
                            handleSelectRoom(item.buildingId, room);
                          } else {
                            handleSelectBuilding(item.buildingId);
                          }
                        }}
                        className="p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-cyan-500/40 shadow-2xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-mono font-black text-xs shrink-0">
                            {item.code.substring(0, 3)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-xs truncate">{item.code}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${item.statusColor}`}>
                                ● {item.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.buildingName} • {item.floor === 0 ? 'Ground' : `Floor ${item.floor}`}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <div className="text-xs font-mono font-bold text-slate-800">{item.distance}</div>
                          <span className="text-[10px] text-cyan-600 font-bold">Route →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Campus Category Pills */}
                <div className="pt-2">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    CATEGORIES
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Computer Labs', icon: Zap, id: 'cs-block' },
                      { label: 'Central Library', icon: BookOpen, id: 'central-lib' },
                      { label: 'Food & Dining', icon: Utensils, id: 'cafeteria-main' },
                      { label: 'Auditorium', icon: Layers, id: 'auditorium-main' }
                    ].map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.label}
                          type="button"
                          onClick={() => handleSelectBuilding(cat.id)}
                          className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs font-bold text-slate-700 hover:text-cyan-700 active:scale-95 transition-all text-left shadow-2xs"
                        >
                          <Icon className="w-4 h-4 text-cyan-600" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Matching Rooms Results */}
            {matchingRooms.length > 0 && (
              <div className="pt-3 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  ROOMS & LABS ({matchingRooms.length})
                </div>
                {matchingRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleSelectRoom(room.buildingId, room)}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-cyan-500/40 shadow-2xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs">{room.code}</span>
                        <span className="text-[10px] text-slate-400 font-medium">•</span>
                        <span className="text-xs font-semibold text-slate-700 truncate">{room.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {room.buildingName} • Floor {room.floor} • {room.capacity} Seats
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickNavigate(room.buildingId);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95"
                    >
                      <Navigation className="w-3 h-3 text-cyan-400" />
                      <span>Start</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Matching Buildings Results */}
            {matchingBuildings.length > 0 && (
              <div className="pt-3 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  BUILDINGS & BLOCKS ({matchingBuildings.length})
                </div>
                {matchingBuildings.map((building) => (
                  <div
                    key={building.id}
                    onClick={() => handleSelectBuilding(building.id)}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-cyan-500/40 shadow-2xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-extrabold text-slate-900 text-xs">{building.name} ({building.code})</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {building.category.toUpperCase()} • {building.occupancyPercentage}% Occupancy • {building.openingHours}
                      </div>
                    </div>

                    <span className="text-xs font-bold text-cyan-600 shrink-0">Select →</span>
                  </div>
                ))}
              </div>
            )}

            {/* No Results Found */}
            {q !== '' && matchingRooms.length === 0 && matchingBuildings.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div className="text-xs font-extrabold text-slate-800">No matching spaces found</div>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Try searching for &quot;Lab 204&quot;, &quot;Library&quot;, &quot;Cafeteria&quot;, &quot;Auditorium&quot;, or &quot;C-04&quot;.
                </p>
              </div>
            )}

          </div>

        </div>
      )}
    </>
  );
};
