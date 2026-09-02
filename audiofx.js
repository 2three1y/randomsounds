// Lightweight Web Audio API sound effects module.
const pick = (items) => items[Math.floor(Math.random() * items.length)];
const between = (min, max) => min + Math.random() * (max - min);

export class SoundEffects {
  constructor({ volume = 0.18 } = {}) { this.volume = volume; this.context = null; }
  #ensureContext() { if (!this.context) this.context = new AudioContext(); if (this.context.state === 'suspended') this.context.resume(); return this.context; }
  #tone({ frequency, duration = 0.08, type = 'sine', slideTo }) {
    const ctx = this.#ensureContext(); const now = ctx.currentTime;
    const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
    gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(this.volume, now + 0.006); gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(ctx.destination); oscillator.start(now); oscillator.stop(now + duration + 0.01);
  }
  click() { this.#tone({ frequency: 900, duration: 0.045, type: 'square', slideTo: 520 }); }
  success() { this.#tone({ frequency: 523.25, duration: 0.09 }); setTimeout(() => this.#tone({ frequency: 783.99, duration: 0.14 }), 70); }
  error() { this.#tone({ frequency: 180, duration: 0.18, type: 'sawtooth', slideTo: 110 }); }
  // Creates a new arcade/chiptune/fuzz texture on every call.
  chaos({ voices = Math.floor(between(2, 6)) } = {}) {
    const ctx = this.#ensureContext(); const now = ctx.currentTime; const duration = between(0.12, 0.65);
    const master = ctx.createGain(); master.gain.setValueAtTime(0.0001, now); master.gain.exponentialRampToValueAtTime(this.volume * 0.7, now + 0.01); master.gain.exponentialRampToValueAtTime(0.0001, now + duration); master.connect(ctx.destination);
    for (let i = 0; i < voices; i += 1) { const osc = ctx.createOscillator(); const gain = ctx.createGain(); const start = now + between(0, 0.04); const length = between(0.06, duration); osc.type = pick(['square', 'sawtooth', 'triangle', 'sine']); osc.frequency.setValueAtTime(between(90, 1400), start); if (Math.random() > 0.35) osc.frequency.exponentialRampToValueAtTime(between(45, 1800), start + length); gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(between(0.15, 0.8), start + 0.005); gain.gain.exponentialRampToValueAtTime(0.0001, start + length); osc.connect(gain).connect(master); osc.start(start); osc.stop(start + length + 0.01); }
    if (Math.random() > 0.45) this.#noise(master, now, duration);
  }
  #noise(destination, start, duration) { const ctx = this.#ensureContext(); const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1; const source = ctx.createBufferSource(); const gain = ctx.createGain(); gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(between(0.05, 0.25), start + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, start + duration); source.buffer = buffer; source.connect(gain).connect(destination); source.start(start); }
  randomSound(options) { this.chaos(options); }
}
export const soundEffects = new SoundEffects();
