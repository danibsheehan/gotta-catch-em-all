import { Component, Input } from '@angular/core';
import { PokemonType } from 'src/app/pokemon-type';
import { PokemonListService } from 'src/app/pokemon-list.service';

@Component({
    selector: 'app-pokemon-type',
    templateUrl: './pokemon-type.component.html',
    styleUrls: ['./pokemon-type.component.scss'],
    standalone: false
})
export class PokemonTypeComponent {
  @Input() pokemonType: PokemonType;

  constructor(
    private pokemonListService: PokemonListService
  ) { }

  selectPokemon(name: string) {
    if (name) {
      this.pokemonListService.getPokemonDetails(name);
    }
  }

  get pokemonNames(): string[] {
    return this.pokemonType?.pokemon?.map((pokemon) => pokemon.name) ?? [];
  }

  get pokemonLoadError(): string {
    if (this.pokemonType?.pokemon === undefined) {
      return `Pokemon data could not be found for ${this.pokemonType.name}.`;
    }

    return this.pokemonNames.length ? '' : `No pokemon were found for ${this.pokemonType.name}.`;
  }

}
