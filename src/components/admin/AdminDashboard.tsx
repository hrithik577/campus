'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Activity, 
  Building as BuildingIcon, 
  Wrench, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Plus,
  ArrowUpRight,
  Layers,
  Settings,
  Lock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { MaintenanceReport, Building } from '../../types/campus';

export const AdminDashboard: React.FC = () => {
  const { 
    buildings, 
    reports, 
    updateReportStatus, 
    updateBuildingStatus,
    notifications,
    currentUser
  } = useCampusStore();

  const [announcementText, setAnnouncementText] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Authorization Guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
              Restricted Area
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">Administrator Access Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Operations & Facility Management portal is restricted to authorized Amity University Operations personnel. You are currently signed in as <span className="font-semibold text-slate-800">{currentUser ? currentUser.name : 'a Guest'}</span> ({currentUser ? currentUser.role : 'unauthenticated'}).
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/login"
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Sign in as Admin
            </Link>
            <Link
              href="/explore"
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Campus Map
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeReports = reports.filter(r => r.status !== 'Resolved');
  const resolvedReportsCount = reports.filter(r => r.status === 'Resolved').length;

  const totalOccupancy = Math.round(
    buildings.reduce((acc, b) => acc + b.occupancyPercentage, 0) / buildings.length
  );

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setBroadcastSuccess(true);
    setAnnouncementText('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden px-3.5 sm:px-0 pb-20 lg:pb-0">
      
      {/* Top Header Banner (Desktop Only) */}
      <div className="hidden lg:flex p-5 sm:p-6 bg-slate-900 rounded-3xl text-white flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 tracking-wider">
              ENTERPRISE OPERATIONS
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Campus Operations Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Real-time digital twin telemetry, maintenance dispatch, room status overrides, & crowd controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono font-medium border border-slate-700">
            System: 🟢 OPERATIONAL
          </span>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Buildings</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{buildings.length}</div>
          <div className="text-[10px] text-slate-500 font-medium">100% Monitored</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Facilities</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">186</div>
          <div className="text-[10px] text-emerald-600 font-semibold">96.4% Uptime</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Students</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">1,248</div>
          <div className="text-[10px] text-cyan-600 font-semibold">Live Telemetry</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Campus Activity</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{totalOccupancy}%</div>
          <div className="text-[10px] text-amber-600 font-semibold">Moderate Load</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Open Tickets</div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-0.5">{activeReports.length}</div>
          <div className="text-[10px] text-slate-500 font-medium">{resolvedReportsCount} Resolved</div>
        </div>
      </div>

      {/* Main Grid: Maintenance Queue & Overrides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Maintenance Ticket Dispatch (Mobile Cards vs Desktop Table) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                Operations Maintenance Queue
              </h2>
              <p className="text-xs text-slate-500">
                Update ticket progression in real-time across student views.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
              {activeReports.length} Pending
            </span>
          </div>

          {/* MOBILE CARDS VIEW (< md) */}
          <div className="block md:hidden space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    #{rep.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rep.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                    rep.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {rep.priority.toUpperCase()}
                  </span>
                </div>

                <div>
                  <div className="font-extrabold text-slate-900">{rep.category}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{rep.location}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rep.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    rep.status === 'In Progress' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    ● {rep.status}
                  </span>

                  <div className="flex items-center gap-1">
                    {rep.status === 'Reported' && (
                      <button
                        type="button"
                        onClick={() => updateReportStatus(rep.id, 'Assigned', 'Electric Dispatch')}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold touch-target-48"
                      >
                        Assign
                      </button>
                    )}
                    {rep.status === 'Assigned' && (
                      <button
                        type="button"
                        onClick={() => updateReportStatus(rep.id, 'In Progress')}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white text-[10px] font-bold touch-target-48"
                      >
                        Start Work
                      </button>
                    )}
                    {rep.status !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={() => updateReportStatus(rep.id, 'Resolved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[10px] font-bold touch-target-48"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Category & Location</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900">{rep.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{rep.category}</div>
                      <div className="text-[11px] text-slate-500">{rep.location}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rep.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                        rep.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rep.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rep.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        rep.status === 'In Progress' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        ● {rep.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {rep.status === 'Reported' && (
                          <button
                            type="button"
                            onClick={() => updateReportStatus(rep.id, 'Assigned', 'Electric Dispatch')}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-cyan-600 transition-colors"
                          >
                            Assign
                          </button>
                        )}
                        {rep.status === 'Assigned' && (
                          <button
                            type="button"
                            onClick={() => updateReportStatus(rep.id, 'In Progress')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white text-[10px] font-bold hover:bg-cyan-700 transition-colors"
                          >
                            Start Work
                          </button>
                        )}
                        {rep.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => updateReportStatus(rep.id, 'Resolved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Building Operational Overrides & Announcement Broadcast */}
        <div className="space-y-6">
          
          {/* Facility Status Override */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-600" />
              Building Operational Overrides
            </h2>

            <div className="space-y-3">
              {buildings.slice(0, 4).map((b) => (
                <div key={b.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-slate-900">{b.name} ({b.code})</div>
                    <div className="text-[11px] text-slate-500">Crowd: {b.crowdLevel.toUpperCase()} • {b.occupancyPercentage}%</div>
                  </div>

                  <select
                    value={b.status}
                    onChange={(e) => updateBuildingStatus(b.id, e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="operational">Operational</option>
                    <option value="available">Available</option>
                    <option value="crowded">Crowded</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Announcement */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-600" />
              Broadcast Live Announcement
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Push notification broadcast to all student apps.
            </p>

            <form onSubmit={handlePublishAnnouncement} className="space-y-3">
              <textarea
                rows={2}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Wi-Fi maintenance scheduled for CS Block at 6:00 PM."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              />
              <button
                type="submit"
                className="w-full min-h-[44px] rounded-2xl bg-slate-900 hover:bg-rose-600 text-white font-extrabold text-xs transition-colors shadow-xs touch-target-48"
              >
                Publish Live Broadcast
              </button>
              {broadcastSuccess && (
                <div className="text-[11px] text-emerald-600 font-bold text-center">
                  ✓ Broadcast published to live notifications
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
