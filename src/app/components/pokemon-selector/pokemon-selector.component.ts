import { Component, OnInit } from '@angular/core';
import { PokemonListService } from '../../pokemon-list.service';
import { PokemonType } from 'src/app/pokemon-type';

@Component({
  selector: 'app-pokemon-selector',
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.scss']
})
export class PokemonSelectorComponent implements OnInit {
  public pokemonTypes: PokemonType[];
  public pokemonSearched: boolean;

  constructor(
    private pokemonListService: PokemonListService
  ) { }

  ngOnInit() {
    this.pokemonListService.getPokemonTypes()
    .subscribe((data) => {
      this.pokemonTypes = data.results;
    });
  }

  searchPokemon(name: string) {
    this.pokemonListService.getPokemon(name);
    this.pokemonSearched = true;
  }
}
