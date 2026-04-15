import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { BattleHistoryService } from './battle-history.service';

describe('BattleHistoryService', () => {
  let service: BattleHistoryService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleHistoryService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should start with empty entries', async () => {
    const entries = await firstValueFrom(service.entries$);
    expect(entries).toEqual([]);
  });

  it('should record matches newest-first and cap at 3', async () => {
    service.recordMatch({ opponentName: 'a', playerName: 'x', playerWon: true });
    service.recordMatch({ opponentName: 'b', playerName: 'y', playerWon: false });
    service.recordMatch({ opponentName: 'c', playerName: 'z', playerWon: true });
    service.recordMatch({ opponentName: 'd', playerName: 'w', playerWon: false });

    const entries = await firstValueFrom(service.entries$);
    expect(entries.length).toBe(3);
    expect(entries[0].opponentName).toBe('d');
    expect(entries[1].opponentName).toBe('c');
    expect(entries[2].opponentName).toBe('b');
  });

  it('should persist to sessionStorage', () => {
    service.recordMatch({ opponentName: 'eevee', playerName: 'mew', playerWon: true });
    const raw = sessionStorage.getItem('gcea-battle-history-v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed[0].opponentName).toBe('eevee');
    expect(parsed[0].playerName).toBe('mew');
    expect(parsed[0].playerWon).toBe(true);
  });

  describe('readStorage (session rehydration)', () => {
    it('should rehydrate valid entries from sessionStorage on construction', async () => {
      sessionStorage.setItem(
        'gcea-battle-history-v1',
        JSON.stringify([
          { opponentName: 'a', playerName: 'x', playerWon: true, at: 10 },
          { opponentName: 'b', playerName: 'y', playerWon: false, at: 20 },
        ]),
      );
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(BattleHistoryService);

      expect(await firstValueFrom(fresh.entries$)).toEqual([
        { opponentName: 'a', playerName: 'x', playerWon: true, at: 10 },
        { opponentName: 'b', playerName: 'y', playerWon: false, at: 20 },
      ]);
    });

    it('should yield an empty list when stored JSON is invalid', async () => {
      sessionStorage.setItem('gcea-battle-history-v1', '{ not valid json');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(BattleHistoryService);

      expect(await firstValueFrom(fresh.entries$)).toEqual([]);
    });

    it('should yield an empty list when stored value is not an array', async () => {
      sessionStorage.setItem('gcea-battle-history-v1', JSON.stringify({ rows: [] }));
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(BattleHistoryService);

      expect(await firstValueFrom(fresh.entries$)).toEqual([]);
    });

    it('should filter out rows that do not match BattleHistoryEntry', async () => {
      sessionStorage.setItem(
        'gcea-battle-history-v1',
        JSON.stringify([
          { opponentName: 'good', playerName: 'ok', playerWon: true, at: 1 },
          { opponentName: 'incomplete' },
          null,
          'not-an-object',
          { opponentName: 'also', playerName: 'fine', playerWon: false, at: 2 },
        ]),
      );
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(BattleHistoryService);

      expect(await firstValueFrom(fresh.entries$)).toEqual([
        { opponentName: 'good', playerName: 'ok', playerWon: true, at: 1 },
        { opponentName: 'also', playerName: 'fine', playerWon: false, at: 2 },
      ]);
    });

    it('should keep at most 3 entries when reading from storage', async () => {
      sessionStorage.setItem(
        'gcea-battle-history-v1',
        JSON.stringify([
          { opponentName: '1', playerName: 'a', playerWon: true, at: 1 },
          { opponentName: '2', playerName: 'b', playerWon: false, at: 2 },
          { opponentName: '3', playerName: 'c', playerWon: true, at: 3 },
          { opponentName: '4', playerName: 'd', playerWon: false, at: 4 },
        ]),
      );
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(BattleHistoryService);

      const entries = await firstValueFrom(fresh.entries$);
      expect(entries.length).toBe(3);
      expect(entries.map((e) => e.opponentName)).toEqual(['1', '2', '3']);
    });
  });
});
