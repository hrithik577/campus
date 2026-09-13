'use client';

// RegisterModal.tsx - Comprehensive Account Creation with Profile Photo & Personal Details
import React, { useState, useRef } from 'react';
import { authService } from '../../services/authService';
import { useCampusStore } from '../../services/campusStore';
import { 
  GraduationCap, 
  X, 
  Camera, 
  UploadCloud, 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Phone, 
  Home, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AVATAR_PRESETS = [
  { id: 'av-1', label: 'Scholar', emoji: '🎓' },
  { id: 'av-2', label: 'Developer', emoji: '💻' },
  { id: 'av-3', label: 'Researcher', emoji: '🔬' },
  { id: 'av-4', label: 'Athlete', emoji: '⚽' },
  { id: 'av-5', label: 'Faculty', emoji: '📚' },
  { id: 'av-6', label: 'Executive', emoji: '🛡️' },
];

export default function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const { setCurrentUser } = useCampusStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Photo file size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    const result = authService.register({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      department: department.trim() || undefined,
      studentId: studentId.trim() || undefined,
      phone: phone.trim() || undefined,
      avatar: avatar || undefined,
      hostelRoom: hostelRoom.trim() || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
    });

    if (result.success && result.user) {
      setCurrentUser(result.user);
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">Create Institutional Account</h2>
              <p className="text-[11px] text-slate-300">Join the Amity University Spatial Digital Twin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Photo / Avatar Picker */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-md bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white text-xl font-black">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{name.charAt(0) || 'U'}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-slate-900 text-white shadow-md flex items-center justify-center hover:bg-cyan-600 transition-colors"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="text-xs font-extrabold text-slate-900">Add Profile Picture</div>
              <p className="text-[11px] text-slate-500">
                Upload your picture or pick a campus badge emoji for your digital identity.
              </p>

              <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-cyan-700 text-[11px] font-bold shadow-2xs flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Upload Photo</span>
                </button>

                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatar('')}
                    title={preset.label}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:border-cyan-500 flex items-center justify-center text-xs transition-transform active:scale-95 shadow-2xs"
                  >
                    <span>{preset.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'student'
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('faculty')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'faculty'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Institutional Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@amity.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Password (min 6 chars) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Student ID / Employee ID */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                {role === 'admin' ? 'Officer / Staff ID' : 'Enrollment / Student ID'}
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. AMITY-CS-2026-042"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Department */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Department / Program
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Hostel Room */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Hostel / Residence
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  placeholder="e.g. Hostel H-A, Room 304"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Emergency Contact (Parent / Guardian Name & Phone)
              </label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Mr. R. Sharma (+91 98765 43211)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Registration</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
