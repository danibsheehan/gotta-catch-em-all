import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Pokemon, PokemonBrief } from 'src/app/pokemon';
import { PokemonTypeList } from 'src/app/pokemon-type-list';

/** Raw `GET /type/{name}` body shape (only the field we read). */
export interface PokeApiTypeDetailResponse {
  pokemon: { pokemon: PokemonBrief }[];
}

@Injectable({
  providedIn: 'root'
})
export class PokeApiClient {
  constructor(private http: HttpClient) {}

  /** Encode a single path segment for PokeAPI URLs (names/types can contain reserved characters). */
  private static encodePathSegment(value: string | number): string {
    return encodeURIComponent(String(value));
  }

  getTypeIndex(): Observable<PokemonTypeList> {
    return this.http.get<PokemonTypeList>(`${environment.pokeApi.baseUrl}/type/`);
  }

  getTypeDetail(typeName: string): Observable<PokeApiTypeDetailResponse> {
    return this.http.get<PokeApiTypeDetailResponse>(
      `${environment.pokeApi.baseUrl}/type/${PokeApiClient.encodePathSegment(typeName)}`
    );
  }

  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(
      `${environment.pokeApi.baseUrl}/pokemon/${PokeApiClient.encodePathSegment(nameOrId)}`
    );
  }
}
