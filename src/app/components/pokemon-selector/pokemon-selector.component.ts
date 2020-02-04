import { Component, OnInit } from '@angular/core';

import { PokemonList } from '../../pokemon-list';
import { PokemonListService } from '../../pokemon-list.service';
import { PokemonType } from 'src/app/pokemon-type';

@Component({
  selector: 'app-pokemon-selector',
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.scss']
})
export class PokemonSelectorComponent implements OnInit {
  public pokemonList: PokemonList;
  public pokemonTypes: PokemonType[];
  public pokemonSearched: boolean;
  public pokemonTypeSearched: string;

  constructor(
    private pokemonListService: PokemonListService
  ) { }

  ngOnInit() {
    this.pokemonListService.getPokemonTypes()
      .subscribe((data) => {
        this.pokemonTypes = data.results;
    });

    this.pokemonListService.pokemonSearchResults
      .subscribe(searchResults => {
        this.pokemonList = searchResults;
      });
  }

  searchPokemon(name: string) {
    this.pokemonListService.getPokemon(name);
    this.pokemonTypeSearched = name;
    this.pokemonSearched = true;
  }
}
