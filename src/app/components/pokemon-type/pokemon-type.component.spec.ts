import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subscription, throwError } from 'rxjs';

import { PokemonTypeComponent } from './pokemon-type.component';
import { PokemonType } from 'src/app/pokemon-type';
import { PokemonListService } from 'src/app/pokemon-list.service';

describe('PokemonTypeComponent', () => {
  let component: PokemonTypeComponent;
  let fixture: ComponentFixture<PokemonTypeComponent>;
  let pokemonListServiceSpy: jasmine.SpyObj<PokemonListService>;
  const pokemonTypeStub: PokemonType = {
    name: 'electric',
    url: 'https://pokeapi.co/api/v2/type/13/'
  };

  beforeEach(async () => {
    pokemonListServiceSpy = jasmine.createSpyObj('PokemonListService', ['getPokemonByType', 'getPokemonDetails']);
    pokemonListServiceSpy.getPokemonByType.and.returnValue(of({ pokemon: [] } as any));

    TestBed.configureTestingModule({
      declarations: [ PokemonTypeComponent ],
      providers: [
        { provide: PokemonListService, useValue: pokemonListServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonTypeComponent);
    component = fixture.componentInstance;
    component.pokemonType = pokemonTypeStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown state', () => {
    expect(component.isDropdownOpen).toBe(false);

    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(true);

    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(false);
  });

  it('should load pokemon when opening dropdown without cached names', () => {
    const loadSpy = spyOn(component, 'loadPokemonForType').and.callThrough();

    component.toggleDropdown();

    expect(loadSpy).toHaveBeenCalled();
  });

  it('should not load pokemon when opening dropdown with cached names', () => {
    component.pokemonNames = ['pikachu'];
    const loadSpy = spyOn(component, 'loadPokemonForType');

    component.toggleDropdown();

    expect(loadSpy).not.toHaveBeenCalled();
  });

  it('should map pokemon names on successful load', () => {
    pokemonListServiceSpy.getPokemonByType.and.returnValue(of({
      pokemon: [
        { pokemon: { name: 'pikachu' } },
        { pokemon: { name: 'raichu' } }
      ]
    } as any));

    component.loadPokemonForType();

    expect(component.isLoadingPokemon).toBe(false);
    expect(component.pokemonLoadError).toBe('');
    expect(component.pokemonNames).toEqual(['pikachu', 'raichu']);
  });

  it('should set empty-results error when no pokemon are returned', () => {
    pokemonListServiceSpy.getPokemonByType.and.returnValue(of({ pokemon: [] } as any));

    component.loadPokemonForType();

    expect(component.pokemonNames).toEqual([]);
    expect(component.pokemonLoadError).toBe('No pokemon were found for electric.');
    expect(component.isLoadingPokemon).toBe(false);
  });

  it('should set load error and clear names on failure', () => {
    pokemonListServiceSpy.getPokemonByType.and.returnValue(throwError(() => new Error('network')));
    component.pokemonNames = ['pikachu'];

    component.loadPokemonForType();

    expect(component.pokemonNames).toEqual([]);
    expect(component.pokemonLoadError).toBe('Pokemon data could not be found for electric.');
    expect(component.isLoadingPokemon).toBe(false);
  });

  it('should call getPokemonDetails when selecting valid pokemon name', () => {
    component.selectPokemon('pikachu');

    expect(pokemonListServiceSpy.getPokemonDetails).toHaveBeenCalledWith('pikachu');
  });

  it('should not call getPokemonDetails when selecting empty pokemon name', () => {
    component.selectPokemon('');

    expect(pokemonListServiceSpy.getPokemonDetails).not.toHaveBeenCalled();
  });

  it('should unsubscribe from typePokemonSub on destroy', () => {
    const testSub = new Subscription();
    const unsubscribeSpy = spyOn(testSub, 'unsubscribe');
    (component as any).typePokemonSub = testSub;

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
