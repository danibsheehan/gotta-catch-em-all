import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Pokemon } from 'src/app/shared/models/pokemon';
import { PokemonOpponentService } from './pokemon-opponent.service';
import { PokemonPlayerService } from './pokemon-player.service';

/** Single snapshot for the battle shell + result (player + opponent). */
export interface PokemonBattleVm {
  opponentLoading: boolean;
  opponent: Partial<Pokemon>;
  player: Partial<Pokemon>;
  playerError: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonBattleService {
  readonly playerDetails$: Observable<Partial<Pokemon>>;
  readonly playerDetailsError$: Observable<string>;
  readonly opponent$: Observable<Partial<Pokemon>>;
  readonly opponentLoading$: Observable<boolean>;

  readonly vm$: Observable<PokemonBattleVm>;

  private readonly opponentPokemon$$ = new BehaviorSubject<Partial<Pokemon>>({});
  private readonly opponentLoading$$ = new BehaviorSubject<boolean>(true);
  private readonly loadOpponentTrigger$ = new Subject<void>();

  constructor(
    private player: PokemonPlayerService,
    private opponentApi: PokemonOpponentService,
  ) {
    this.playerDetails$ = this.player.pokemonDetails.asObservable();
    this.playerDetailsError$ = this.player.pokemonDetailsError.asObservable();
    this.opponent$ = this.opponentPokemon$$.asObservable();
    this.opponentLoading$ = this.opponentLoading$$.asObservable();

    this.vm$ = combineLatest([
      this.opponentLoading$$,
      this.opponentPokemon$$,
      this.player.pokemonDetails,
      this.player.pokemonDetailsError,
    ]).pipe(
      map(([opponentLoading, opponent, player, playerError]) => ({
        opponentLoading,
        opponent,
        player,
        playerError,
      })),
    );

    this.bindOpponentLoads();
  }

  /** Load (or reload) a random opponent. */
  loadOpponent(): void {
    this.loadOpponentTrigger$.next();
  }

  selectPlayerPokemon(name: string): void {
    this.player.getPokemonDetails(name);
  }

  private bindOpponentLoads(): void {
    this.loadOpponentTrigger$
      .pipe(
        switchMap(() => {
          const id = this.opponentApi.pickRandomOpponentId();
          this.preloadOpponentSprite(this.opponentApi.defaultFrontSpriteUrl(id));
          this.opponentLoading$$.next(true);
          return this.opponentApi.getPokemonById(id).pipe(
            map((data) => ({ pokemon: data as Partial<Pokemon> })),
            catchError(() => of({ pokemon: {} as Partial<Pokemon> })),
          );
        }),
      )
      .subscribe(({ pokemon }) => {
        this.opponentPokemon$$.next(pokemon);
        this.opponentLoading$$.next(false);
      });

    this.loadOpponent();
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
}
