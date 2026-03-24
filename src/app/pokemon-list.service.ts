import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Pokemon } from './pokemon';
import { PokemonBrief } from './pokemon';
import { PokemonTypeList } from './pokemon-type-list';

@Injectable({
  providedIn: 'root'
})
export class PokemonListService {
  public pokemonDetails = new BehaviorSubject<Partial<Pokemon>>({});
  public pokemonDetailsError = new BehaviorSubject<string>('');
  private pokemonDetailsRequestSub?: Subscription;
  private pokemonTypesRequest$?: Observable<PokemonTypeList>;
  private pokemonByTypeRequests: Record<string, Observable<PokemonBrief[]>> = {};

  constructor(
    private http: HttpClient
  ) { }

  /** Encode a single path segment for PokeAPI URLs (names/types can contain reserved characters). */
  private static encodePathSegment(value: string | number): string {
    return encodeURIComponent(String(value));
  }

  getPokemonTypes(): Observable<PokemonTypeList> {
    if (!this.pokemonTypesRequest$) {
      this.pokemonTypesRequest$ = this.http.get<PokemonTypeList>('https://pokeapi.co/api/v2/type/').pipe(shareReplay(1));
    }

    return this.pokemonTypesRequest$;
  }

  getPokemonByType(typeName: string): Observable<PokemonBrief[]> {
    if (!this.pokemonByTypeRequests[typeName]) {
      this.pokemonByTypeRequests[typeName] = this.http
        .get<{ pokemon: { pokemon: PokemonBrief }[] }>(`https://pokeapi.co/api/v2/type/${PokemonListService.encodePathSegment(typeName)}`)
        .pipe(
          map((typeDetails) =>
            typeDetails.pokemon.map((entry: { pokemon: PokemonBrief }) => entry.pokemon)
          ),
          shareReplay(1)
        );
    }

    return this.pokemonByTypeRequests[typeName];
  }

  getPokemonDetails(name: string): void {
    this.pokemonDetailsError.next('');
    if (this.pokemonDetailsRequestSub) {
      this.pokemonDetailsRequestSub.unsubscribe();
    }
    this.pokemonDetailsRequestSub = this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${PokemonListService.encodePathSegment(name)}`).subscribe(
      data => {
        this.pokemonDetails.next(data);
      },
      () => {
        this.pokemonDetails.next({});
        this.pokemonDetailsError.next('Pokemon data could not be found. Please choose another pokemon.');
      }
    );
  }

  /** National Dex–style id used by PokeAPI `/pokemon/{id}` (approx. count for random opponent). */
  pickRandomOpponentId(): number {
    return Math.ceil(Math.random() * 964);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${PokemonListService.encodePathSegment(id)}`);
  }

  /**
   * Default front sprite URL for standard species (matches most `front_default` values from the API).
   * Lets the browser load the image in parallel with the JSON request to improve LCP.
   */
  static defaultFrontSpriteUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  getPokemonOpponent(): Observable<Pokemon> {
    return this.getPokemonById(this.pickRandomOpponentId());
  }
}
