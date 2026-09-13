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
  Trash2
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

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
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
      } else {
        setRoomCode('General Area');
      }
    }
  }, [isReportModalOpen, selectedBuildingId, selectedRoom]);

  if (!isReportModalOpen) return null;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    // Simulate attaching a photo taken from smartphone camera
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end lg:items-center justify-center p-0 lg:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">REPORT CAMPUS ISSUE</h2>
              <span className="text-[10px] text-slate-400 font-mono">Operations Dispatch • Step {step} of 4</span>
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
          <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-around text-xs font-bold text-slate-500">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl ${
                  step === s ? 'bg-slate-900 text-white shadow-2xs' : step > s ? 'text-emerald-700 bg-emerald-50' : ''
                }`}
              >
                <span>{s}</span>
                <span className="hidden sm:inline">
                  {s === 1 ? 'Issue' : s === 2 ? 'Where' : s === 3 ? 'Priority' : 'Details'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {submittedReport ? (
            /* Success Ticket Screen */
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 text-white">
                  TICKET #{submittedReport.id}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">Issue Reported Successfully</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Assigned to Campus Operations Queue. You will receive live telemetry notifications.
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
            /* Step-by-Step Wizard */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* STEP 1: CATEGORY SELECTION TILES */}
              {step === 1 && (
                <div className="space-y-3">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">Step 1: What's wrong?</div>
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
                  <div className="text-xs font-extrabold text-slate-900 uppercase">Step 2: Where is the issue?</div>
                  
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
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Room / Floor</label>
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
                      <span>Next: Urgency</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PRIORITY */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">Step 3: Select Priority</div>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'low', label: 'Low Urgency', desc: 'Standard maintenance check' },
                      { key: 'medium', label: 'Medium Priority', desc: 'Affects daily classes & study work' },
                      { key: 'high', label: 'High Priority', desc: 'Requires immediate dispatch' },
                      { key: 'urgent', label: 'Urgent Safety Hazard', desc: 'Water leak or electrical hazard' }
                    ].map((p) => (
                      <div
                        key={p.key}
                        onClick={() => setPriority(p.key as any)}
                        className={`p-3.5 rounded-2xl border cursor-pointer font-semibold transition-all touch-target-48 ${
                          priority === p.key
                            ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400/50'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="font-extrabold text-slate-900">{p.label}</div>
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">{p.desc}</div>
                      </div>
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
                      <span>Next: Details & Photo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DESCRIPTION & MOBILE PHOTO ATTACHMENT */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-900 uppercase">Step 4: Final Details & Photo</div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what is broken..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-medium outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Photo Attachment Picker (Real File + Camera Simulation) */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Attach Photo (Optional)</label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    {photoPreview ? (
                      <div className="space-y-2">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-300 h-36 w-full bg-slate-900">
                          <Image src={photoPreview} alt="Attached issue photo" fill className="object-cover" />
                          <div className="absolute top-2 right-2 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2.5 py-1.5 bg-slate-900/85 hover:bg-slate-900 text-white rounded-xl text-[10px] font-bold shadow-md flex items-center gap-1 touch-target-48"
                            >
                              <Camera className="w-3.5 h-3.5 text-cyan-400" />
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => setPhotoPreview(null)}
                              className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl shadow-md touch-target-48"
                              title="Remove photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Photo attached successfully
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="min-h-[52px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition-colors touch-target-48 active:scale-95"
                        >
                          <Camera className="w-4 h-4 text-cyan-600" />
                          <span>ADD PHOTO</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePhotoSimulate}
                          className="min-h-[52px] rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 transition-colors touch-target-48 active:scale-95"
                        >
                          <Upload className="w-4 h-4 text-amber-600" />
                          <span>Sample Photo</span>
                        </button>
                      </div>
                    )}
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
                      type="submit"
                      className="flex-1 min-h-[48px] rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md"
                    >
                      Submit Ticket
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
