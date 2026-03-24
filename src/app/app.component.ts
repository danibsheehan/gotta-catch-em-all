import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

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

  public pokemonDetails$: Observable<Pokemon>;
  public pokemonDetailsError$: Observable<string>;
  public pokemonOpponent: Pokemon;
  public pokemonOpponentLoading = true;
  public pokemonOpponentSelected = false;

  private opponentSub?: Subscription;

  constructor(
    private pokemonListService: PokemonListService
  ) {
    this.pokemonDetails$ = this.pokemonListService.pokemonDetails.asObservable();
    this.pokemonDetailsError$ = this.pokemonListService.pokemonDetailsError.asObservable();
  }

  ngOnInit() {
    this.getPokemonOpponent();
  }

  getPokemonOpponent() {
    this.pokemonOpponentLoading = true;
    this.opponentSub?.unsubscribe();

    const opponentId = this.pokemonListService.pickRandomOpponentId();
    this.preloadOpponentSprite(PokemonListService.defaultFrontSpriteUrl(opponentId));

    this.opponentSub = this.pokemonListService.getPokemonById(opponentId)
      .subscribe(
        data => {
          this.pokemonOpponent = data;
          this.pokemonOpponentLoading = false;
          this.pokemonOpponentSelected = true;
        },
        err => {
          this.pokemonOpponent = {} as Pokemon;
          this.pokemonOpponentLoading = false;
          this.pokemonOpponentSelected = true;
        }
      );

  }

  private preloadOpponentSprite(href: string): void {
    document.querySelectorAll('link[data-opponent-sprite-preload]').forEach((el) => el.remove());
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    link.setAttribute('fetchpriority', 'high');
    link.setAttribute('data-opponent-sprite-preload', '');
    document.head.appendChild(link);
  }

  ngOnDestroy() {
    this.opponentSub?.unsubscribe();
  }
}
