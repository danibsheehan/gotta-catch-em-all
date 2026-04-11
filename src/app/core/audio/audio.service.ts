import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'gcea-sound-effects';

/**
 * Optional arcade-style UI ticks and battle result stings (Web Audio API).
 * Off by default; persisted in session storage. Playback is skipped until the
 * audio context is allowed (user gesture unlocks).
 */
@Injectable({ providedIn: 'root' })
export class AudioService implements OnDestroy {
  private readonly enabled$ = new BehaviorSubject<boolean>(false);
  readonly soundEnabled$: Observable<boolean> = this.enabled$.asObservable();

  private ctx: AudioContext | null = null;
  private unlockListener?: () => void;

  constructor() {
    this.enabled$.next(this.readStored());
    if (this.enabled$.value) {
      this.attachUnlockOnFirstGesture();
    }
  }

  ngOnDestroy(): void {
    this.detachUnlockListener();
  }

  isSoundEnabled(): boolean {
    return this.enabled$.value;
  }

  /**
   * @param fromUserGesture pass true when the change comes from the settings control (click/keyboard).
   */
  setSoundEnabled(enabled: boolean, fromUserGesture = false): void {
    this.enabled$.next(enabled);
    this.writeStored(enabled);
    if (enabled) {
      if (fromUserGesture) {
        void this.resumeContext();
      }
      this.attachUnlockOnFirstGesture();
    } else {
      this.detachUnlockListener();
    }
  }

  /** Short tick for primary UI actions (e.g. confirming a pick). */
  playUiTick(): void {
    this.withRunningContext((ctx) => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(210, t + 0.055);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.11, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  /** Win / loss sting when the battle outcome is revealed. */
  playBattleResult(playerWon: boolean): void {
    this.withRunningContext((ctx) => {
      const start = ctx.currentTime;
      if (playerWon) {
        const freqs = [523.25, 659.25, 783.99];
        freqs.forEach((freq, i) => {
          const t0 = start + i * 0.065;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t0);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.018);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.28);
        });
      } else {
        const notes: [number, number][] = [
          [392, 0],
          [311.13, 0.16],
        ];
        notes.forEach(([freq, delay]) => {
          const t0 = start + delay;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t0);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.1, t0 + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.38);
        });
      }
    });
  }

  private readStored(): boolean {
    try {
      return globalThis.localStorage?.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private writeStored(enabled: boolean): void {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, enabled ? '1' : '0');
    } catch {
      /* ignore quota / private mode */
    }
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx) {
      return this.ctx;
    }
    const Ctor =
      globalThis.AudioContext ??
      (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      return null;
    }
    this.ctx = new Ctor();
    return this.ctx;
  }

  private async resumeContext(): Promise<void> {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }
    try {
      await ctx.resume();
    } catch {
      /* ignore */
    }
  }

  /**
   * If sound was left on from a prior visit, the first pointer interaction
   * resumes the context so delayed battle audio can play later.
   */
  private attachUnlockOnFirstGesture(): void {
    if (this.unlockListener || !this.enabled$.value) {
      return;
    }
    const onGesture = (): void => {
      void this.resumeContext();
      this.detachUnlockListener();
    };
    document.addEventListener('pointerdown', onGesture, { passive: true });
    document.addEventListener('keydown', onGesture);
    this.unlockListener = (): void => {
      document.removeEventListener('pointerdown', onGesture);
      document.removeEventListener('keydown', onGesture);
      this.unlockListener = undefined;
    };
  }

  private detachUnlockListener(): void {
    this.unlockListener?.();
  }

  private withRunningContext(play: (ctx: AudioContext) => void): void {
    if (!this.enabled$.value) {
      return;
    }
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }
    void ctx.resume().then(() => {
      try {
        play(ctx);
      } catch {
        /* ignore synthesis errors */
      }
    });
  }
}
