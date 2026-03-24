import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonType } from 'src/app/pokemon-type';
import { PokemonListService } from 'src/app/pokemon-list.service';

@Component({
    selector: 'app-pokemon-type',
    templateUrl: './pokemon-type.component.html',
    styleUrls: ['./pokemon-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PokemonTypeComponent implements OnChanges, OnDestroy {
  @Input() pokemonType: PokemonType;
  public isOpen = false;
  public isLoadingPokemonNames = false;
  public pokemonNames: string[] = [];
  public pokemonLoadError = '';
  private loadPokemonNamesSub?: Subscription;

  constructor(
    private pokemonListService: PokemonListService,
    private cdr: ChangeDetectorRef
  ) { }

  selectPokemon(name: string) {
    if (name) {
      this.pokemonListService.getPokemonDetails(name);
    }
  }

  toggleTypeDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.pokemonNames.length && !this.isLoadingPokemonNames && !this.pokemonLoadError) {
      this.loadPokemonNames();
    }
  }

  ngOnChanges() {
    this.pokemonNames = [];
    this.pokemonLoadError = '';
    this.isLoadingPokemonNames = false;
    this.isOpen = false;
    this.loadPokemonNamesSub?.unsubscribe();
  }

  ngOnDestroy() {
    this.loadPokemonNamesSub?.unsubscribe();
  }

  private loadPokemonNames() {
    this.isLoadingPokemonNames = true;
    this.loadPokemonNamesSub?.unsubscribe();
    this.loadPokemonNamesSub = this.pokemonListService.getPokemonByType(this.pokemonType.name).subscribe(
      (pokemon) => {
        this.pokemonNames = pokemon.map((pokemonEntry) => pokemonEntry.name);
        this.pokemonLoadError = this.pokemonNames.length ? '' : `No pokemon were found for ${this.pokemonType.name}.`;
        this.isLoadingPokemonNames = false;
        this.cdr.markForCheck();
      },
      () => {
        this.pokemonNames = [];
        this.pokemonLoadError = `Pokemon data could not be found for ${this.pokemonType.name}.`;
        this.isLoadingPokemonNames = false;
        this.cdr.markForCheck();
      }
    );
  }

}
