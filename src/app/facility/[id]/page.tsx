'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCampusStore } from '../../../services/campusStore';
import { calculateCampusRoute } from '../../../services/navigationService';
import { 
  Building as BuildingIcon, 
  MapPin, 
  Navigation, 
  Layers, 
  Clock, 
  Accessibility, 
  Wrench, 
  Users,
  ChevronLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { buildings, setSelectedBuildingId, setActiveRoute, setFloorPlanOpen, setReportModalOpen } = useCampusStore();

  const facilityId = Array.isArray(params.id) ? params.id[0] : params.id;
  const building = buildings.find(b => b.id.toLowerCase() === facilityId?.toLowerCase());

  if (!building) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Facility Not Found</h2>
        <p className="text-xs text-slate-500">No campus building matched ID &quot;{facilityId}&quot;</p>
        <button
          onClick={() => router.push('/explore')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Return to Campus Explorer
        </button>
      </div>
    );
  }

  const handleStartNavigation = () => {
    const route = calculateCampusRoute('node-north-gate', building.id);
    setActiveRoute(route);
    router.push('/explore');
  };

  const handleOpenFloorPlan = () => {
    setSelectedBuildingId(building.id);
    setFloorPlanOpen(true);
    router.push('/explore');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      
      {/* Top Back Navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Campus Explorer
      </button>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            {building.code}
          </span>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            {building.category}
          </span>
          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
            building.status === 'available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            ● {building.status.toUpperCase()}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{building.name}</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">{building.description}</p>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleStartNavigation}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <Navigation className="w-4 h-4" />
            Start Navigation
          </button>

          <button
            onClick={handleOpenFloorPlan}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            View Multi-Floor Blueprint
          </button>

          <button
            onClick={() => { setSelectedBuildingId(building.id); setReportModalOpen(true); }}
            className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-extrabold text-xs flex items-center gap-2 transition-colors border border-amber-500/30"
          >
            <Wrench className="w-4 h-4 text-amber-400" />
            Report Issue
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Current Occupancy</div>
          <div className="text-2xl font-extrabold text-slate-900">{building.occupancyPercentage}%</div>
          <div className="text-xs text-slate-500 font-medium">({building.currentOccupancy} of {building.capacity} capacity)</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Equipment Uptime</div>
          <div className="text-2xl font-extrabold text-emerald-600">{building.equipmentOperationalPct}%</div>
          <div className="text-xs text-slate-500 font-medium">Operational Sensors & Hardware</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Crowd Level</div>
          <div className="text-2xl font-extrabold text-slate-900 uppercase">{building.crowdLevel}</div>
          <div className="text-xs text-slate-500 font-medium">Updated 2 minutes ago</div>
        </div>
      </div>

      {/* Facilities & Accessibility Specs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Facility Amenities & Accessibility</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-bold text-slate-700 mb-2">Key Amenities</div>
            <div className="flex flex-wrap gap-1.5">
              {building.facilities.map((fac, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="font-bold text-slate-700 mb-2">Accessibility Infrastructure</div>
            <div className="flex flex-wrap gap-1.5">
              {building.accessibilityFeatures.map((acc, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-medium border border-teal-200/60">
                  ♿ {acc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
