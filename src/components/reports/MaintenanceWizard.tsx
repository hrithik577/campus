'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Wrench, 
  CheckCircle2, 
  Upload, 
  AlertTriangle, 
  Clock, 
  X, 
  FileText,
  Building as BuildingIcon,
  Camera,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Check
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { MaintenanceReport } from '../../types/campus';

export const MaintenanceWizard: React.FC = () => {
  const { 
    buildings, 
    selectedBuildingId,
    selectedRoom,
    addReport, 
    isReportModalOpen, 
    setReportModalOpen 
  } = useCampusStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [category, setCategory] = useState<MaintenanceReport['category']>('Broken Light');
  const [buildingId, setBuildingId] = useState(buildings[0]?.id || 'cs-block');
  const [roomCode, setRoomCode] = useState('Lab 204');
  const [priority, setPriority] = useState<MaintenanceReport['priority']>('medium');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('Aarav Sharma (Student)');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<MaintenanceReport | null>(null);

  React.useEffect(() => {
    if (isReportModalOpen) {
      if (selectedBuildingId) {
        setBuildingId(selectedBuildingId);
      }
      if (selectedRoom) {
        setRoomCode(selectedRoom.code);
      }
    }
  }, [isReportModalOpen, selectedBuildingId, selectedRoom]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isReportModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoPreview(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSimulate = () => {
    // Simulate attaching a photo captured on mobile camera
    setPhotoPreview('/amity-building.jpg');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bldg = buildings.find(b => b.id === buildingId);

    const report = addReport({
      location: `${bldg?.name || 'Campus'} - ${roomCode || 'General Area'}`,
      buildingId,
      roomCode,
      category,
      priority,
      description: description || `Issue reported for ${category} at ${roomCode}`,
      reporterName,
      photoUrl: photoPreview || undefined
    });

    setSubmittedReport(report);
  };

  const handleClose = () => {
    setSubmittedReport(null);
    setDescription('');
    setStep(1);
    setPhotoPreview(null);
    setReportModalOpen(false);
  };

  const bldgObj = buildings.find(b => b.id === buildingId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end lg:items-center justify-center p-0 lg:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">MAINTENANCE REPORTING</h2>
              <span className="text-[10px] text-slate-400 font-mono">
                {submittedReport ? 'Dispatched' : `Step ${step} of 6: ${
                  step === 1 ? 'Issue' : step === 2 ? 'Location' : step === 3 ? 'Priority' : step === 4 ? 'Description' : step === 5 ? 'Photo' : 'Submit'
                }`}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors touch-target-48"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {!submittedReport && (
          <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 overflow-x-auto scrollbar-none px-3">
            {[
              { num: 1, label: 'Issue' },
              { num: 2, label: 'Location' },
              { num: 3, label: 'Priority' },
              { num: 4, label: 'Description' },
              { num: 5, label: 'Photo' },
              { num: 6, label: 'Submit' }
            ].map((s) => (
              <div 
                key={s.num} 
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl shrink-0 ${
                  step === s.num ? 'bg-slate-900 text-white shadow-2xs' : step > s.num ? 'text-emerald-700 bg-emerald-50' : ''
                }`}
              >
                <span>{s.num}.</span>
                <span className="text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {submittedReport ? (
            /* Success Ticket Screen */
            <div className="p-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 text-white">
                  TICKET #{submittedReport.id}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">Issue Reported Successfully</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Assigned to Campus Operations Queue. Live telemetry notifications have been dispatched.
                </p>
              </div>

              {/* Status Timeline */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-3">
                <div className="font-bold text-slate-900">Live Status Timeline</div>
                
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                  <div className="p-2 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300">
                    1. REPORTED ●
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
                    2. ASSIGNED
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
                    3. IN PROGRESS
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-400">
                    4. RESOLVED
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full min-h-[48px] rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md transition-colors"
              >
                Return to Campus Twin
              </button>
            </div>
          ) : (
            /* 6-Step Wizard Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* STEP 1: ISSUE CATEGORY */}
              {step === 1 && (
                <div className="space-y-3">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">STEP 1: Select Issue Type</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Broken Light', 'Water Leakage', 'Damaged Desk', 'Wi-Fi Problem', 'AC Problem', 'Cleanliness', 'Other'].map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat as any)}
                        className={`p-3.5 rounded-2xl border text-left font-bold transition-all min-h-[52px] touch-target-48 ${
                          category === cat
                            ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-400/50'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full min-h-[48px] rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Next: Select Location</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">STEP 2: Choose Campus Location</div>
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Building</label>
                    <select
                      value={buildingId}
                      onChange={(e) => setBuildingId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {buildings.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Room / Floor / Area</label>
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      placeholder="e.g. Lab 204 or 2nd Floor Corridor"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Next: Priority</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PRIORITY */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">STEP 3: Urgency / Priority</div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'low', label: 'Low', desc: 'Can be scheduled routinely', color: 'border-slate-300' },
                      { id: 'medium', label: 'Medium', desc: 'Affects daily usage', color: 'border-amber-300' },
                      { id: 'high', label: 'High', desc: 'Urgent attention required', color: 'border-orange-400' },
                      { id: 'urgent', label: 'Urgent', desc: 'Immediate safety hazard', color: 'border-rose-500' }
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setPriority(p.id as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all min-h-[52px] touch-target-48 ${
                          priority === p.id
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{p.label}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">{p.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Next: Description</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DESCRIPTION */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">STEP 4: Describe the Issue</div>
                  
                  <div>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide specific details about the issue (e.g. flickering tube light outside Lab 204 causing eye strain)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reporter Name</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Next: Photo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: PHOTO */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">STEP 5: Attach Photo Evidence</div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {photoPreview ? (
                    <div className="space-y-2">
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200">
                        <img
                          src={photoPreview}
                          alt="Issue Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-900/80 text-white hover:bg-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Photo attached</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-5 border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all min-h-[120px]"
                      >
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">Upload File</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePhotoSimulate}
                        className="p-5 border-2 border-dashed border-amber-200 hover:border-amber-400 bg-amber-50/50 rounded-2xl flex flex-col items-center justify-center text-center gap-2 active:scale-95 transition-all min-h-[120px]"
                      >
                        <Camera className="w-6 h-6 text-amber-600" />
                        <span className="text-xs font-bold text-amber-900">Take Photo</span>
                        <span className="text-[10px] text-amber-700">Attach capture</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(6)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Next: Review & Submit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: SUBMIT REVIEW */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">STEP 6: Final Review & Submit</div>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-extrabold text-slate-900">{category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-bold text-slate-900">{bldgObj?.name} — {roomCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Priority:</span>
                      <span className="font-extrabold uppercase text-amber-700">{priority}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Reporter:</span>
                      <span className="font-semibold text-slate-800">{reporterName}</span>
                    </div>
                    {photoPreview && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Attachment:</span>
                        <span className="font-semibold text-emerald-600">✓ Photo attached</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="flex-1 min-h-[48px] rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 min-h-[48px] rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SUBMIT REPORT</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
