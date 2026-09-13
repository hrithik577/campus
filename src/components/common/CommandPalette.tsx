'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Navigation, BookOpen, Utensils, Cpu, ArrowRight, X } from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { calculateCampusRoute } from '../../services/navigationService';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    buildings,
    setSelectedBuildingId,
    setActiveRoute
  } = useCampusStore();

  const [query, setQuery] = useState('');

  // Handle keyboard shortcut '/' to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isCommandPaletteOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter buildings and rooms matching query
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
    setCommandPaletteOpen(false);
    router.push('/explore');
  };

  const handleStartNavigation = (buildingId: string) => {
    const route = calculateCampusRoute('node-north-gate', buildingId);
    setActiveRoute(route);
    setCommandPaletteOpen(false);
    router.push('/explore');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, rooms, labs (e.g. 'Lab 204', 'Library', 'Cafeteria')..."
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
          
          {/* Quick Suggestions when query is empty */}
          {query === '' && (
            <div className="p-3 text-xs text-slate-500 font-medium">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">Suggested Searches</div>
              <div className="flex flex-wrap gap-2">
                {['Lab 204', 'Central Library', 'Central Cafeteria', 'AI & Robotics Lab', 'Sports Complex', 'EV Chargers'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 border border-slate-200/60 text-slate-700 transition-colors text-xs"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          {popularRooms.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">Rooms & Labs</div>
              {popularRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleSelectBuilding(room.buildingId)}
                  className="px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs">
                      {room.code}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">
                        {room.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {room.buildingName} • Floor {room.floor}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      room.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      ● {room.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartNavigation(room.buildingId);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-900 text-white hover:bg-cyan-600 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    >
                      <Navigation className="w-3 h-3" />
                      Navigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Buildings */}
          {matchingBuildings.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">Campus Buildings & Facilities</div>
              {matchingBuildings.map((building) => (
                <div
                  key={building.id}
                  onClick={() => handleSelectBuilding(building.id)}
                  className="px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {building.code}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors">
                        {building.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {building.category.toUpperCase()} • Occupancy: {building.occupancyPercentage}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {matchingBuildings.length === 0 && popularRooms.length === 0 && query !== '' && (
            <div className="p-8 text-center text-xs text-slate-400">
              No campus locations found matching &quot;{query}&quot;
            </div>
          )}

        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↵</kbd> Select</span>
          </div>
          <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">ESC</kbd> Close</span>
        </div>

      </div>
    </div>
  );
};
