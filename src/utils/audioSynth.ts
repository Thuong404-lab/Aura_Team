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
   * Start background music with smooth fade-in
   */
  public startAmbiance(theme: ScreenAudioTheme = this.currentTheme, fadeDuration = 1.5) {
    const ctx = this.getAudioContext();
    this.currentTheme = theme;
    this.isPlaying = true;

    // Start ambient continuous drone
    this.setupDrone(theme);

    // Fade-in music gain smoothly
    if (this.musicGain) {
      const now = ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(0.0001, now);
      this.musicGain.gain.linearRampToValueAtTime(0.18, now + fadeDuration);
    }

    // Start melodic pentatonic pluck loop
    this.scheduleNextPluck();
  }

  /**
   * Stop background music with smooth fade-out
   */
  public stopAmbiance(fadeDuration = 1.0) {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;

    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }

    if (this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

      setTimeout(() => {
        if (!this.isPlaying) {
          this.teardownDrone();
        }
      }, fadeDuration * 1000 + 50);
    }
  }

  /**
   * Seamlessly crossfade between screen musical themes when user navigates
   * @param newScreen Target screen theme ('home' | 'fitting' | 'lookbook')
   * @param fadeDuration Total crossfade time in seconds (default: 1.2s)
   */
  public transitionToScreen(newScreen: ScreenAudioTheme, fadeDuration = 1.2) {
    if (this.currentTheme === newScreen) return;
    this.currentTheme = newScreen;

    if (!this.isPlaying || !this.ctx || !this.musicGain) {
      return;
    }

    const now = this.ctx.currentTime;
    const halfDuration = fadeDuration * 0.5;

    // Phase 1: Fade down current theme slightly
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(0.04, now + halfDuration);

    // Switch drone frequencies and filter smoothly at the midpoint
    setTimeout(() => {
      if (!this.isPlaying || !this.ctx) return;
      this.retuneDrone(newScreen);

      // Phase 2: Fade back up into the new theme
      const midNow = this.ctx.currentTime;
      if (this.musicGain) {
        this.musicGain.gain.cancelScheduledValues(midNow);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, midNow);
        this.musicGain.gain.linearRampToValueAtTime(0.18, midNow + halfDuration);
      }
    }, halfDuration * 1000);
  }

  /**
   * Toggle music on/off with fade
   */
  public toggleAmbiance(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isPlaying) {
      this.stopAmbiance();
      onStateChange?.(false);
      return false;
    } else {
      this.startAmbiance(this.currentTheme);
      onStateChange?.(true);
      return true;
    }
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
   * Play interactive button/card pluck chime (Đàn Tranh pluck)
   */
  public playPluck(freq?: number) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const notes = THEMES[this.currentTheme].notes;
      const f = freq || notes[Math.floor(Math.random() * notes.length)];

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * 1.015, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(f, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      if (this.fxGain) {
        gain.connect(this.fxGain);
      } else {
        gain.connect(ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 2.1);
    } catch {
      // Audio not permitted yet
    }
  }

  /**
   * Play subtle soft silk rustle / fabric flutter sound on hover
   */
  public playSilkFlutter() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.0005, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      if (this.fxGain) {
        gain.connect(this.fxGain);
      } else {
        gain.connect(ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Audio not permitted yet
    }
  }

  /**
   * Play royal cloud parted chime (pentatonic ascending harp + ceremonial gong)
   */
  public playCloudPartChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const chord = [293.66, 392.0, 440.0, 587.33, 659.25, 880.0];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.008, startTime + 0.15);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.09 / (idx * 0.25 + 1), startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + 2.5);

        osc.connect(gain);
        if (this.fxGain) {
          gain.connect(this.fxGain);
        } else {
          gain.connect(ctx.destination);
        }

        osc.start(startTime);
        osc.stop(startTime + 2.6);
      });

      // Warm gong sub-tone
      const gongOsc = ctx.createOscillator();
      const gongGain = ctx.createGain();
      gongOsc.type = 'sine';
      gongOsc.frequency.setValueAtTime(146.83, now); // D3
      gongGain.gain.setValueAtTime(0.0001, now);
      gongGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gongGain.gain.exponentialRampToValueAtTime(0.00001, now + 3.2);

      gongOsc.connect(gongGain);
      if (this.fxGain) {
        gongGain.connect(this.fxGain);
      } else {
        gongGain.connect(ctx.destination);
      }

      gongOsc.start(now);
      gongOsc.stop(now + 3.3);
    } catch {
      // Audio not permitted yet
    }
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
