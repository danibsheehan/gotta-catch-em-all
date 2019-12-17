import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Pokemon } from 'src/app/pokemon';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent implements OnChanges {

  @Input() pokemonDetails: Pokemon;

  public currentPokemon: Pokemon;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pokemonDetails && changes.pokemonDetails.previousValue) {
      this.currentPokemon = changes.pokemonDetails.currentValue;
    }
  }

}
