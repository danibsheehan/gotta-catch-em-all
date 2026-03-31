import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { PokemonTypeComponent } from './pokemon-type.component';
import { PokemonType } from 'src/app/shared/models/pokemon-type';
import { PokemonBrief } from 'src/app/shared/models/pokemon';
import { PokemonBattleService } from 'src/app/features/battle/pokemon-battle.service';
import { PokemonCatalogService } from '../pokemon-catalog.service';

describe('PokemonTypeComponent', () => {
  let component: PokemonTypeComponent;
  let fixture: ComponentFixture<PokemonTypeComponent>;
  let pokemonCatalogSpy: jasmine.SpyObj<PokemonCatalogService>;
  let battleSpy: Pick<PokemonBattleService, 'selectPlayerPokemon' | 'closeSelectorDropdowns$'>;
  let closeSelectorDropdowns$: Subject<void>;
  const pokemonTypeStub: PokemonType = {
    name: 'electric',
    url: 'https://pokeapi.co/api/v2/type/13/'
  };

  beforeEach(async () => {
    closeSelectorDropdowns$ = new Subject<void>();
    pokemonCatalogSpy = jasmine.createSpyObj('PokemonCatalogService', ['getPokemonByType']);
    battleSpy = {
      selectPlayerPokemon: jasmine.createSpy('selectPlayerPokemon'),
      closeSelectorDropdowns$: closeSelectorDropdowns$.asObservable(),
    };
    const catalogPage: PokemonBrief[] = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' },
    ];
    pokemonCatalogSpy.getPokemonByType.and.returnValue(of(catalogPage));

    TestBed.configureTestingModule({
      imports: [PokemonTypeComponent],
      providers: [
        { provide: PokemonCatalogService, useValue: pokemonCatalogSpy },
        { provide: PokemonBattleService, useValue: battleSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonTypeComponent);
    component = fixture.componentInstance;
    component.pokemonType = pokemonTypeStub;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleTypeDropdown()', () => {
    it('should load pokemon names when opening dropdown', () => {
      component.toggleTypeDropdown();

      expect(pokemonCatalogSpy.getPokemonByType).toHaveBeenCalledWith('electric');
      expect(component.pokemonNames).toEqual(['pikachu', 'raichu']);
      expect(component.isOpen).toBe(true);
    });

    it('should toggle closed without loading on second click', () => {
      component.toggleTypeDropdown();
      component.toggleTypeDropdown();

      expect(component.isOpen).toBe(false);
      expect(pokemonCatalogSpy.getPokemonByType).toHaveBeenCalledTimes(1);
    });

    it('should set empty-results message when catalog returns no pokemon', () => {
      pokemonCatalogSpy.getPokemonByType.and.returnValue(of([]));

      component.toggleTypeDropdown();

      expect(component.pokemonNames).toEqual([]);
      expect(component.pokemonLoadError).toBe('👀 no electric crew in the dex rn');
    });

    it('should set load error when catalog request fails', () => {
      pokemonCatalogSpy.getPokemonByType.and.returnValue(throwError(() => new Error('failed')));

      component.toggleTypeDropdown();

      expect(component.pokemonNames).toEqual([]);
      expect(component.pokemonLoadError).toBe("😵 couldn't fetch electric — tap refresh?");
    });

    it('should close dropdown on Escape', fakeAsync(() => {
      component.toggleTypeDropdown();
      expect(component.isOpen).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      tick();

      expect(component.isOpen).toBe(false);
    }));
  });

  describe('selectPokemon()', () => {
    it('should call battle.selectPlayerPokemon when name is non-empty', () => {
      component.selectPokemon('pikachu');

      expect(battleSpy.selectPlayerPokemon).toHaveBeenCalledWith('pikachu');
    });

    it('should not call selectPlayerPokemon when name is empty', () => {
      component.selectPokemon('');

      expect(battleSpy.selectPlayerPokemon).not.toHaveBeenCalled();
    });
  });

  describe('closeSelectorDropdowns$', () => {
    it('should close and clear dropdown state when battle emits', () => {
      component.toggleTypeDropdown();
      expect(component.isOpen).toBe(true);
      expect(component.pokemonNames.length).toBeGreaterThan(0);

      closeSelectorDropdowns$.next();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(component.pokemonNames).toEqual([]);
      expect(component.pokemonLoadError).toBe('');
      expect(component.isLoadingPokemonNames).toBe(false);
    });
  });

});
