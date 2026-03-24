import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { PokeApiClient } from 'src/app/core/api/poke-api.client';
import { Pokemon } from 'src/app/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonPlayerService {
  public pokemonDetails = new BehaviorSubject<Partial<Pokemon>>({});
  public pokemonDetailsError = new BehaviorSubject<string>('');
  private pokemonDetailsRequestSub?: Subscription;

  constructor(private pokeApi: PokeApiClient) {}

  getPokemonDetails(name: string): void {
    this.pokemonDetailsError.next('');
    if (this.pokemonDetailsRequestSub) {
      this.pokemonDetailsRequestSub.unsubscribe();
    }
    this.pokemonDetailsRequestSub = this.pokeApi.getPokemon(name).subscribe({
      next: (data) => this.pokemonDetails.next(data),
      error: () => {
        this.pokemonDetails.next({});
        this.pokemonDetailsError.next('Pokemon data could not be found. Please choose another pokemon.');
      }
    });
  }
}
