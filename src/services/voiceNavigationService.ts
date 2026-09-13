// Voice Navigation Service for CAMPUS TWIN
// Handles speech synthesis for turn-by-turn guidance and navigation milestones

export type VoiceNavigationEvent = 
  | 'start'
  | 'step'
  | 'approaching'
  | 'entrance'
  | 'floor'
  | 'arrival'
  | 'reroute'
  | 'offroute'
  | 'paused'
  | 'resumed';

class VoiceNavigationService {
  private isEnabled: boolean = true;
  private speechRate: number = 1.0;
  private speechPitch: number = 1.0;
  private voice: SpeechSynthesisVoice | null = null;
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;
  private isSpeakingNow: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('campustwin_voice_enabled');
        if (stored !== null) {
          this.isEnabled = stored === 'true';
        }
      } catch (e) {
        // ignore localStorage access errors
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoice();
        };
        this.initVoice();
      }
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prefer natural English voices (Google US English, Samantha, Siri, etc.)
      const preferred = voices.find(v => 
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))) ||
        v.lang === 'en-US' || 
        v.lang === 'en-GB'
      );
      this.voice = preferred || voices.find(v => v.lang.startsWith('en')) || voices[0];
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setIsEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('campustwin_voice_enabled', String(enabled));
      } catch (e) {
        // ignore
      }
      if (!enabled) {
        this.cancel();
      }
    }
  }

  public setSpeed(rate: number) {
    this.speechRate = Math.max(0.7, Math.min(rate, 1.5));
  }

  public speak(text: string, force: boolean = false) {
    if (!this.isEnabled || !this.isSupported()) return;

    const now = Date.now();
    // Throttle identical speech within 3 seconds unless forced
    if (!force && text === this.lastSpokenText && now - this.lastSpokenTime < 3000) {
      return;
    }

    this.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.speechRate;
      utterance.pitch = this.speechPitch;
      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onstart = () => {
        this.isSpeakingNow = true;
      };

      utterance.onend = () => {
        this.isSpeakingNow = false;
      };

      utterance.onerror = (e) => {
        this.isSpeakingNow = false;
        console.warn('Speech synthesis error, continuing navigation silently:', e);
      };

      this.lastSpokenText = text;
      this.lastSpokenTime = now;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Voice navigation speech could not be started:', err);
    }
  }

  public cancel() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.isSpeakingNow = false;
  }

  // Navigation-specific semantic speech handlers
  public onNavigationStart(destinationName: string) {
    this.speak(`Starting navigation to ${destinationName}.`, true);
  }

  public onStepChange(instruction: string, distanceMeters?: number) {
    let clean = instruction.trim();
    if (distanceMeters && distanceMeters > 0) {
      this.speak(`${clean}`);
    } else {
      this.speak(clean);
    }
  }

  public onApproachingTurn(directionText: string, distanceMeters: number) {
    this.speak(`In ${distanceMeters} meters, ${directionText}.`);
  }

  public onBuildingEntrance(buildingName: string) {
    this.speak(`Entering ${buildingName}.`, true);
  }

  public onFloorTransition(floorNumber: number | string) {
    const floorLabel = floorNumber === 0 ? 'Ground Floor' : `Floor ${floorNumber}`;
    this.speak(`Take the stairs or elevator to ${floorLabel}.`, true);
  }

  public onArrival(destinationName: string) {
    this.speak(`You have arrived at ${destinationName}. Navigation complete.`, true);
  }

  public onReroute() {
    this.speak(`Rerouting to find best path.`, true);
  }

  public onOffRoute() {
    this.speak(`Route changed. Recalculating path.`, true);
  }
}

export const voiceNavService = new VoiceNavigationService();
