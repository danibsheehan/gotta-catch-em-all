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

  constructor(
    private http: HttpClient
  ) { }

  getPokemonTypes(): Observable<PokemonTypeList> {
   return this.http.get<PokemonTypeList>('https://pokeapi.co/api/v2/type/');
  }

  getPokemon(name: string): void {
    this.http.get<PokemonList>(`https://pokeapi.co/api/v2/type/${name}`).subscribe(data => {
        this.pokemonSearchResults.next(data.pokemon);
      });
  }

  getPokemonDetails(name: string): void {
    this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`).subscribe(data => {
      this.pokemonDetails.next(data);
    });
  }

  getPokemonOpponent(): Observable<Pokemon> {
    // there are 964 pokemon in list
    const opponentId = Math.ceil(Math.random() * 964);
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${opponentId}`);
  }
}
