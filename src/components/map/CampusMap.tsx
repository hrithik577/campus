'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Building, 
  NavigationResult, 
  BuildingCategory 
} from '../../types/campus';
import { useCampusStore } from '../../services/campusStore';
import { GRAPH_NODES, GRAPH_EDGES } from '../../data/mockCampusData';
import { MapPin, Navigation, Info, Zap, AlertTriangle, Eye, Compass, Layers, Crosshair } from 'lucide-react';

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
    isLiveNavActive,
    currentNavStepIndex,
    followMode,
    setFollowMode,
    events,
    setLayersOpen,
    isLayersOpen
  } = useCampusStore();

  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const effectiveSelectedId = highlightBuildingId || selectedBuildingId;

  // Active navigation camera follow mode
  useEffect(() => {
    if (isLiveNavActive && activeRoute && followMode) {
      const step = activeRoute.steps[currentNavStepIndex] || activeRoute.steps[0];
      if (step && step.coords) {
        setZoomLevel(1.6);
        setPanOffset({
          x: (500 - step.coords.x) * 1.2,
          y: (350 - step.coords.y) * 1.2 + 50 // offset slightly up so bottom cards don't obstruct
        });
      }
    }
  }, [isLiveNavActive, currentNavStepIndex, activeRoute, followMode]);

  // Auto-center camera when a building is selected in normal mode
  useEffect(() => {
    if (!isLiveNavActive && effectiveSelectedId) {
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
  }, [effectiveSelectedId, buildings, isLiveNavActive]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (isLiveNavActive && followMode) setFollowMode(false);
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
      if (isLiveNavActive && followMode) setFollowMode(false);
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
    if (isLiveNavActive) setFollowMode(false);
  };

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - 0.25, 0.6));

  const handleRecenter = () => {
    setFollowMode(true);
    if (activeRoute && activeRoute.steps) {
      const step = activeRoute.steps[currentNavStepIndex] || activeRoute.steps[0];
      if (step && step.coords) {
        setZoomLevel(1.6);
        setPanOffset({
          x: (500 - step.coords.x) * 1.2,
          y: (350 - step.coords.y) * 1.2 + 50
        });
      }
    } else {
      setZoomLevel(1.4);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const filteredBuildings = buildings.filter(b => {
    if (activeCategoryFilter !== 'all' && b.category !== activeCategoryFilter) return false;
    if (smartFilters.availableNow && b.status !== 'available') return false;
    if (smartFilters.lowCrowd && b.crowdLevel !== 'low') return false;
    if (smartFilters.maintenance && b.maintenanceAlertsCount === 0) return false;
    return true;
  });

  // Current user navigation position
  const currentStep = activeRoute?.steps[currentNavStepIndex] || activeRoute?.steps[0];
  const userPos = isLiveNavActive && currentStep ? currentStep.coords : { x: 140, y: 170 }; // default North Gate entrance

  return (
    <div 
      className="relative w-full h-full bg-[#f8fafc] overflow-hidden select-none cursor-grab active:cursor-grabbing border-0 lg:border border-slate-200/80 rounded-none lg:rounded-2xl shadow-inner group touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle Digital Twin Spatial Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: `${24 * zoomLevel}px ${24 * zoomLevel}px`,
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
      />

      {/* Spatial Twin Canvas */}
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
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.08" />
          </filter>

          <filter id="glow-selected-cyan" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#0891b2" floodOpacity="0.45" />
          </filter>

          {/* Crowd Heatmap Gradients */}
          <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-med" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- TERRAIN & GREENERY MEADOWS --- */}
        <rect x="300" y="160" width="380" height="300" rx="28" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="1.5" />
        <rect x="500" y="60" width="180" height="100" rx="18" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="1.5" />
        <rect x="60" y="340" width="220" height="300" rx="24" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />

        {/* Trees */}
        <circle cx="340" cy="200" r="12" fill="#86efac" opacity="0.6" />
        <circle cx="360" cy="210" r="9" fill="#4ade80" opacity="0.7" />
        <circle cx="640" cy="200" r="12" fill="#86efac" opacity="0.6" />
        <circle cx="620" cy="210" r="9" fill="#4ade80" opacity="0.7" />

        {/* Campus Outer Ring Road */}
        <rect x="60" y="50" width="860" height="600" rx="36" fill="none" stroke="#e2e8f0" strokeWidth="26" />
        <rect x="60" y="50" width="860" height="600" rx="36" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="10 8" />

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
              strokeWidth={smartFilters.accessible ? 5 : 3.5}
              strokeDasharray={smartFilters.accessible ? '6 4' : 'none'}
              strokeLinecap="round"
            />
          );
        })}

        {/* Central Landmark Fountain */}
        <circle cx="450" cy="350" r="18" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="450" cy="350" r="8" fill="#0284c7" />

        {/* --- CROWD DENSITY HEATMAP LAYER (when enabled in smartFilters or layers) --- */}
        {(smartFilters.lowCrowd || isLayersOpen) && buildings.map((bldg) => {
          if (bldg.crowdLevel === 'high') {
            return (
              <circle
                key={`heat-${bldg.id}`}
                cx={bldg.svgPath.x + bldg.svgPath.width / 2}
                cy={bldg.svgPath.y + bldg.svgPath.height / 2}
                r={Math.max(bldg.svgPath.width, bldg.svgPath.height) * 1.2}
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
                r={Math.max(bldg.svgPath.width, bldg.svgPath.height) * 0.9}
                fill="url(#heat-med)"
              />
            );
          }
          return null;
        })}

        {/* --- ACTIVE NAVIGATION ROUTE OVERLAY (Dijkstra) --- */}
        {activeRoute && activeRoute.pathPoints.length > 1 && (
          <g>
            {/* Base Glow Path */}
            <polyline
              points={activeRoute.pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#0891b2"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            {/* Animated Directional Dash Track */}
            <polyline
              points={activeRoute.pathPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#67e8f9"
              strokeWidth="3.5"
              strokeDasharray="10 10"
              strokeLinecap="round"
              className="animate-[dash_1.5s_linear_infinite]"
            />

            {/* Turn Waypoint Dots */}
            {activeRoute.pathPoints.map((pt, pIdx) => (
              <circle
                key={`pt-${pIdx}`}
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill="#ffffff"
                stroke="#0891b2"
                strokeWidth="1.5"
              />
            ))}

            {/* DESTINATION MARKER (📍 Destination Flag) */}
            {(() => {
              const destPt = activeRoute.pathPoints[activeRoute.pathPoints.length - 1];
              return (
                <g transform={`translate(${destPt.x}, ${destPt.y})`}>
                  <circle r="12" fill="#ef4444" opacity="0.3" className="animate-ping" />
                  <circle r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                  <rect x="-36" y="-28" width="72" height="18" rx="5" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
                  <text x="0" y="-16" textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff" fontFamily="sans-serif">
                    {activeRoute.toLocation.length > 11 ? activeRoute.toLocation.substring(0, 9) + '..' : activeRoute.toLocation}
                  </text>
                </g>
              );
            })()}
          </g>
        )}

        {/* --- SPATIAL BUILDING FOOTPRINTS & LABELS --- */}
        {filteredBuildings.map((bldg) => {
          const isSelected = effectiveSelectedId === bldg.id;
          const isHovered = hoveredBuildingId === bldg.id;
          const isTargetBuilding = activeRoute?.toLocation.toLowerCase().includes(bldg.name.toLowerCase()) ||
                                   activeRoute?.toLocation.toLowerCase().includes(bldg.code.toLowerCase());

          // During active live nav, reduce visual clutter on non-target buildings
          const opacityStyle = isLiveNavActive 
            ? (isSelected || isTargetBuilding ? 1 : 0.45)
            : 1;

          const isHighlighted = Boolean(isSelected || isTargetBuilding);
          const categoryColors = getCategoryColors(bldg.category, isHighlighted, isHovered);

          return (
            <g
              key={bldg.id}
              opacity={opacityStyle}
              onClick={(e) => {
                e.stopPropagation();
                if (isLiveNavActive) return; // ignore clicks during active navigation
                setSelectedBuildingId(bldg.id);
                if (onBuildingSelect) onBuildingSelect(bldg.id);
              }}
              onMouseEnter={() => setHoveredBuildingId(bldg.id)}
              onMouseLeave={() => setHoveredBuildingId(null)}
              className="cursor-pointer transition-opacity duration-200"
            >
              {/* Building Base Footprint */}
              <rect
                x={bldg.svgPath.x}
                y={bldg.svgPath.y}
                width={bldg.svgPath.width}
                height={bldg.svgPath.height}
                rx="12"
                fill={categoryColors.bg}
                stroke={categoryColors.stroke}
                strokeWidth={isSelected || isTargetBuilding ? 2.5 : 1.2}
                filter={isSelected || isTargetBuilding ? 'url(#glow-selected-cyan)' : 'url(#building-elevation)'}
                className="transition-all duration-200"
              />

              {/* Roof Architectural Inset */}
              <rect
                x={bldg.svgPath.x + 5}
                y={bldg.svgPath.y + 5}
                width={bldg.svgPath.width - 10}
                height={bldg.svgPath.height - 10}
                rx="8"
                fill={categoryColors.innerBg}
                opacity="0.9"
              />

              {/* Small Minimal Building Code Badge */}
              <rect
                x={bldg.svgPath.x + 8}
                y={bldg.svgPath.y + 8}
                width="32"
                height="16"
                rx="4"
                fill={isSelected || isTargetBuilding ? '#0f172a' : '#ffffff'}
                stroke={categoryColors.stroke}
                strokeWidth="0.8"
              />
              <text
                x={bldg.svgPath.x + 24}
                y={bldg.svgPath.y + 20}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill={isSelected || isTargetBuilding ? '#ffffff' : '#0f172a'}
                fontFamily="sans-serif"
              >
                {bldg.code}
              </text>

              {/* Small Building Name Label */}
              <text
                x={bldg.svgPath.x + bldg.svgPath.width / 2}
                y={bldg.svgPath.y + bldg.svgPath.height / 2 + 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#0f172a"
                fontFamily="sans-serif"
                className="pointer-events-none"
              >
                {bldg.name.length > 17 ? bldg.name.substring(0, 15) + '..' : bldg.name}
              </text>

              {/* Tiny Status Indicator Dot */}
              <circle
                cx={bldg.svgPath.x + bldg.svgPath.width - 10}
                cy={bldg.svgPath.y + 10}
                r="3.5"
                fill={bldg.status === 'available' ? '#10b981' : bldg.status === 'crowded' ? '#f59e0b' : '#64748b'}
                stroke="#ffffff"
                strokeWidth="1"
              />

              {/* Entrance Coordinate Marker */}
              <circle
                cx={bldg.entranceCoords.x}
                cy={bldg.entranceCoords.y}
                r="3"
                fill="#0891b2"
              />
            </g>
          );
        })}

        {/* --- USER CURRENT POSITION ("YOU ARE HERE") MARKER --- */}
        <g transform={`translate(${userPos.x}, ${userPos.y})`}>
          {/* Outer Accuracy Circle & Pulse */}
          <circle r="22" fill="#0284c7" opacity="0.18" className="animate-ping" />
          <circle r="14" fill="#0284c7" opacity="0.25" />
          {/* Core Blue Dot */}
          <circle r="7.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
          {/* You Tag */}
          <g transform="translate(0, -18)">
            <rect x="-14" y="-8" width="28" height="14" rx="4" fill="#0f172a" />
            <text x="0" y="2" textAnchor="middle" fontSize="8" fontWeight="900" fill="#38bdf8" fontFamily="sans-serif">YOU</text>
          </g>
        </g>
      </svg>

      {/* --- FLOATING RECENTER BUTTON (When user pans during active navigation) --- */}
      {isLiveNavActive && !followMode && (
        <button
          type="button"
          onClick={handleRecenter}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 shadow-2xl text-xs font-black flex items-center gap-2 active:scale-95 transition-all animate-in fade-in"
        >
          <Crosshair className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>RECENTER</span>
        </button>
      )}

      {/* --- MAP FLOATING UTILITY CONTROLS (+, −, Locate, Compass, Layers) --- */}
      <div className="absolute top-16 right-3 flex flex-col gap-1.5 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200/90 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl text-base font-extrabold transition-colors flex items-center justify-center active:scale-95 touch-target-48"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl text-base font-extrabold transition-colors flex items-center justify-center active:scale-95 touch-target-48"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={handleRecenter}
            className="w-10 h-10 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center active:scale-95 touch-target-48"
            title="Locate Me"
          >
            <Crosshair className="w-4 h-4 text-cyan-600" />
          </button>
          <button
            onClick={resetView}
            className="w-10 h-10 text-slate-800 hover:text-cyan-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center active:scale-95 touch-target-48"
            title="Reset Orientation"
          >
            <Compass className="w-4 h-4 text-slate-600" />
          </button>
          {!isLiveNavActive && (
            <button
              onClick={() => setLayersOpen(!isLayersOpen)}
              className={`w-10 h-10 ${isLayersOpen ? 'text-cyan-600 bg-cyan-50' : 'text-slate-800 hover:text-cyan-600 hover:bg-slate-100'} rounded-xl transition-colors flex items-center justify-center active:scale-95 touch-target-48`}
              title="Toggle Map Layers"
            >
              <Layers className="w-4 h-4 text-cyan-600" />
            </button>
          )}
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
      return { bg: '#faf5ff', innerBg: '#f3e8ff', stroke: '#c084fc' };
    case 'labs':
    case 'academic':
      return { bg: '#ffffff', innerBg: '#f8fafc', stroke: '#cbd5e1' };
    case 'food':
      return { bg: '#fffbeb', innerBg: '#fef3c7', stroke: '#fde68a' };
    case 'mess':
      return { bg: '#fff7ed', innerBg: '#ffedd5', stroke: '#fb923c' };
    case 'mart':
      return { bg: '#fdf4ff', innerBg: '#fae8ff', stroke: '#e879f9' };
    case 'mrc':
    case 'medical':
      return { bg: '#fef2f2', innerBg: '#fee2e2', stroke: '#f87171' };
    case 'gym':
      return { bg: '#f0fdfa', innerBg: '#ccfbf1', stroke: '#2dd4bf' };
    case 'basketball':
      return { bg: '#fff1f2', innerBg: '#ffe4e6', stroke: '#fb7185' };
    case 'football':
    case 'sports':
      return { bg: '#f0fdf4', innerBg: '#dcfce7', stroke: '#86efac' };
    case 'hostels':
      return { bg: '#faf5ff', innerBg: '#f3e8ff', stroke: '#e9d5ff' };
    case 'library':
      return { bg: '#f0f9ff', innerBg: '#e0f2fe', stroke: '#bae6fd' };
    default:
      return { bg: '#ffffff', innerBg: '#f8fafc', stroke: '#cbd5e1' };
  }
}
