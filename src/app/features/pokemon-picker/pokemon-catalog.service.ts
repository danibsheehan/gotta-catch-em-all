import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { PokeApiClient } from 'src/app/core/api/poke-api.client';
import { PokemonBrief } from 'src/app/shared/models/pokemon';
import { PokemonTypeList } from 'src/app/shared/models/pokemon-type-list';

@Injectable({
  providedIn: 'root'
})
export class PokemonCatalogService {
  private pokemonTypesRequest$?: Observable<PokemonTypeList>;
  private pokemonByTypeRequests: Record<string, Observable<PokemonBrief[]>> = {};

  constructor(private pokeApi: PokeApiClient) {}

  getPokemonTypes(): Observable<PokemonTypeList> {
    if (!this.pokemonTypesRequest$) {
      this.pokemonTypesRequest$ = this.pokeApi.getTypeIndex().pipe(shareReplay(1));
    }
    return this.pokemonTypesRequest$;
  }

  getPokemonByType(typeName: string): Observable<PokemonBrief[]> {
    if (!this.pokemonByTypeRequests[typeName]) {
      this.pokemonByTypeRequests[typeName] = this.pokeApi.getTypeDetail(typeName).pipe(
        map((typeDetails) => typeDetails.pokemon.map((entry) => entry.pokemon)),
        shareReplay(1)
      );
    }
    return this.pokemonByTypeRequests[typeName];
  }
}
