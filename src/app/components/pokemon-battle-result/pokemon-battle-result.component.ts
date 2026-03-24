import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
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
  public pokemonVictor: Partial<Pokemon>;

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

    this.choiceAttack = this.pokemonChoice.stats!.find(stat => stat.stat.name === 'special-attack');
    this.opponentAttack = this.pokemonOpponent.stats!.find(stat => stat.stat.name === 'special-attack');
    this.battleResult = '';

    this.battleTimer = setTimeout(() => {
      this.pokemonBattle(this.choiceAttack, this.opponentAttack);
      this.cdr.markForCheck();
    }, 2000);
  }

  pokemonBattle(choiceAttack: Stat, opponentAttack: Stat): void {
    if (!choiceAttack || !opponentAttack) {
      return;
    }

    if (this.choiceAttack.base_stat > this.opponentAttack.base_stat) {
      this.battleResult = 'Congrats, you win!';
      this.pokemonVictor = this.pokemonChoice;
    } else {
      this.battleResult = 'Uh oh, you lose this battle. Maybe next time!';
      this.pokemonVictor = this.pokemonOpponent;
    }
  }

  ngOnDestroy() {
    if (this.battleTimer) {
      clearTimeout(this.battleTimer);
    }
  }

}
