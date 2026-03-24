import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PokemonListService } from '../../pokemon-list.service';
import { PokemonType } from 'src/app/pokemon-type';

@Component({
    selector: 'app-pokemon-selector',
    templateUrl: './pokemon-selector.component.html',
    styleUrls: ['./pokemon-selector.component.scss'],
    standalone: false
})
export class PokemonSelectorComponent implements OnInit, OnDestroy {
  public pokemonTypes: PokemonType[];
  public pokemonTypesError: string;

  private subscriptions: Subscription;
  private typeSub: Subscription;

  constructor(
    private pokemonListService: PokemonListService
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit() {
    this.typeSub = this.pokemonListService.getPokemonTypes()
      .subscribe(
        (data) => {
          this.pokemonTypes = data.results;
          this.pokemonTypesError = '';
        },
        () => {
          this.pokemonTypes = [];
          this.pokemonTypesError = 'Pokemon type data could not be found. Please refresh and try again.';
        }
      );
    this.subscriptions.add(this.typeSub);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
