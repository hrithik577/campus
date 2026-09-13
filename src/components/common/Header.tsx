'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bot, 
  Bell, 
  MapPin, 
  Navigation as NavIcon, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Activity,
  Cpu
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { NotificationCenter } from './NotificationCenter';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { 
    setCommandPaletteOpen, 
    setAiAssistantOpen, 
    isAiAssistantOpen,
    notifications,
    buildings,
    currentUser,
    logout,
    isLiveNavActive,
    setProfileModalOpen
  } = useCampusStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const totalOccupancy = Math.round(
    buildings.reduce((acc, b) => acc + b.occupancyPercentage, 0) / buildings.length
  );

  const navLinks = [
    { href: '/explore', label: 'Explore', icon: MapPin },
    { href: '/navigate', label: 'Navigate', icon: NavIcon },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/reports', label: 'Reports', icon: FileText },
    ...(currentUser?.role === 'admin' ? [{ href: '/admin', label: 'Operations', icon: ShieldCheck }] : []),
  ];

  return (
    <header className={`${isLiveNavActive ? 'hidden lg:block' : ''} sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-xs transition-all pt-[env(safe-area-inset-top,0px)]`}>
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-13 sm:h-15 flex items-center justify-between gap-2">
        
        {/* Brand System */}
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            
            {/* Logo Shield & Spatial Node */}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white p-0.5 border border-slate-200 shadow-2xs group-hover:border-cyan-500 transition-colors flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="Amity Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>

              <div className="hidden sm:flex w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 items-center justify-center font-mono text-xs shadow-2xs group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tight text-slate-900 text-xs sm:text-base group-hover:text-cyan-700 transition-colors font-sans">
                  CAMPUS<span className="text-cyan-600 font-black">TWIN</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping mr-1"></span>
                  {totalOccupancy}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden md:block font-medium tracking-wide">
                Amity University Spatial Intelligence
              </span>
            </div>
          </Link>

          {/* Command Search Button (Desktop Only) */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium w-60 justify-between transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search spaces, labs...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
              /
            </kbd>
          </button>
        </div>

        {/* Center Navigation Links (Desktop Only) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar (Mobile & Desktop) */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center relative transition-colors touch-target-48"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <NotificationCenter onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* AI Assistant Trigger Button (Desktop Only) */}
          <button
            onClick={() => setAiAssistantOpen(!isAiAssistantOpen)}
            className={`hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-semibold items-center gap-2 border transition-all ${
              isAiAssistantOpen
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-2xs'
                : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800 shadow-2xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Ask AI</span>
          </button>

          {/* User Profile Dropdown / Sign In */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center sm:gap-2 transition-colors touch-target-48"
              >
                <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full overflow-hidden bg-slate-900 text-cyan-400 flex items-center justify-center text-[10px] font-extrabold border border-cyan-500/40">
                  {currentUser.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.name.charAt(0)}</span>
                  )}
                </div>
                <span className="hidden xl:inline max-w-[100px] truncate">{currentUser.name}</span>
                <ChevronDown className="hidden sm:inline w-3 h-3 text-slate-400" />
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in duration-150 text-xs">
                  <div className="p-2 border-b border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 border border-cyan-500/30">
                      {currentUser.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{currentUser.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-0.5 inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-50 text-cyan-800 uppercase">
                        {currentUser.role}
                      </div>
                    </div>
                  </div>

                  <div className="pt-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileModalOpen(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-slate-800 hover:bg-cyan-50 hover:text-cyan-900 font-bold flex items-center gap-2 transition-colors"
                    >
                      <User className="w-4 h-4 text-cyan-600" />
                      <span>My Profile &amp; Photo</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-slate-800 hover:bg-slate-100 font-bold flex items-center gap-2 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-cyan-600" />
                        <span>Operations Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-cyan-600 font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs touch-target-48"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sign In</span>
            </Link>
          )}

        </div>

      </div>
    </header>
  );
};
