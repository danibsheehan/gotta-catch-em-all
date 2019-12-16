import { Component, OnInit } from '@angular/core';

import { PokemonList } from './pokemon-list';
import { PokemonListService } from './pokemon-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gotta-catch-em-all';

  public pokemonList: PokemonList;

  constructor(
    private pokemonListService: PokemonListService
  ) {

  }

  ngOnInit() {
    this.pokemonListService.pokemonSearchResults
      .subscribe(searchResults => {
        this.pokemonList = searchResults;
      });
  }
}
