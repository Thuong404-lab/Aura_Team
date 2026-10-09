// Soothing Vietnamese traditional ambient chime synthesis using Web Audio API
class TraditionalSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;

  // Traditional Vietnamese Pentatonic Scale (Hò - Xự - Xang - Xê - Cống / Cung - Thương - Giốc - Chủy - Vũ)
  // Base frequencies around D4, F4, G4, A4, C5, D5
  private notes = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46, 783.99];

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a gentle traditional string chime (Đàn Tranh / Đàn Nguyệt pluck)
  public playPluck(freq?: number) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const f = freq || this.notes[Math.floor(Math.random() * this.notes.length)];
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      // Gentle pitch bend like string bending (nhấn nhá đàn tranh)
      osc.frequency.exponentialRampToValueAtTime(f * 1.015, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(f, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    } catch {
      // Audio not permitted yet or unsupported
    }
  }

  // Play subtle soft silk rustle / fabric flutter sound on hover
  public playSilkFlutter() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Gentle airy harmonic frequency
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
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Audio not permitted yet
    }
  }

  // Play royal cloud parted chime (majestic pentatonic ascending harp + gong chime)
  public playCloudPartChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Pentatonic chord cascade: D4, G4, A4, D5, E5, A5
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
        gain.connect(ctx.destination);

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
      gongGain.connect(ctx.destination);

      gongOsc.start(now);
      gongOsc.stop(now + 3.3);
    } catch {
      // Audio not permitted yet
    }
  }

  // Toggle relaxing background melody
  public toggleAmbiance(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isPlaying) {
      this.stopAmbiance();
      onStateChange?.(false);
      return false;
    } else {
      this.startAmbiance();
      onStateChange?.(true);
      return true;
    }
  }

  public startAmbiance() {
    this.isPlaying = true;
    const playNext = () => {
      if (!this.isPlaying) return;
      this.playPluck();
      // Schedule next note between 1.8s and 3.6s
      const delay = 1800 + Math.random() * 2000;
      this.timer = window.setTimeout(playNext, delay);
    };
    playNext();
  }

  public stopAmbiance() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const soundEngine = new TraditionalSoundEngine();
