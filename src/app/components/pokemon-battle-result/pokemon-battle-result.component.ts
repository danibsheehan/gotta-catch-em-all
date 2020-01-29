import { Component, OnInit, Input } from '@angular/core';
import { Pokemon, Stat } from 'src/app/pokemon';

@Component({
  selector: 'app-pokemon-battle-result',
  templateUrl: './pokemon-battle-result.component.html',
  styleUrls: ['./pokemon-battle-result.component.scss']
})
export class PokemonBattleResultComponent implements OnInit {

  @Input() pokemonChoice: Pokemon;
  @Input() pokemonOpponent: Pokemon;

  private choiceAttack: Stat;
  private opponentAttack: Stat;

  public battleResult: string;

  constructor() { }

  ngOnInit() {
    this.choiceAttack = this.pokemonChoice.stats.find(stat => stat.stat.name === 'special-attack');
    this.opponentAttack = this.pokemonOpponent.stats.find(stat => stat.stat.name === 'special-attack');

    if (this.choiceAttack.base_stat > this.opponentAttack.base_stat) {
      this.battleResult = 'Congrats, you win!';
    } else {
      this.battleResult = 'Uh oh, you lose this battle. Maybe next time!';
    }
  }

}
