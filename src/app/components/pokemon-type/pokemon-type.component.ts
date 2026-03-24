import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonType } from 'src/app/pokemon-type';
import { PokemonBattleService } from 'src/app/pokemon/pokemon-battle.service';
import { PokemonCatalogService } from 'src/app/pokemon/pokemon-catalog.service';

@Component({
    selector: 'app-pokemon-type',
    templateUrl: './pokemon-type.component.html',
    styleUrls: ['./pokemon-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PokemonTypeComponent implements OnChanges, OnDestroy {
  @Input() pokemonType: PokemonType;
  @ViewChild('typeButton') typeButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('pokemonSelect') pokemonSelect?: ElementRef<HTMLSelectElement>;

  public isOpen = false;
  public isLoadingPokemonNames = false;
  public pokemonNames: string[] = [];
  public pokemonLoadError = '';
  private loadPokemonNamesSub?: Subscription;

  constructor(
    private pokemonCatalog: PokemonCatalogService,
    private battle: PokemonBattleService,
    private cdr: ChangeDetectorRef
  ) { }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.isOpen) {
      return;
    }
    event.preventDefault();
    this.closeDropdown();
  }

  selectPokemon(name: string) {
    if (name) {
      this.battle.selectPlayerPokemon(name);
    }
  }

  toggleTypeDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.pokemonNames.length && !this.isLoadingPokemonNames && !this.pokemonLoadError) {
      this.loadPokemonNames();
    } else if (this.isOpen && this.pokemonNames.length) {
      this.cdr.markForCheck();
      this.queueFocusPokemonSelect();
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

  private closeDropdown(): void {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.cdr.markForCheck();
    setTimeout(() => this.typeButton?.nativeElement?.focus());
  }

  private loadPokemonNames() {
    this.isLoadingPokemonNames = true;
    this.loadPokemonNamesSub?.unsubscribe();
    this.loadPokemonNamesSub = this.pokemonCatalog.getPokemonByType(this.pokemonType.name).subscribe(
      (pokemon) => {
        this.pokemonNames = pokemon.map((pokemonEntry) => pokemonEntry.name);
        this.pokemonLoadError = this.pokemonNames.length ? '' : `No pokemon were found for ${this.pokemonType.name}.`;
        this.isLoadingPokemonNames = false;
        this.cdr.markForCheck();
        this.queueFocusPokemonSelect();
      },
      () => {
        this.pokemonNames = [];
        this.pokemonLoadError = `Pokemon data could not be found for ${this.pokemonType.name}.`;
        this.isLoadingPokemonNames = false;
        this.cdr.markForCheck();
      }
    );
  }

  private queueFocusPokemonSelect(): void {
    if (!this.isOpen) {
      return;
    }
    setTimeout(() => this.pokemonSelect?.nativeElement?.focus());
  }

}
