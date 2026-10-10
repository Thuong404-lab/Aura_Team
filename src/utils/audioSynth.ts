/**
 * Traditional Vietnamese Web Audio API Sound Engine
 * Features:
 * 1. Background Music System with Ambient Silk Drones & Traditional Pentatonic Melodies (Đàn Tranh, Đàn Bầu).
 * 2. Crossfade & Fade-In/Fade-Out transitions when navigating between screens (Home, Fitting Room, Lookbook).
 * 3. Interactive Sound Effects (Cloud parting chimes, string plucks, silk flutter).
 */

export type ScreenAudioTheme = 'home' | 'fitting' | 'lookbook';

interface ThemeConfig {
  name: string;
  droneRoot: number; // Hz (Base root drone)
  droneFifth: number; // Hz (Harmonic fifth)
  notes: number[]; // Pentatonic scale notes
  tempoMs: [number, number]; // Min and max note delay
  filterFreq: number; // Lowpass filter cutoff
}

const THEMES: Record<ScreenAudioTheme, ThemeConfig> = {
  // 1. Home: Cung Điện Hoàng Triều (Uy nghiêm, thanh bình, D Pentatonic: D, E, F#, A, B, D)
  home: {
    name: 'Cung Điện Hoàng Triều',
    droneRoot: 146.83, // D3
    droneFifth: 220.0, // A3
    notes: [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99],
    tempoMs: [2400, 4200],
    filterFreq: 680,
  },
  // 2. Fitting Room: Thiền Phong Lụa Là (Tinh tế, mờ ảo, E Minor Pentatonic: E, G, A, B, D)
  fitting: {
    name: 'Thiền Phong Lụa Là',
    droneRoot: 164.81, // E3
    droneFifth: 246.94, // B3
    notes: [329.63, 392.0, 440.0, 493.88, 587.33, 659.25, 783.99],
    tempoMs: [2200, 3800],
    filterFreq: 520,
  },
  // 3. Lookbook: Khúc Ca Di Sản (Trang trọng, rực rỡ, G Pentatonic: G, A, B, D, E)
  lookbook: {
    name: 'Khúc Ca Di Sản',
    droneRoot: 196.0, // G3
    droneFifth: 293.66, // D4
    notes: [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0],
    tempoMs: [2000, 3600],
    filterFreq: 820,
  },
};

class TraditionalSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTheme: ScreenAudioTheme = 'home';

  // Gain Nodes
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private fxGain: GainNode | null = null;

  // Drone Nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  // Melody Loop Timer
  private melodyTimer: number | null = null;

  // Initialize or retrieve Web Audio Context
  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output graph
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music sub-mix with dedicated gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // FX sub-mix with dedicated gain
      this.fxGain = this.ctx.createGain();
      this.fxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.fxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  // =========================================================================
  // 1. BACKGROUND MUSIC & CROSSFADE SYSTEM
  // =========================================================================

  /**
  /**
   * Start background music - DISABLED as per user request (web does not need music)
   */
  public startAmbiance(_theme: ScreenAudioTheme = this.currentTheme, _fadeDuration = 1.5) {
    this.stopAmbiance();
  }

  /**
   * Stop background music with immediate silence
   */
  public stopAmbiance(_fadeDuration = 0.2) {
    this.isPlaying = false;

    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }

    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(0, now);
    }

    this.teardownDrone();
  }

  /**
   * Screen transition - Background music disabled
   */
  public transitionToScreen(newScreen: ScreenAudioTheme, _fadeDuration = 1.2) {
    this.currentTheme = newScreen;
  }

  /**
   * Toggle music on/off - Always remains off
   */
  public toggleAmbiance(onStateChange?: (playing: boolean) => void): boolean {
    this.stopAmbiance();
    onStateChange?.(false);
    return false;
  }

  // =========================================================================
  // 2. INTERNAL SYNTHESIS: DRONE & TRADITIONAL PLUCKS
  // =========================================================================

  private setupDrone(theme: ScreenAudioTheme) {
    const ctx = this.getAudioContext();
    this.teardownDrone();

    const config = THEMES[theme];

    this.droneFilter = ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(config.filterFreq, ctx.currentTime);
    this.droneFilter.Q.setValueAtTime(2.5, ctx.currentTime);

    // Oscillator 1: Root note (Sine)
    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(config.droneRoot, ctx.currentTime);

    // Oscillator 2: Fifth harmonic (Warm triangle)
    this.droneOsc2 = ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(config.droneFifth, ctx.currentTime);

    if (this.musicGain) {
      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.musicGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
    }
  }

  private retuneDrone(theme: ScreenAudioTheme) {
    if (!this.ctx || !this.droneOsc1 || !this.droneOsc2 || !this.droneFilter) {
      this.setupDrone(theme);
      return;
    }

    const config = THEMES[theme];
    const now = this.ctx.currentTime;

    // Smooth glissando retuning of the drone
    this.droneOsc1.frequency.linearRampToValueAtTime(config.droneRoot, now + 0.6);
    this.droneOsc2.frequency.linearRampToValueAtTime(config.droneFifth, now + 0.6);
    this.droneFilter.frequency.linearRampToValueAtTime(config.filterFreq, now + 0.6);
  }

  private teardownDrone() {
    try {
      if (this.droneOsc1) {
        this.droneOsc1.stop();
        this.droneOsc1.disconnect();
        this.droneOsc1 = null;
      }
      if (this.droneOsc2) {
        this.droneOsc2.stop();
        this.droneOsc2.disconnect();
        this.droneOsc2 = null;
      }
      if (this.droneFilter) {
        this.droneFilter.disconnect();
        this.droneFilter = null;
      }
    } catch {
      // Safe cleanup
    }
  }

  private scheduleNextPluck() {
    if (!this.isPlaying) return;

    const config = THEMES[this.currentTheme];
    const notes = config.notes;
    const note = notes[Math.floor(Math.random() * notes.length)];

    // Play subtle plucked chime
    this.playBackgroundPluck(note);

    // Schedule next note with humanized tempo
    const [minMs, maxMs] = config.tempoMs;
    const delay = minMs + Math.random() * (maxMs - minMs);
    this.melodyTimer = window.setTimeout(() => {
      this.scheduleNextPluck();
    }, delay);
  }

  private playBackgroundPluck(freq: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Traditional Vietnamese bending ornament (nhấn nhá dây tơ)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.018, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 2.5);
    } catch {
      // Safe handling
    }
  }

  // =========================================================================
  // 3. SOUND EFFECTS (SFX)
  // =========================================================================

  /**
   * Play interactive button/card pluck chime (Đàn Tranh pluck) - DISABLED per user request
   */
  public playPluck(_freq?: number) {
    // Sound effects completely muted
  }

  /**
   * Play subtle soft silk rustle / fabric flutter sound on hover - DISABLED per user request
   */
  public playSilkFlutter() {
    // Sound effects completely muted
  }

  /**
   * Play royal cloud parted chime - DISABLED per user request
   */
  public playCloudPartChime() {
    // Sound effects completely muted
  }

  public getStatus() {
    return this.isPlaying;
  }

  public getCurrentTheme(): ScreenAudioTheme {
    return this.currentTheme;
  }

  public getThemeName(theme: ScreenAudioTheme = this.currentTheme): string {
    return THEMES[theme].name;
  }
}

export const soundEngine = new TraditionalSoundEngine();
export default soundEngine;
