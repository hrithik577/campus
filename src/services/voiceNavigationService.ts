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

  private selectPreferredNavigationVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    try {
      // 1. Prefer female English India voice (en-IN)
      const femaleIndianVoice = voices.find(v => {
        const lang = v.lang.toLowerCase().replace('_', '-');
        const name = v.name.toLowerCase();
        const isIndianEnglish = lang.includes('en-in') || lang.includes('en_in');
        const isFemale = name.includes('female') || name.includes('veena') || name.includes('heera') || 
                         name.includes('priya') || name.includes('neerja') || name.includes('aditi');
        return isIndianEnglish && isFemale;
      }) || voices.find(v => {
        const lang = v.lang.toLowerCase().replace('_', '-');
        return lang.includes('en-in');
      });

      if (femaleIndianVoice) return femaleIndianVoice;

      // 2. Prefer known natural female English voices
      const femaleEnglishVoice = voices.find(v => {
        const lang = v.lang.toLowerCase();
        const name = v.name.toLowerCase();
        const isEnglish = lang.startsWith('en');
        const isFemale = name.includes('female') || name.includes('samantha') || name.includes('karen') || 
                         name.includes('victoria') || name.includes('zira') || name.includes('jenny') || 
                         name.includes('ava') || name.includes('moira') || name.includes('tessa') || 
                         name.includes('fiona') || name.includes('serena') || name.includes('stephanie') ||
                         name.includes('siri') || (name.includes('natural') && !name.includes('male'));
        return isEnglish && isFemale;
      });

      if (femaleEnglishVoice) return femaleEnglishVoice;

      // 3. Prefer any high quality English voice
      const anyEnglishVoice = voices.find(v => {
        const lang = v.lang.toLowerCase();
        const name = v.name.toLowerCase();
        return lang.startsWith('en') && (name.includes('google') || name.includes('natural') || lang.includes('en-us') || lang.includes('en-gb'));
      }) || voices.find(v => v.lang.toLowerCase().startsWith('en'));

      if (anyEnglishVoice) return anyEnglishVoice;

      // 4. Fall back gracefully to the browser's default voice
      return voices.find(v => v.default) || voices[0] || null;
    } catch {
      return voices[0] || null;
    }
  }

  private initVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.voice = this.selectPreferredNavigationVoice(voices);
      }
    } catch (e) {
      console.warn('Could not load speech voices:', e);
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
    const clean = instruction.trim();
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
