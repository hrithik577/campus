'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MapPin, 
  Navigation as NavIcon, 
  Sparkles, 
  FileText, 
  Calendar,
  Bot
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { 
    isAiAssistantOpen, 
    setAiAssistantOpen,
    isLiveNavActive
  } = useCampusStore();

  if (isLiveNavActive) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-between select-none pointer-events-auto">
      
      {/* 1. Explore Tab */}
      <Link
        href="/explore"
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] rounded-2xl transition-all active:scale-95 ${
          pathname === '/explore' || pathname === '/'
            ? 'text-cyan-600 font-extrabold bg-cyan-50/70'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <MapPin className={`w-5 h-5 ${pathname === '/explore' || pathname === '/' ? 'text-cyan-600' : 'text-slate-400'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Explore</span>
      </Link>

      {/* 2. Navigate Tab */}
      <Link
        href="/navigate"
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] rounded-2xl transition-all active:scale-95 ${
          pathname === '/navigate'
            ? 'text-cyan-600 font-extrabold bg-cyan-50/70'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <NavIcon className={`w-5 h-5 ${pathname === '/navigate' ? 'text-cyan-600' : 'text-slate-400'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Navigate</span>
      </Link>

      {/* 3. Reports Tab */}
      <Link
        href="/reports"
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] rounded-2xl transition-all active:scale-95 ${
          pathname === '/reports'
            ? 'text-cyan-600 font-extrabold bg-cyan-50/70'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <FileText className={`w-5 h-5 ${pathname === '/reports' ? 'text-cyan-600' : 'text-slate-400'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Reports</span>
      </Link>

      {/* 4. Events Tab */}
      <Link
        href="/events"
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] rounded-2xl transition-all active:scale-95 ${
          pathname === '/events'
            ? 'text-cyan-600 font-extrabold bg-cyan-50/70'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <Calendar className={`w-5 h-5 ${pathname === '/events' ? 'text-cyan-600' : 'text-slate-400'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Events</span>
      </Link>

      {/* 5. AI Assistant Tab */}
      <button
        type="button"
        onClick={() => setAiAssistantOpen(!isAiAssistantOpen)}
        className={`flex flex-col items-center justify-center flex-1 min-h-[48px] rounded-2xl transition-all active:scale-95 ${
          isAiAssistantOpen
            ? 'text-cyan-600 font-extrabold bg-cyan-50/70'
            : 'text-slate-500 hover:text-slate-900 font-semibold'
        }`}
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500"></span>
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">AI</span>
      </button>

    </nav>
  );
};
