import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concat, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { PokeApiClient } from 'src/app/core/api/poke-api.client';
import { Pokemon } from 'src/app/shared/models/pokemon';

const PLAYER_DETAILS_ERROR =
  'Pokemon data could not be found. Please choose another pokemon.';

interface PlayerFetchSnapshot {
  details: Partial<Pokemon>;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonPlayerService {
  /** Latest successful or failed fetch; mirrors the streams below for imperative reads/tests. */
  public pokemonDetails = new BehaviorSubject<Partial<Pokemon>>({});
  public pokemonDetailsError = new BehaviorSubject<string>('');

  private readonly selectedPokemonName$ = new BehaviorSubject<string | null>(null);

  constructor(private pokeApi: PokeApiClient) {
    this.bindSelectionToState();
  }

  /** Request details for the given species name; superseding calls cancel the previous HTTP request. */
  getPokemonDetails(name: string): void {
    if (!name) {
      return;
    }
    this.selectedPokemonName$.next(name);
  }

  /** Clear the current pick so the player can choose again. */
  clearPlayerSelection(): void {
    this.selectedPokemonName$.next(null);
  }

  private bindSelectionToState(): void {
    this.selectedPokemonName$
      .pipe(
        switchMap((name) => this.snapshotForSelection(name)),
      )
      .subscribe(({ details, error }) => {
        this.pokemonDetails.next(details);
        this.pokemonDetailsError.next(error);
      });
  }

  private snapshotForSelection(name: string | null): Observable<PlayerFetchSnapshot> {
    if (name == null || name === '') {
      return of({ details: {}, error: '' });
    }
    return concat(
      of<PlayerFetchSnapshot>({ details: this.pokemonDetails.value, error: '' }),
      this.pokeApi.getPokemon(name).pipe(
        map((data): PlayerFetchSnapshot => ({ details: data, error: '' })),
        catchError((): Observable<PlayerFetchSnapshot> =>
          of({ details: {}, error: PLAYER_DETAILS_ERROR }),
        ),
      ),
    );
  }
}
