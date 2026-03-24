import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Pokemon } from './pokemon';
import { PokemonOpponentService } from './pokemon/pokemon-opponent.service';
import { PokemonPlayerService } from './pokemon/pokemon-player.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gotta-catch-em-all';

  public pokemonDetails$: Observable<Partial<Pokemon>>;
  public pokemonDetailsError$: Observable<string>;
  public pokemonOpponent: Pokemon;
  public pokemonOpponentLoading = true;
  public pokemonOpponentSelected = false;

  private opponentSub?: Subscription;

  constructor(
    private pokemonPlayer: PokemonPlayerService,
    private opponentService: PokemonOpponentService
  ) {
    this.pokemonDetails$ = this.pokemonPlayer.pokemonDetails.asObservable();
    this.pokemonDetailsError$ = this.pokemonPlayer.pokemonDetailsError.asObservable();
  }

  ngOnInit() {
    this.getPokemonOpponent();
  }

  getPokemonOpponent() {
    this.pokemonOpponentLoading = true;
    this.opponentSub?.unsubscribe();

    const opponentId = this.opponentService.pickRandomOpponentId();
    this.preloadOpponentSprite(this.opponentService.defaultFrontSpriteUrl(opponentId));

    this.opponentSub = this.opponentService.getPokemonById(opponentId)
      .subscribe(
        data => {
          this.pokemonOpponent = data;
          this.pokemonOpponentLoading = false;
          this.pokemonOpponentSelected = true;
        },
        () => {
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
