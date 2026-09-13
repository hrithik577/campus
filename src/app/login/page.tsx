'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  GraduationCap,
  Eye,
  EyeOff,
  Activity,
  MapPin,
  Layers
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { UserProfile } from '../../types/campus';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useCampusStore();

  const [loginRole, setLoginRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      let user: UserProfile;

      if (loginRole === 'admin') {
        user = {
          id: 'user-admin-01',
          name: 'Campus Operations Chief',
          email: 'ops@amity.edu',
          role: 'admin',
          department: 'University Infrastructure & Operations'
        };
      } else if (loginRole === 'faculty') {
        user = {
          id: 'user-fac-02',
          name: 'Prof. V. Raman',
          email: 'vraman@amity.edu',
          role: 'faculty',
          department: 'Department of Computer Science & Engineering'
        };
      } else {
        const username = emailOrId.includes('@') ? emailOrId.split('@')[0] : emailOrId;
        const formattedName = username
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());

        user = {
          id: 'user-std-' + Math.random().toString(36).substring(2, 7),
          name: formattedName || 'Student Member',
          email: emailOrId.includes('@') ? emailOrId : `${emailOrId.toLowerCase()}@amity.edu`,
          role: 'student',
          department: 'Computer Science & Engineering',
          studentId: emailOrId.includes('AMITY') ? emailOrId : 'AMITY-CS-2026-042'
        };
      }

      setCurrentUser(user);
      setIsSubmitting(false);
      setSuccessMessage(`Authenticated as ${user.name}`);

      setTimeout(() => {
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/explore');
        }
      }, 600);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-6.5rem)] flex items-center justify-center py-4 sm:py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* --- LEFT HERO BANNER WITH AMITY UNIVERSITY BUILDING IMAGE --- */}
        <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full flex flex-col justify-between p-6 sm:p-8 bg-slate-900 text-white overflow-hidden group">
          
          {/* Background Photograph */}
          <Image
            src="/amity-building.jpg"
            alt="Amity University Campus Building"
            fill
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

          {/* Top Brand Tag with Amity Shield Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1 border-2 border-amber-400/60 shadow-xl flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Amity Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                AMITY UNIVERSITY
              </span>
              <h2 className="text-lg font-black text-white leading-tight mt-0.5">
                CAMPUS<span className="text-cyan-400 font-extrabold">TWIN</span>
              </h2>
            </div>
          </div>

          {/* Bottom Telemetry & Quote Card */}
          <div className="relative z-10 space-y-4 pt-12">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-[11px]">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>REAL-TIME SPATIAL TELEMETRY</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                &ldquo;Experience living digital twin intelligence deployed across Amity University campus complexes, research labs, &amp; quiet study zones.&rdquo;
              </p>
            </div>

            {/* Micro Telemetry Counter Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-sm font-extrabold text-white">24</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Buildings</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-sm font-extrabold text-cyan-400">1,248</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Students</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-sm font-extrabold text-emerald-400">68%</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Activity</div>
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT FORM CONTAINER --- */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            
            {/* Title & Subtitle */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Sign In to Campus Twin</h2>
              <p className="text-xs text-slate-500 mt-1">
                Access your spatial digital twin account using official Amity credentials.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="bg-slate-100 p-1.5 border border-slate-200 rounded-2xl flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setLoginRole('student')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  loginRole === 'student'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                Student
              </button>

              <button
                type="button"
                onClick={() => setLoginRole('faculty')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  loginRole === 'faculty'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                Faculty
              </button>

              <button
                type="button"
                onClick={() => setLoginRole('admin')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  loginRole === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Admin
              </button>
            </div>

            {/* Success Message Notification */}
            {successMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                <div className="font-extrabold text-sm">{successMessage}</div>
                <p className="text-xs text-emerald-700 font-medium">Entering spatial campus twin workspace...</p>
              </div>
            ) : (
              /* Main Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Email / ID Input */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    {loginRole === 'student' ? 'Amity Email / Enrollment ID' : 'Official Amity Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                      placeholder={
                        loginRole === 'student' 
                          ? 'user@amity.edu or Enrollment ID' 
                          : 'official.identity@amity.edu'
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox & Forgot Password Link */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                    />
                    <span>Remember this session</span>
                  </label>

                  <a href="#" className="text-cyan-700 hover:text-cyan-800 font-bold">
                    Forgot Password?
                  </a>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Amity Campus Twin</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Secure Institutional SSO Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium text-center">
            <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>Amity University Single Sign-On (SSO) • Enterprise IAM Protected</span>
          </div>

        </div>

      </div>
    </div>
  );
}
