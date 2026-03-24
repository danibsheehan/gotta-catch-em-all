import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PokeApiClient } from 'src/app/core/api/poke-api.client';
import { environment } from 'src/environments/environment';
import { Pokemon } from 'src/app/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonOpponentService {
  constructor(private pokeApi: PokeApiClient) {}

  pickRandomOpponentId(): number {
    return Math.ceil(Math.random() * environment.maxPokemonSpeciesId);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.pokeApi.getPokemon(id);
  }

  /**
   * Default front sprite URL for standard species (matches most `front_default` values from the API).
   * Lets the browser load the image in parallel with the JSON request to improve LCP.
   */
  defaultFrontSpriteUrl(id: number): string {
    return `${environment.pokeApi.frontSpriteBaseUrl}/${id}.png`;
  }

  getPokemonOpponent(): Observable<Pokemon> {
    return this.getPokemonById(this.pickRandomOpponentId());
  }
}
