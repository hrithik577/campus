'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Building, 
  NavigationResult, 
  BuildingCategory 
} from '../../types/campus';
import { useCampusStore } from '../../services/campusStore';
import { GRAPH_NODES, GRAPH_EDGES } from '../../data/mockCampusData';
import { MapPin, Navigation, Info, Zap, AlertTriangle, Eye, Compass, Layers } from 'lucide-react';

interface CampusMapProps {
  onBuildingSelect?: (buildingId: string) => void;
  highlightBuildingId?: string | null;
}

export const CampusMap: React.FC<CampusMapProps> = ({ 
  onBuildingSelect, 
  highlightBuildingId 
}) => {
  const { 
    buildings, 
    selectedBuildingId, 
    setSelectedBuildingId,
    activeCategoryFilter,
    smartFilters,
    activeRoute,
    events,
    setLayersOpen,
    isLayersOpen
  } = useCampusStore();

  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      dragStartRef.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStartRef.current.x,
      y: touch.clientY - dragStartRef.current.y
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - 0.25, 0.6));

  const effectiveSelectedId = highlightBuildingId || selectedBuildingId;

  const filteredBuildings = buildings.filter(b => {
    if (activeCategoryFilter !== 'all' && b.category !== activeCategoryFilter) return false;
    if (smartFilters.availableNow && b.status !== 'available') return false;
    if (smartFilters.lowCrowd && b.crowdLevel !== 'low') return false;
    if (smartFilters.maintenance && b.maintenanceAlertsCount === 0) return false;
    return true;
  });

  // Auto-center camera when selected building changes
  useEffect(() => {
    if (effectiveSelectedId) {
      const bldg = buildings.find(b => b.id === effectiveSelectedId);
      if (bldg) {
        const centerX = bldg.svgPath.x + bldg.svgPath.width / 2;
        const centerY = bldg.svgPath.y + bldg.svgPath.height / 2;
        setZoomLevel(1.4);
        setPanOffset({
          x: (500 - centerX) * 0.7,
          y: (350 - centerY) * 0.7
        });
      }
    }
  }, [effectiveSelectedId, buildings]);

  const handleLocateUser = () => {
    setZoomLevel(1.5);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative w-full h-full bg-[#f8fafc] overflow-hidden select-none cursor-grab active:cursor-grabbing border border-slate-200/80 rounded-2xl shadow-inner group touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: `${24 * zoomLevel}px ${24 * zoomLevel}px`,
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
      />

      {/* Spatial Twin SVG Canvas */}
      <svg
        className="w-full h-full transition-transform duration-200 ease-out"
        viewBox="0 0 1000 700"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center'
        }}
      >
        <defs>
          {/* Spatial Building Drop Shadows */}
          <filter id="building-elevation" x="-15%" y="-15%" width="135%" height="135%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.09" />
          </filter>

          <filter id="glow-selected-cyan" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#0891b2" floodOpacity="0.5" />
          </filter>

          {/* Crowd Heatmap Gradients */}
          <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-med" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- TERRAIN & GREENERY MEADOWS --- */}
        <rect x="300" y="160" width="380" height="300" rx="30" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="2" />
        <rect x="500" y="60" width="180" height="100" rx="20" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="1.5" />
        <rect x="60" y="340" width="220" height="300" rx="25" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />

        {/* Tree Clusters in Quad */}
        <circle cx="340" cy="200" r="14" fill="#86efac" opacity="0.6" />
        <circle cx="360" cy="210" r="10" fill="#4ade80" opacity="0.7" />
        <circle cx="640" cy="200" r="14" fill="#86efac" opacity="0.6" />
        <circle cx="620" cy="210" r="10" fill="#4ade80" opacity="0.7" />

        {/* --- ROADS AND PEDESTRIAN PATHWAYS --- */}
        <rect x="60" y="50" width="860" height="600" rx="40" fill="none" stroke="#e2e8f0" strokeWidth="30" />
        <rect x="60" y="50" width="860" height="600" rx="40" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="12 8" />

        {/* Pedestrian Pathways Network */}
        {GRAPH_EDGES.map((edge, idx) => {
          const fromNode = GRAPH_NODES.find(n => n.id === edge.from);
          const toNode = GRAPH_NODES.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`edge-${idx}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={smartFilters.accessible ? '#0d9488' : '#e2e8f0'}
              strokeWidth={smartFilters.accessible ? 5 : 4}
              strokeDasharray={smartFilters.accessible ? '6 4' : 'none'}
              strokeLinecap="round"
            />
          );
        })}

        {/* Central Fountain Landmark */}
        <circle cx="450" cy="350" r="20" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2.5" />
        <circle cx="450" cy="350" r="9" fill="#0284c7" />

        {/* --- USER LOCATION PULSING MARKER --- */}
        <g>
          <circle cx="450" cy="350" r="18" fill="#0ea5e9" opacity="0.25" className="animate-ping" />
          <circle cx="450" cy="350" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
        </g>

        {/* --- CROWD DENSITY HEATMAP LAYER --- */}
        {buildings.map((bldg) => {
          if (bldg.crowdLevel === 'high') {
            return (
              <circle
                key={`heat-${bldg.id}`}
                cx={bldg.svgPath.x + bldg.svgPath.width / 2}
                cy={bldg.svgPath.y + bldg.svgPath.height / 2}
                r={Math.max(bldg.svgPath.width, bldg.svgPath.height) * 1.25}
                fill="url(#heat-high)"
                className="animate-pulse"
              />
            );
          }
          if (bldg.crowdLevel === 'medium') {
            return (
              <circle
                key={`heat-${bldg.id}`}
                cx={bldg.svgPath.x + bldg.svgPath.width / 2}
                cy={bldg.svgPath.y + bldg.svgPath.height / 2}
                r={Math.max(bldg.svgPath.width, bldg.svgPath.height) * 0.95}
                fill="url(#heat-med)"
              />
            );
          }
          return null;
        })}

        {/* --- ANIMATED ROUTE OVERLAY LINE (DIJKSTRA NAVIGATION) --- */}
        {activeRoute && activeRoute.pathPoints.length > 1 && (
          <g>
            <polyline
              points={activeRoute.pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#0284c7"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
            <polyline
              points={activeRoute.pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeDasharray="10 10"
              strokeLinecap="round"
              className="animate-[dash_2s_linear_infinite]"
            />
            {/* Start & End Waypoint Markers */}
            <circle 
              cx={activeRoute.pathPoints[0].x} 
              cy={activeRoute.pathPoints[0].y} 
              r="8" 
              fill="#0ea5e9" 
              stroke="#ffffff" 
              strokeWidth="3" 
            />
            <circle 
              cx={activeRoute.pathPoints[activeRoute.pathPoints.length - 1].x} 
              cy={activeRoute.pathPoints[activeRoute.pathPoints.length - 1].y} 
              r="10" 
              fill="#ef4444" 
              stroke="#ffffff" 
              strokeWidth="3" 
              className="animate-bounce"
            />
          </g>
        )}

        {/* --- SPATIAL BUILDING FOOTPRINTS & LABELS --- */}
        {filteredBuildings.map((bldg) => {
          const isSelected = effectiveSelectedId === bldg.id;
          const isHovered = hoveredBuildingId === bldg.id;
          const categoryColors = getCategoryColors(bldg.category, isSelected, isHovered);

          return (
            <g
              key={bldg.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBuildingId(bldg.id);
                if (onBuildingSelect) onBuildingSelect(bldg.id);
              }}
              onMouseEnter={() => setHoveredBuildingId(bldg.id)}
              onMouseLeave={() => setHoveredBuildingId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              {/* Building Base / Elevation */}
              <rect
                x={bldg.svgPath.x}
                y={bldg.svgPath.y}
                width={bldg.svgPath.width}
                height={bldg.svgPath.height}
                rx="14"
                fill={categoryColors.bg}
                stroke={categoryColors.stroke}
                strokeWidth={isSelected ? 3 : 1.5}
                filter={isSelected ? 'url(#glow-selected-cyan)' : 'url(#building-elevation)'}
                className="transition-all duration-200"
              />

              {/* Roof Architectural Inset */}
              <rect
                x={bldg.svgPath.x + 6}
                y={bldg.svgPath.y + 6}
                width={bldg.svgPath.width - 12}
                height={bldg.svgPath.height - 12}
                rx="9"
                fill={categoryColors.innerBg}
                opacity="0.9"
              />

              {/* Building Code Badge */}
              <rect
                x={bldg.svgPath.x + 10}
                y={bldg.svgPath.y + 10}
                width="36"
                height="18"
                rx="5"
                fill={isSelected ? '#0f172a' : '#ffffff'}
                stroke={categoryColors.stroke}
                strokeWidth="1"
              />
              <text
                x={bldg.svgPath.x + 28}
                y={bldg.svgPath.y + 23}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill={isSelected ? '#ffffff' : '#0f172a'}
                fontFamily="sans-serif"
              >
                {bldg.code}
              </text>

              {/* Building Name Label */}
              <text
                x={bldg.svgPath.x + bldg.svgPath.width / 2}
                y={bldg.svgPath.y + bldg.svgPath.height / 2 + 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#0f172a"
                fontFamily="sans-serif"
                className="pointer-events-none"
              >
                {bldg.name.length > 18 ? bldg.name.substring(0, 16) + '...' : bldg.name}
              </text>

              {/* Maintenance Alert Warning Badge */}
              {bldg.maintenanceAlertsCount > 0 && (
                <circle
                  cx={bldg.svgPath.x + bldg.svgPath.width - 10}
                  cy={bldg.svgPath.y + 10}
                  r="6"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              )}

              {/* Entrance Point Marker */}
              <circle
                cx={bldg.entranceCoords.x}
                cy={bldg.entranceCoords.y}
                r="3.5"
                fill="#0891b2"
              />
            </g>
          );
        })}
      </svg>

      {/* MAP FLOATING UTILITY CONTROLS (Zoom, Pan, Locate, Compass) */}
      <div className="absolute top-18 lg:top-4 right-3 flex flex-col gap-2 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-11 h-11 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl text-base font-extrabold transition-colors flex items-center justify-center touch-target-48 active:scale-95"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-11 h-11 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl text-base font-extrabold transition-colors flex items-center justify-center touch-target-48 active:scale-95"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleLocateUser}
            className="w-11 h-11 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center touch-target-48 active:scale-95"
            title="Locate Me"
          >
            <MapPin className="w-5 h-5 text-cyan-600" />
          </button>
          <button
            onClick={resetView}
            className="w-11 h-11 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center touch-target-48 active:scale-95"
            title="Reset Orientation"
          >
            <Compass className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => setLayersOpen(!isLayersOpen)}
            className={`w-11 h-11 ${isLayersOpen ? 'text-cyan-600 bg-cyan-50' : 'text-slate-800 hover:text-cyan-600 hover:bg-slate-100'} rounded-xl transition-colors flex items-center justify-center touch-target-48 active:scale-95`}
            title="Toggle Map Layers"
          >
            <Layers className="w-5 h-5 text-cyan-600" />
          </button>
        </div>
      </div>

      {/* MAP LEGEND OVERLAY */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-[11px] font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600"></span> Academic/Labs
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Food/Dining
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Sports/Hostels
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> High Crowd
        </div>
      </div>
    </div>
  );
};

function getCategoryColors(category: BuildingCategory, isSelected: boolean, isHovered: boolean) {
  if (isSelected) {
    return {
      bg: '#ecfeff',
      innerBg: '#cff4fe',
      stroke: '#0891b2'
    };
  }

  if (isHovered) {
    return {
      bg: '#f1f5f9',
      innerBg: '#e2e8f0',
      stroke: '#0891b2'
    };
  }

  switch (category) {
    case 'auditorium':
      return { bg: '#faf5ff', innerBg: '#f3e8ff', stroke: '#a855f7' };
    case 'labs':
    case 'academic':
      return { bg: '#ffffff', innerBg: '#f8fafc', stroke: '#cbd5e1' };
    case 'food':
      return { bg: '#fffbeb', innerBg: '#fef3c7', stroke: '#fde68a' };
    case 'sports':
      return { bg: '#f0fdf4', innerBg: '#dcfce7', stroke: '#bbf7d0' };
    case 'hostels':
      return { bg: '#faf5ff', innerBg: '#f3e8ff', stroke: '#e9d5ff' };
    case 'library':
      return { bg: '#f0f9ff', innerBg: '#e0f2fe', stroke: '#bae6fd' };
    default:
      return { bg: '#ffffff', innerBg: '#f8fafc', stroke: '#cbd5e1' };
  }
}
