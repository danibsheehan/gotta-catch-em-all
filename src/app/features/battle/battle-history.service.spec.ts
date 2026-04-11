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
});
