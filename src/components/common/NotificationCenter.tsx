'use client';

import React from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead } = useCampusStore();

  return (
    <div className="fixed inset-x-3 top-15 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 w-auto sm:w-96 max-w-sm sm:max-w-none bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Campus Alerts</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No active notifications
          </div>
        ) : (
          notifications.map((n) => {
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3 text-xs cursor-pointer hover:bg-slate-50/80 transition-colors flex items-start gap-2.5 ${
                  isUnread ? 'bg-cyan-50/30' : ''
                }`}
              >
                {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                {n.type === 'info' && <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />}
                {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>

                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0 mt-1.5"></span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
