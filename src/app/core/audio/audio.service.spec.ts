import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;
  let resumeSpy: jasmine.Spy;

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
      resume: jasmine.createSpy('resume').and.returnValue(Promise.resolve()),
      createOscillator: jasmine.createSpy('createOscillator'),
      createGain: jasmine.createSpy('createGain'),
      destination: {},
    };
    mockCtx.createOscillator.and.returnValue({
      type: 'sine',
      frequency: { setValueAtTime: jasmine.createSpy('setValueAtTime') },
      connect: jasmine.createSpy('connect').and.returnValue({
        connect: jasmine.createSpy('connect').and.returnValue({}),
      }),
      start: jasmine.createSpy('start'),
      stop: jasmine.createSpy('stop'),
    });
    mockCtx.createGain.and.returnValue({
      gain: {
        setValueAtTime: jasmine.createSpy('setValueAtTime'),
        exponentialRampToValueAtTime: jasmine.createSpy('exponentialRampToValueAtTime'),
      },
      connect: jasmine.createSpy('connect').and.returnValue({
        connect: jasmine.createSpy('connect').and.returnValue({}),
      }),
    });

    spyOn(window, 'AudioContext').and.returnValue(mockCtx as unknown as AudioContext);
    resumeSpy = mockCtx.resume as jasmine.Spy;
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
});
