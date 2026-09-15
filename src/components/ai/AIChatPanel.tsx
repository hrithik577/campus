'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Navigation, 
  MapPin, 
  X,
  Mic,
  MicOff,
  AlertCircle,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { processAIQuery } from '../../services/aiAssistantService';
import { calculateCampusRoute } from '../../services/navigationService';
import { voiceNavService } from '../../services/voiceNavigationService';
import { speechRecognitionService } from '../../services/speechRecognitionService';
import { AIResponse } from '../../types/campus';

export const AIChatPanel: React.FC = () => {
  const router = useRouter();
  const { 
    isAiAssistantOpen, 
    setAiAssistantOpen,
    setSelectedBuildingId,
    setSelectedRoom,
    setActiveRoute,
    buildings,
    voiceEnabled,
    setVoiceEnabled
  } = useCampusStore();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [currentlySpeakingIdx, setCurrentlySpeakingIdx] = useState<number | null>(null);
  const [voiceInfo, setVoiceInfo] = useState<{ name: string; isFemale: boolean; displayName: string }>({
    name: 'Aria',
    isFemale: true,
    displayName: 'Aria (Executive Female Voice)'
  });

  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; content: string; responseObj?: AIResponse }[]>([
    {
      sender: 'ai',
      content: 'Greetings. I am **Aria**, your executive campus digital twin AI specialist. You may ask me about hostel residences, mess dining schedules, student mart stationery & printing, College MRC medical clinic, gym facilities, basketball and football grounds, or real-time navigation.'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info = voiceNavService.getVoiceInfo();
      setVoiceInfo(info);
    }
  }, [isAiAssistantOpen]);

  if (!isAiAssistantOpen) return null;

  const speakMessage = (text: string, msgIdx?: number) => {
    if (!voiceNavService.isSupported()) {
      setVoiceNotice("Speech synthesis is unavailable in this browser.");
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }
    const cleanText = text.replace(/[*#]/g, '').substring(0, 260);
    if (msgIdx !== undefined) {
      setCurrentlySpeakingIdx(msgIdx);
    }
    voiceNavService.speak(cleanText, true);
    setTimeout(() => {
      setCurrentlySpeakingIdx(null);
    }, 4500);
  };

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setVoiceNotice(null);

    setTimeout(() => {
      const response = processAIQuery(q);
      const newIdx = messages.length + 1;
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', content: response.text, responseObj: response }
      ]);

      if (response.highlightBuildingId) {
        setSelectedBuildingId(response.highlightBuildingId);
      }

      // Automatically speak with female voice if audio is enabled
      if (voiceEnabled) {
        speakMessage(response.text, newIdx);
      }
    }, 200);
  };

  const toggleMic = () => {
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
      return;
    }

    if (!speechRecognitionService.isSupported()) {
      setVoiceNotice("Voice speech recognition is not supported in this browser.");
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    setIsListening(true);
    setVoiceNotice('Listening with executive speech recognition...');

    speechRecognitionService.startListening(
      (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal) {
          setIsListening(false);
          setVoiceNotice(null);
          handleSend(transcript);
        }
      },
      (err) => {
        setIsListening(false);
        setVoiceNotice(err);
        setTimeout(() => setVoiceNotice(null), 4000);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleViewOnMap = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    const b = buildings.find(item => item.id === buildingId);
    if (b && b.popularRooms.length > 0) {
      setSelectedRoom(b.popularRooms[0]);
    }
    setAiAssistantOpen(false);
    router.push('/explore');
  };

  const handleNavigateToTarget = (targetId: string) => {
    const route = calculateCampusRoute('node-north-gate', targetId, 'fastest');
    if (route) {
      setActiveRoute(route);
    }
    setAiAssistantOpen(false);
    router.push('/navigate');
  };

  const presetPrompts = [
    'Where is the hostel and mess?',
    'What are Student Mart timings?',
    'Where is College MRC & doctor clinic?',
    'Is the Gym available now?',
    'Basketball court & floodlights',
    'Football ground & running track',
    'Nearest computer lab',
    'Central Library study hours'
  ];

  return (
    <div className="fixed inset-0 lg:inset-auto lg:bottom-4 lg:right-4 z-50 w-full max-w-full lg:max-w-md bg-white flex flex-col h-[100dvh] lg:h-[620px] lg:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150 pt-[env(safe-area-inset-top,0px)]">
      
      {/* Header */}
      <div className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-wide">ARIA • CAMPUS AI</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                FEMALE VOICE
              </span>
            </div>
            <span className="text-[10px] text-slate-300 flex items-center gap-1 font-medium">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              <span>Spatial Intelligence Specialist</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Audio Voice Read-Aloud Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const nextState = !voiceEnabled;
              setVoiceEnabled(nextState);
              if (nextState) {
                speakMessage("Audio guidance enabled. Aria female voice ready.");
              } else {
                voiceNavService.cancel();
              }
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              voiceEnabled 
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-400/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={voiceEnabled ? 'Voice enabled (Click to mute)' : 'Voice muted (Click to enable)'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isListening) speechRecognitionService.stopListening();
              voiceNavService.cancel();
              setAiAssistantOpen(false);
            }}
            className="w-9 h-9 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center"
            title="Close AI Assistant"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Voice Status Alert Banner */}
      {voiceNotice && (
        <div className="px-3.5 py-2 bg-cyan-50 border-b border-cyan-200 text-cyan-900 text-xs font-semibold flex items-center gap-2 shrink-0 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-cyan-600 shrink-0" />
          <span className="flex-1 truncate">{voiceNotice}</span>
        </div>
      )}

      {/* Preset Quick Chips Bar */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none px-3.5 shrink-0">
        {presetPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors shadow-2xs active:scale-95 shrink-0 min-h-[34px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-cyan-400'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-2.5 ${
              msg.sender === 'user' 
                ? 'bg-cyan-600 text-white rounded-tr-none font-medium' 
                : 'bg-white border border-slate-200 text-slate-900 shadow-2xs rounded-tl-none'
            }`}>
              <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

              {/* Speak Audio Button for AI Messages */}
              {msg.sender === 'ai' && (
                <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-mono">Amity Spatial Concierge</span>
                  <button
                    type="button"
                    onClick={() => speakMessage(msg.content, idx)}
                    className="flex items-center gap-1 text-[11px] font-bold text-cyan-700 hover:text-cyan-900 px-2 py-1 rounded-lg hover:bg-cyan-50 transition-colors"
                    title="Listen with Aria's female voice"
                  >
                    <Volume2 className={`w-3.5 h-3.5 text-cyan-600 ${currentlySpeakingIdx === idx ? 'animate-bounce' : ''}`} />
                    <span>{currentlySpeakingIdx === idx ? 'Speaking...' : 'Listen'}</span>
                  </button>
                </div>
              )}

              {/* Actionable Destination Card */}
              {msg.responseObj && (() => {
                const targetBldgId = msg.responseObj.highlightBuildingId || msg.responseObj.suggestedAction?.targetId || 'cs-block';
                const targetBldg = buildings.find(b => b.id === targetBldgId);

                return (
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-extrabold text-slate-900 text-xs">
                        {targetBldg ? `${targetBldg.name} (${targetBldg.code})` : 'Target Destination'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {targetBldg ? `${targetBldg.category.toUpperCase()} • ${targetBldg.occupancyPercentage}% Occupied • ● ${targetBldg.status.toUpperCase()}` : 'Campus Facility'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewOnMap(targetBldgId)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-1.5 touch-target-48 active:scale-95"
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                        <span>VIEW ON MAP</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigateToTarget(targetBldgId)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 touch-target-48 active:scale-95 shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                        <span>NAVIGATE</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`w-11 h-11 rounded-xl transition-all shrink-0 touch-target-48 flex items-center justify-center ${
            isListening
              ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
              : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-100'
          }`}
          title={isListening ? 'Stop listening' : 'Speak to Aria AI'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-cyan-600" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 200)}
          placeholder={isListening ? 'Listening to voice...' : 'Ask Aria about hostel, mess, mart, MRC, gym...'}
          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="w-11 h-11 bg-slate-900 hover:bg-cyan-600 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 shadow-md touch-target-48 flex items-center justify-center active:scale-95"
          title="Send"
        >
          <Send className="w-4 h-4 text-cyan-400" />
        </button>
      </form>

    </div>
  );
};
