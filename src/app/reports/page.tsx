'use client';

import React from 'react';
import { useCampusStore } from '../../services/campusStore';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ReportsPage() {
  const { reports, setReportModalOpen } = useCampusStore();

  const activeReports = reports.filter(r => r.status !== 'Resolved');
  const resolvedReports = reports.filter(r => r.status === 'Resolved');

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 px-4 sm:px-0">
      
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              FACILITY MAINTENANCE
            </span>
            <span className="text-xs text-slate-400">• Student & Staff Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Campus Operations Issue Tracker</h1>
          <p className="text-xs text-slate-300 mt-1">
            Report infrastructure issues, track live dispatch progress, and view resolved tickets.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Report New Issue
        </button>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Active Maintenance Tickets ({reports.length})
        </h2>

        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    #{r.id}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{r.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                    r.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {r.priority.toUpperCase()}
                  </span>
                </div>

                <div className="text-slate-600 font-medium">{r.location}</div>
                <p className="text-slate-500 text-[11px] italic">{r.description}</p>
              </div>

              <div className="sm:text-right shrink-0">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  r.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  r.status === 'In Progress' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  ● {r.status}
                </span>
                {r.assignedTechnician && (
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    Assigned: {r.assignedTechnician}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
