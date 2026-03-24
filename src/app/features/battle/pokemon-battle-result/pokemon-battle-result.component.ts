import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { PokemonDetailsComponent } from 'src/app/features/pokemon-display/pokemon-details/pokemon-details.component';
import { Pokemon, Stat } from 'src/app/shared/models/pokemon';

import { PokemonBattleService } from '../pokemon-battle.service';
import { resolveSpecialAttackBattle } from '../special-attack-battle';

@Component({
    selector: 'app-pokemon-battle-result',
    templateUrl: './pokemon-battle-result.component.html',
    styleUrls: ['./pokemon-battle-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [PokemonDetailsComponent],
})
export class PokemonBattleResultComponent implements OnChanges, OnDestroy {

  @Input() pokemonChoice: Partial<Pokemon>;
  @Input() pokemonOpponent: Partial<Pokemon>;

  public choiceAttack: Stat | undefined;
  public opponentAttack: Stat | undefined;
  private battleTimer: ReturnType<typeof setTimeout>;

  public battleResult: string;
  public pokemonVictor: Partial<Pokemon> | undefined;
  public isResolvingBattle = false;

  constructor(
    private battle: PokemonBattleService,
    private cdr: ChangeDetectorRef
  ) { }

  playAgain(): void {
    this.battle.playAgain();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.pokemonChoice?.stats || !this.pokemonOpponent?.stats) {
      this.isResolvingBattle = false;
      return;
    }

    if (!changes.pokemonChoice && !changes.pokemonOpponent) {
      return;
    }

    if (this.battleTimer) {
      clearTimeout(this.battleTimer);
    }

    this.battleResult = '';
    this.pokemonVictor = undefined;
    this.choiceAttack = undefined;
    this.opponentAttack = undefined;
    this.isResolvingBattle = true;
    this.cdr.markForCheck();

    this.battleTimer = setTimeout(() => {
      const outcome = resolveSpecialAttackBattle(this.pokemonChoice, this.pokemonOpponent);
      if (outcome) {
        this.choiceAttack = outcome.choiceStat;
        this.opponentAttack = outcome.opponentStat;
        this.battleResult = outcome.message;
        this.pokemonVictor = outcome.victor;
      }
      this.isResolvingBattle = false;
      this.cdr.markForCheck();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.battleTimer) {
      clearTimeout(this.battleTimer);
    }
  }

}
