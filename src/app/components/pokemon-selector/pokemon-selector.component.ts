import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PokemonList } from '../../pokemon-list';
import { PokemonListService } from '../../pokemon-list.service';
import { PokemonType } from 'src/app/pokemon-type';

@Component({
  selector: 'app-pokemon-selector',
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.scss']
})
export class PokemonSelectorComponent implements OnInit, OnDestroy {

  public pokemonList: PokemonList;
  public pokemonSearched: boolean;
  public pokemonTypes: PokemonType[];
  public pokemonTypeSearched: string;

  private pokemonSub: Subscription;
  private subscriptions: Subscription;
  private typeSub: Subscription;

  constructor(
    private pokemonListService: PokemonListService
  ) { }

  ngOnInit() {
    this.typeSub = this.pokemonListService.getPokemonTypes()
      .subscribe((data) => {
        this.pokemonTypes = data.results;
    });

    this.pokemonSub = this.pokemonListService.pokemonSearchResults
      .subscribe(searchResults => {
        this.pokemonList = searchResults;
      });

    this.subscriptions.add(this.typeSub);
    this.subscriptions.add(this.pokemonSub);
  }

  searchPokemon(name: string) {
    this.pokemonListService.getPokemon(name);
    this.pokemonTypeSearched = name;
    this.pokemonSearched = true;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
