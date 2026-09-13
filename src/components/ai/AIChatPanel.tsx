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
  Layers, 
  Wrench, 
  X,
  Mic
} from 'lucide-react';
import { useCampusStore } from '../../services/campusStore';
import { processAIQuery } from '../../services/aiAssistantService';
import { calculateCampusRoute } from '../../services/navigationService';
import { AIResponse } from '../../types/campus';

export const AIChatPanel: React.FC = () => {
  const router = useRouter();
  const { 
    isAiAssistantOpen, 
    setAiAssistantOpen,
    setSelectedBuildingId,
    setSelectedRoom,
    setActiveRoute,
    buildings
  } = useCampusStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; content: string; responseObj?: AIResponse }[]>([
    {
      sender: 'ai',
      content: 'Hello! I am your AI Campus Assistant. Ask me anything about your campus spaces, nearest computer labs, cafeteria crowd levels, or walking directions.'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAiAssistantOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const response = processAIQuery(q);
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', content: response.text, responseObj: response }
      ]);

      if (response.highlightBuildingId) {
        setSelectedBuildingId(response.highlightBuildingId);
      }
    }, 250);
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
    const route = calculateCampusRoute('node-north-gate', targetId);
    setActiveRoute(route);
    setAiAssistantOpen(false);
    router.push('/explore');
  };

  const presetPrompts = [
    'Nearest computer lab',
    'Grand Auditorium',
    'Least crowded cafeteria',
    'Library route',
    'Available rooms',
    'Parking'
  ];

  return (
    <div className="fixed inset-0 lg:inset-auto lg:bottom-4 lg:right-4 z-50 w-full max-w-full lg:max-w-md bg-white flex flex-col h-[100dvh] lg:h-[580px] lg:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150 pt-[env(safe-area-inset-top,0px)]">
      
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">CAMPUS AI</h3>
            <span className="text-[10px] text-cyan-400 font-mono">Ask anything about your campus.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAiAssistantOpen(false)}
          className="w-10 h-10 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors touch-target-48 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Chip Bar */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none px-4 shrink-0">
        {presetPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors shadow-2xs active:scale-95 shrink-0 min-h-[40px] touch-target-48"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
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

              {/* Map Interactive Action Buttons */}
              {msg.responseObj && (() => {
                const targetBldgId = msg.responseObj.highlightBuildingId || msg.responseObj.suggestedAction?.targetId || 'cs-block';
                const targetBldg = buildings.find(b => b.id === targetBldgId);

                return (
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-extrabold text-slate-900 text-xs">
                        {targetBldg ? `${targetBldg.name} (${targetBldg.code})` : 'Target Location'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {targetBldg ? `${targetBldg.category.toUpperCase()} • ${targetBldg.occupancyPercentage}% Occupied • ● ${targetBldg.status.toUpperCase()}` : 'Campus Space'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewOnMap(targetBldgId)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-1.5 touch-target-48 active:scale-95"
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                        <span>VIEW ON MAP</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigateToTarget(targetBldgId)}
                        className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 touch-target-48 active:scale-95"
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

      {/* Input Form Stickied at Bottom */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0"
      >
        <button
          type="button"
          onClick={() => handleSend('Where is the nearest computer lab?')}
          className="w-11 h-11 text-slate-400 hover:text-cyan-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0 touch-target-48 flex items-center justify-center"
          title="Voice Prompt"
        >
          <Mic className="w-5 h-5 text-cyan-600" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 200)}
          placeholder="Ask Campus AI..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
        />

        <button
          type="submit"
          className="w-11 h-11 bg-slate-900 hover:bg-cyan-600 text-white rounded-xl transition-colors shrink-0 shadow-md touch-target-48 flex items-center justify-center active:scale-95"
        >
          <Send className="w-4 h-4 text-cyan-400" />
        </button>
      </form>

    </div>
  );
};
