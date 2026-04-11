import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PokemonType } from 'src/app/shared/models/pokemon-type';
import { PokemonBattleService } from 'src/app/features/battle/pokemon-battle.service';
import { PokemonCatalogService } from '../pokemon-catalog.service';

const TYPE_GLYPHS: Record<string, string> = {
  bug: '🐛',
  dark: '🌙',
  dragon: '🐉',
  electric: '⚡',
  fairy: '✨',
  fighting: '✊',
  fire: '🔥',
  flying: '🪶',
  ghost: '👻',
  grass: '🌿',
  ground: '🏜️',
  ice: '❄️',
  normal: '◇',
  poison: '☠️',
  psychic: '🔮',
  rock: '🪨',
  steel: '⚙️',
  water: '💧',
  stellar: '✦',
};

@Component({
    selector: 'app-pokemon-type',
    templateUrl: './pokemon-type.component.html',
    styleUrls: ['./pokemon-type.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class PokemonTypeComponent implements OnChanges, OnInit, OnDestroy {
  @Input() pokemonType: PokemonType;

  @HostBinding('attr.data-type')
  get dataTypeAttr(): string {
    return this.pokemonType?.name ?? '';
  }

  get typeGlyph(): string {
    const name = this.pokemonType?.name;
    return name ? TYPE_GLYPHS[name] ?? '◆' : '◆';
  }

  @ViewChild('typeButton') typeButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('pokemonSelect') pokemonSelect?: ElementRef<HTMLSelectElement>;

  public isOpen = false;
  public isLoadingPokemonNames = false;
  /** True after a successful type fetch that returned zero Pokémon (button stays disabled). */
  public typeHasNoPokemon = false;
  /** True while the initial per-type list is loading (button disabled until resolved). */
  public isCheckingTypePokemon = true;
  public pokemonNames: string[] = [];
  public pokemonLoadError = '';
  private loadPokemonNamesSub?: Subscription;
  private prefetchTypeSub?: Subscription;
  private closeDropdownsSub?: Subscription;

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
    if (this.isCheckingTypePokemon || this.typeHasNoPokemon) {
      return;
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.pokemonNames.length && !this.isLoadingPokemonNames && !this.pokemonLoadError) {
      this.loadPokemonNames();
    } else if (this.isOpen && this.pokemonNames.length) {
      this.cdr.markForCheck();
      this.queueFocusPokemonSelect();
    }
  }

  ngOnChanges() {
    this.resetTypePickerState();
  }

  ngOnInit() {
    this.closeDropdownsSub = this.battle.closeSelectorDropdowns$.subscribe(() => {
      this.resetTypePickerState();
    });
  }

  ngOnDestroy() {
    this.loadPokemonNamesSub?.unsubscribe();
    this.prefetchTypeSub?.unsubscribe();
    this.closeDropdownsSub?.unsubscribe();
  }

  private resetTypePickerState(): void {
    this.prefetchTypeSub?.unsubscribe();
    this.loadPokemonNamesSub?.unsubscribe();
    this.pokemonNames = [];
    this.pokemonLoadError = '';
    this.isLoadingPokemonNames = false;
    this.isOpen = false;
    this.typeHasNoPokemon = false;
    this.isCheckingTypePokemon = true;
    this.prefetchPokemonForType();
    this.cdr.markForCheck();
  }

  private prefetchPokemonForType(): void {
    const typeName = this.pokemonType?.name;
    if (!typeName) {
      this.isCheckingTypePokemon = false;
      return;
    }
    this.prefetchTypeSub = this.pokemonCatalog.getPokemonByType(typeName).subscribe({
      next: (pokemon) => {
        this.isCheckingTypePokemon = false;
        this.pokemonNames = pokemon.map((entry) => entry.name);
        this.typeHasNoPokemon = this.pokemonNames.length === 0;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isCheckingTypePokemon = false;
        this.typeHasNoPokemon = false;
        this.pokemonNames = [];
        this.cdr.markForCheck();
      },
    });
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
        this.typeHasNoPokemon = this.pokemonNames.length === 0;
        this.pokemonLoadError = this.pokemonNames.length
          ? ''
          : `👀 no ${this.pokemonType.name} crew in the dex rn`;
        this.isLoadingPokemonNames = false;
        this.cdr.markForCheck();
        this.queueFocusPokemonSelect();
      },
      () => {
        this.pokemonNames = [];
        this.pokemonLoadError = `😵 couldn't fetch ${this.pokemonType.name} — tap refresh?`;
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
