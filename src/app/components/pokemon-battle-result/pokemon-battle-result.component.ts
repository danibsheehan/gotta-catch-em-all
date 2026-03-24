import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { resolveSpecialAttackBattle } from 'src/app/domain/special-attack-battle';
import { Pokemon, Stat } from 'src/app/pokemon';

@Component({
    selector: 'app-pokemon-battle-result',
    templateUrl: './pokemon-battle-result.component.html',
    styleUrls: ['./pokemon-battle-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PokemonBattleResultComponent implements OnChanges, OnDestroy {

  @Input() pokemonChoice: Partial<Pokemon>;
  @Input() pokemonOpponent: Partial<Pokemon>;

  public choiceAttack: Stat | undefined;
  public opponentAttack: Stat | undefined;
  private battleTimer: ReturnType<typeof setTimeout>;

  public battleResult: string;
  public pokemonVictor: Partial<Pokemon> | undefined;

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.pokemonChoice?.stats || !this.pokemonOpponent?.stats) {
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

    this.battleTimer = setTimeout(() => {
      const outcome = resolveSpecialAttackBattle(this.pokemonChoice, this.pokemonOpponent);
      if (outcome) {
        this.choiceAttack = outcome.choiceStat;
        this.opponentAttack = outcome.opponentStat;
        this.battleResult = outcome.message;
        this.pokemonVictor = outcome.victor;
      }
      this.cdr.markForCheck();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.battleTimer) {
      clearTimeout(this.battleTimer);
    }
  }

}
