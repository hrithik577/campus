'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Building2, 
  Camera, 
  Save, 
  CheckCircle2, 
  GraduationCap, 
  Home, 
  AlertCircle,
  UploadCloud
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';

const AVATAR_PRESETS = [
  { id: 'av-1', label: 'Student Blue', bg: 'bg-cyan-600', text: 'AS', emoji: '🎓' },
  { id: 'av-2', label: 'Tech Violet', bg: 'bg-indigo-600', text: 'DEV', emoji: '💻' },
  { id: 'av-3', label: 'Scholar Emerald', bg: 'bg-emerald-600', text: 'RES', emoji: '🔬' },
  { id: 'av-4', label: 'Sports Amber', bg: 'bg-amber-600', text: 'ATH', emoji: '⚽' },
  { id: 'av-5', label: 'Faculty Rose', bg: 'bg-rose-600', text: 'FAC', emoji: '📚' },
  { id: 'av-6', label: 'Executive Slate', bg: 'bg-slate-900', text: 'OPS', emoji: '🛡️' },
];

export const UserProfileModal: React.FC = () => {
  const { 
    currentUser, 
    isProfileModalOpen, 
    setProfileModalOpen, 
    updateUserProfile 
  } = useCampusStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [studentId, setStudentId] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [avatar, setAvatar] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setDepartment(currentUser.department || '');
      setStudentId(currentUser.studentId || '');
      setHostelRoom(currentUser.hostelRoom || '');
      setEmergencyContact(currentUser.emergencyContact || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser, isProfileModalOpen]);

  if (!isProfileModalOpen || !currentUser) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      studentId: studentId.trim(),
      hostelRoom: hostelRoom.trim(),
      emergencyContact: emergencyContact.trim(),
      avatar
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setProfileModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Institutional Profile</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Amity University Campus Identity & Spatial Account</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setProfileModalOpen(false)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-md bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white text-xl font-black">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{name.charAt(0) || 'U'}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-slate-900 text-white shadow-md flex items-center justify-center hover:bg-cyan-600 transition-colors"
                title="Upload photo"
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

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-xs font-extrabold text-slate-900">Profile Photo / Avatar</div>
              <p className="text-[11px] text-slate-500">
                Upload a campus photo from your device, or choose from quick avatar styles.
              </p>

              <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-cyan-700 text-[11px] font-bold shadow-2xs flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-cyan-600" />
                  Upload Photo
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

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Full Name */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@amity.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Student ID / Employee ID */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                {currentUser.role === 'admin' ? 'Staff / Officer ID' : 'Enrollment / Student ID'}
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

            {/* Phone Number */}
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

            {/* Department / Faculty */}
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

            {/* Hostel Room / Residence */}
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
                  placeholder="e.g. Hostel H-1, Room 304"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Emergency Contact
              </label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Parent / Guardian & Phone"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

          </div>

          {/* Success Notification */}
          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details & photo updated successfully!</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
