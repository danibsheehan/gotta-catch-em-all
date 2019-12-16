import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { PokemonList } from 'src/app/pokemon-list';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnChanges {

  @Input() pokemonList: PokemonList;

  public searchList: PokemonList;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pokemonList && changes.pokemonList.previousValue) {
      this.searchList = changes.pokemonList.currentValue;
    }
  }

}
