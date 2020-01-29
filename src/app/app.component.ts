import { Component, OnInit } from '@angular/core';

import { PokemonList } from './pokemon-list';
import { PokemonListService } from './pokemon-list.service';
import { Pokemon } from './pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gotta-catch-em-all';

  public pokemonDetails: Pokemon;
  public pokemonList: PokemonList;
  public pokemonOpponent: Pokemon;
  public pokemonOpponentSelected: boolean;

  constructor(
    private pokemonListService: PokemonListService
  ) {

  }

  ngOnInit() {
    this.pokemonListService.getPokemonOpponent()
      .subscribe(pokemonOpponent => {
        this.pokemonOpponent = pokemonOpponent;
      });

    this.pokemonListService.pokemonSearchResults
      .subscribe(searchResults => {
        this.pokemonList = searchResults;
      });

    this.pokemonListService.pokemonDetails
      .subscribe(pokemonDetails => {
        this.pokemonDetails = pokemonDetails;
      });
  }
}
