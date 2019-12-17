import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { PokemonList } from 'src/app/pokemon-list';
import { PokemonListService } from 'src/app/pokemon-list.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnChanges {

  @Input() pokemonList: PokemonList;

  public searchList: PokemonList;

  constructor(
    private pokemonListService: PokemonListService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pokemonList && changes.pokemonList.previousValue) {
      this.searchList = changes.pokemonList.currentValue;
    }
  }

  getPokemonDetails(name: string): void {
    this.pokemonListService.getPokemonDetails(name);
  }

}
