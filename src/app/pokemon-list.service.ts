import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { PokemonList } from './pokemon-list';
import { PokemonTypeList } from './pokemon-type-list';

@Injectable({
  providedIn: 'root'
})
export class PokemonListService {
  public pokemonSearchResults = new BehaviorSubject<any>([]);
  constructor(
    private http: HttpClient
  ) { }

  getPokemonTypes(): Observable<PokemonTypeList> {
   return this.http.get<PokemonTypeList>('https://pokeapi.co/api/v2/type/');
  }

  getPokemon(name: string): void {
    this.http.get<PokemonList>(`https://pokeapi.co/api/v2/type/${name}`).subscribe(results => {
        this.pokemonSearchResults.next(results.pokemon);
      });
  }
}
