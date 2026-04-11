import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const STORAGE_KEY = 'gcea-battle-history-v1';
const MAX_ENTRIES = 3;

export interface BattleHistoryEntry {
  opponentName: string;
  playerName: string;
  playerWon: boolean;
  at: number;
}

@Injectable({
  providedIn: 'root',
})
export class BattleHistoryService {
  private readonly entries$$ = new BehaviorSubject<BattleHistoryEntry[]>(this.readStorage());

  readonly entries$: Observable<BattleHistoryEntry[]> = this.entries$$.asObservable();

  recordMatch(entry: Omit<BattleHistoryEntry, 'at'> & { at?: number }): void {
    const row: BattleHistoryEntry = {
      opponentName: entry.opponentName,
      playerName: entry.playerName,
      playerWon: entry.playerWon,
      at: entry.at ?? Date.now(),
    };
    const next = [row, ...this.entries$$.value].slice(0, MAX_ENTRIES);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode — still show in-memory for this session */
    }
    this.entries$$.next(next);
  }

  private readStorage(): BattleHistoryEntry[] {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .filter(
          (row): row is BattleHistoryEntry =>
            row !== null &&
            typeof row === 'object' &&
            typeof (row as BattleHistoryEntry).opponentName === 'string' &&
            typeof (row as BattleHistoryEntry).playerName === 'string' &&
            typeof (row as BattleHistoryEntry).playerWon === 'boolean' &&
            typeof (row as BattleHistoryEntry).at === 'number',
        )
        .slice(0, MAX_ENTRIES);
    } catch {
      return [];
    }
  }
}
