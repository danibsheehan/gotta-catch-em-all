import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Pokemon } from './pokemon';
import { PokemonBrief } from './pokemon';
import { PokemonType } from './pokemon-type';
import { PokemonTypeList } from './pokemon-type-list';

@Injectable({
  providedIn: 'root'
})
export class PokemonListService {
  public pokemonDetails = new BehaviorSubject<any>({});
  public pokemonDetailsError = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient
  ) { }

  getPokemonTypes(): Observable<PokemonTypeList> {
    return this.http.get<PokemonTypeList>('https://pokeapi.co/api/v2/type/').pipe(
      switchMap((data) => {
        const typeRequests = data.results.map((type) =>
          this.http.get<{ pokemon: { pokemon: PokemonBrief }[] }>(`https://pokeapi.co/api/v2/type/${type.name}`)
        );

        return forkJoin(typeRequests).pipe(
          map((typeDetails) => ({
            ...data,
            results: data.results.map((type: PokemonType, index: number) => ({
              ...type,
              pokemon: typeDetails[index].pokemon.map((entry: any) => entry.pokemon as PokemonBrief)
            }))
          }))
        );
      })
    );
  }

  getPokemonDetails(name: string): void {
    this.pokemonDetailsError.next('');
    this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`).subscribe(
      data => {
        this.pokemonDetails.next(data);
      },
      () => {
        this.pokemonDetails.next({});
        this.pokemonDetailsError.next('Pokemon data could not be found. Please choose another pokemon.');
      }
    );
  }

  getPokemonOpponent(): Observable<Pokemon> {
    // there are 964 pokemon in list
    const opponentId = Math.ceil(Math.random() * 964);
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${opponentId}`);
  }
}
