import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { Pokemon } from './pokemon';
import { PokemonList } from './pokemon-list';
import { PokemonTypeList } from './pokemon-type-list';

@Injectable({
  providedIn: 'root'
})
export class PokemonListService {
  public pokemonSearchResults = new BehaviorSubject<any>([]);
  public pokemonDetails = new BehaviorSubject<any>({});
  public pokemonDetailsError = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient
  ) { }

  getPokemonTypes(): Observable<PokemonTypeList> {
   return this.http.get<PokemonTypeList>('https://pokeapi.co/api/v2/type/');
  }

  getPokemon(name: string): void {
    this.getPokemonByType(name).subscribe(data => {
        this.pokemonSearchResults.next(data);
      });
  }

  getPokemonByType(name: string): Observable<PokemonList> {
    return this.http.get<PokemonList>(`https://pokeapi.co/api/v2/type/${name}`);
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
