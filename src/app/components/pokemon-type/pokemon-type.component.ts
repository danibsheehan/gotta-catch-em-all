import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonListService } from 'src/app/pokemon-list.service';
import { PokemonType } from 'src/app/pokemon-type';

@Component({
    selector: 'app-pokemon-type',
    templateUrl: './pokemon-type.component.html',
    styleUrls: ['./pokemon-type.component.scss'],
    standalone: false
})
export class PokemonTypeComponent implements OnDestroy {
  @Input() pokemonType: PokemonType;

  public isDropdownOpen = false;
  public isLoadingPokemon = false;
  public pokemonLoadError = '';
  public pokemonNames: string[] = [];
  private typePokemonSub: Subscription;

  constructor(
    private pokemonListService: PokemonListService
  ) { }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen && !this.pokemonNames.length) {
      this.loadPokemonForType();
    }
  }

  loadPokemonForType() {
    this.isLoadingPokemon = true;
    this.pokemonLoadError = '';
    this.typePokemonSub = this.pokemonListService.getPokemonByType(this.pokemonType.name)
      .subscribe(
        (data: any) => {
          this.pokemonNames = data.pokemon.map((entry: any) => entry.pokemon.name);
          if (!this.pokemonNames.length) {
            this.pokemonLoadError = `No pokemon were found for ${this.pokemonType.name}.`;
          }
          this.isLoadingPokemon = false;
        },
        () => {
          this.pokemonNames = [];
          this.pokemonLoadError = `Pokemon data could not be found for ${this.pokemonType.name}.`;
          this.isLoadingPokemon = false;
        }
      );
  }

  selectPokemon(name: string) {
    if (name) {
      this.pokemonListService.getPokemonDetails(name);
    }
  }

  ngOnDestroy() {
    if (this.typePokemonSub) {
      this.typePokemonSub.unsubscribe();
    }
  }
}
