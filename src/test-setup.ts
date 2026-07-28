/**
 * Vitest + jsdom shims for APIs used by the app / Angular (@defer viewport, scroll, Web Audio).
 */

/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

class IntersectionObserverStub {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};
}

if (typeof globalThis.AudioContext === 'undefined') {
  globalThis.AudioContext = class AudioContextStub {
    state = 'running';
    currentTime = 0;
    destination = {};
    resume(): Promise<void> {
      return Promise.resolve();
    }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime() {} },
        connect() {
          return {
            connect() {
              return {};
            },
          };
        },
        start() {},
        stop() {},
      };
    }
    createGain() {
      return {
        gain: {
          setValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
        connect() {
          return {
            connect() {
              return {};
            },
          };
        },
      };
    }
  } as unknown as typeof AudioContext;
}
