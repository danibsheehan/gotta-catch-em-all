import { Component, OnInit } from '@angular/core';

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
  public pokemonOpponent: Pokemon;
  public pokemonOpponentSelected: boolean;

  constructor(
    private pokemonListService: PokemonListService
  ) {

  }

  ngOnInit() {
    this.getPokemonOpponent();

    this.pokemonListService.pokemonDetails
      .subscribe(pokemonDetails => {
        this.pokemonDetails = pokemonDetails;
      });
  }

  getPokemonOpponent() {
    this.pokemonListService.getPokemonOpponent()
      .subscribe(
        data => {
          this.pokemonOpponent = data;
          this.pokemonOpponentSelected = true;
        },
        err => {
          this.pokemonOpponent = {} as Pokemon;
          this.pokemonOpponentSelected = true;
        }
      );
  }
}
