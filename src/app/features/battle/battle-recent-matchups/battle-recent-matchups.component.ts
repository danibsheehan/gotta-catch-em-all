import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BattleHistoryEntry, BattleHistoryService } from '../battle-history.service';

@Component({
    selector: 'app-battle-recent-matchups',
    templateUrl: './battle-recent-matchups.component.html',
    styleUrls: ['./battle-recent-matchups.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AsyncPipe],
})
export class BattleRecentMatchupsComponent {
  readonly history$ = this.battleHistory.entries$;

  constructor(private battleHistory: BattleHistoryService) {}

  formatLine(entry: BattleHistoryEntry): string {
    const you = this.titleCase(entry.playerName);
    const them = this.titleCase(entry.opponentName);
    return entry.playerWon
      ? `${you} out-sp.atk’d ${them} — win`
      : `${them} out-sp.atk’d ${you} — tough luck`;
  }

  /** Polaroid headline — “Pikachu × Onix”. */
  versusLine(entry: BattleHistoryEntry): string {
    const you = this.titleCase(entry.playerName);
    const them = this.titleCase(entry.opponentName);
    return `${you} × ${them}`;
  }

  /** Short verdict line under the matchup. */
  verdictLine(entry: BattleHistoryEntry): string {
    return entry.playerWon ? 'your sp.atk carried · win' : 'their sp.atk edged · loss';
  }

  private titleCase(name: string): string {
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : name;
  }
}
