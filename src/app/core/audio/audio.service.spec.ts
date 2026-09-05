import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;
  let resumeSpy: Mock;

  beforeEach(() => {
    try {
      localStorage.removeItem('gcea-sound-effects');
    } catch {
      /* ignore */
    }

    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioService);

    const mockCtx = {
      state: 'running',
      currentTime: 0,
      resume: vi.fn().mockName('resume').mockResolvedValue(undefined),
      createOscillator: vi.fn().mockName('createOscillator'),
      createGain: vi.fn().mockName('createGain'),
      destination: {},
    };
    mockCtx.createOscillator.mockReturnValue({
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn().mockName('setValueAtTime'),
        exponentialRampToValueAtTime: vi.fn().mockName('exponentialRampToValueAtTime'),
      },
      connect: vi
        .fn()
        .mockName('connect')
        .mockReturnValue({
          connect: vi.fn().mockName('connect').mockReturnValue({}),
        }),
      start: vi.fn().mockName('start'),
      stop: vi.fn().mockName('stop'),
    });
    mockCtx.createGain.mockReturnValue({
      gain: {
        setValueAtTime: vi.fn().mockName('setValueAtTime'),
        exponentialRampToValueAtTime: vi.fn().mockName('exponentialRampToValueAtTime'),
      },
      connect: vi
        .fn()
        .mockName('connect')
        .mockReturnValue({
          connect: vi.fn().mockName('connect').mockReturnValue({}),
        }),
    });

    vi.spyOn(window, 'AudioContext').mockImplementation(function AudioContextMock(this: any) {
      Object.assign(this, mockCtx);
      return mockCtx;
    } as unknown as () => AudioContext);
    resumeSpy = mockCtx.resume as Mock;
  });

  it('should create with sound off by default when storage is empty', () => {
    expect(service.isSoundEnabled()).toBe(false);
  });

  it('should persist setSoundEnabled', () => {
    service.setSoundEnabled(true, true);
    expect(service.isSoundEnabled()).toBe(true);
    expect(localStorage.getItem('gcea-sound-effects')).toBe('1');

    service.setSoundEnabled(false);
    expect(service.isSoundEnabled()).toBe(false);
    expect(localStorage.getItem('gcea-sound-effects')).toBe('0');
  });

  it('should call resume when playing UI tick while enabled', () => {
    service.setSoundEnabled(true, true);
    service.playUiTick();
    expect(resumeSpy).toHaveBeenCalled();
  });

  it('should not resume when playing battle result while disabled', () => {
    service.setSoundEnabled(false);
    service.playBattleResult(true);
    expect(resumeSpy).not.toHaveBeenCalled();
  });

  it('playUiTick should create one oscillator and one gain node and connect/start/stop them', async () => {
    service.setSoundEnabled(true, true);
    const ctx = (service as unknown as { ctx: any }).ctx;

    service.playUiTick();
    await Promise.resolve();

    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
    expect(ctx.createGain).toHaveBeenCalledTimes(1);
    const osc = ctx.createOscillator.mock.results[0].value;
    expect(osc.start).toHaveBeenCalledTimes(1);
    expect(osc.stop).toHaveBeenCalledTimes(1);
  });

  it('playBattleResult(true) should create three oscillator/gain pairs for the win jingle', async () => {
    service.setSoundEnabled(true, true);
    const ctx = (service as unknown as { ctx: any }).ctx;

    service.playBattleResult(true);
    await Promise.resolve();

    expect(ctx.createOscillator).toHaveBeenCalledTimes(3);
    expect(ctx.createGain).toHaveBeenCalledTimes(3);
  });

  it('playBattleResult(false) should create two oscillator/gain pairs for the loss jingle', async () => {
    service.setSoundEnabled(true, true);
    const ctx = (service as unknown as { ctx: any }).ctx;

    service.playBattleResult(false);
    await Promise.resolve();

    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
    expect(ctx.createGain).toHaveBeenCalledTimes(2);
  });

  it('should not attach a second unlock listener when one is already attached', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    service.setSoundEnabled(true, true);
    addEventListenerSpy.mockClear();

    service.setSoundEnabled(true);

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('should resume the audio context on first gesture after enabling without a user gesture, then stop listening', () => {
    service.setSoundEnabled(true);
    expect(resumeSpy).not.toHaveBeenCalled();

    document.dispatchEvent(new Event('pointerdown'));
    expect(resumeSpy).toHaveBeenCalledTimes(1);

    document.dispatchEvent(new Event('pointerdown'));
    expect(resumeSpy).toHaveBeenCalledTimes(1);
  });

  it('should fall back to webkitAudioContext when AudioContext is unavailable', () => {
    const webkitCtxStub = { resume: vi.fn().mockResolvedValue(undefined) };
    const webkitCtor = vi.fn().mockImplementation(function WebkitAudioContextMock(this: any) {
      Object.assign(this, webkitCtxStub);
      return webkitCtxStub;
    } as unknown as () => AudioContext);
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', webkitCtor);
    try {
      service.setSoundEnabled(true, true);
      expect(webkitCtor).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('should no-op safely when neither AudioContext nor webkitAudioContext exist', async () => {
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', undefined);
    try {
      service.setSoundEnabled(true, true);
      service.playUiTick();
      await Promise.resolve();

      expect(resumeSpy).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
