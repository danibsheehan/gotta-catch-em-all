import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Pokemon } from './pokemon';
import { PokemonListService } from './pokemon-list.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gotta-catch-em-all';

  public pokemonDetails: Pokemon;
  public pokemonOpponent: Pokemon;
  public pokemonOpponentSelected: boolean;
  public pokemonDetailsError: string;

  private choiceSub: Subscription;
  private choiceErrorSub: Subscription;
  private opponentSub: Subscription;
  private subscriptions: Subscription;

  constructor(
    private pokemonListService: PokemonListService
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit() {
    this.getPokemonOpponent();

    this.choiceSub = this.pokemonListService.pokemonDetails
      .subscribe(pokemonDetails => {
        this.pokemonDetails = pokemonDetails;
      });

    this.choiceErrorSub = this.pokemonListService.pokemonDetailsError
      .subscribe(errorMessage => {
        this.pokemonDetailsError = errorMessage;
      });

    this.subscriptions.add(this.choiceSub);
    this.subscriptions.add(this.choiceErrorSub);
  }

  getPokemonOpponent() {
    this.opponentSub = this.pokemonListService.getPokemonOpponent()
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

    this.subscriptions.add(this.opponentSub);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
