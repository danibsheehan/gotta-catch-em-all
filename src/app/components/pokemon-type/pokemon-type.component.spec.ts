import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

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
    pokemonListServiceSpy = jasmine.createSpyObj('PokemonListService', ['getPokemonDetails', 'getPokemonByType']);
    pokemonListServiceSpy.getPokemonByType.and.returnValue(of([
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' }
    ] as any));

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
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemon names when opening dropdown', () => {
    component.toggleTypeDropdown();

    expect(pokemonListServiceSpy.getPokemonByType).toHaveBeenCalledWith('electric');
    expect(component.pokemonNames).toEqual(['pikachu', 'raichu']);
    expect(component.isOpen).toBe(true);
  });

  it('should toggle closed without loading on second click', () => {
    component.toggleTypeDropdown();
    component.toggleTypeDropdown();

    expect(component.isOpen).toBe(false);
    expect(pokemonListServiceSpy.getPokemonByType).toHaveBeenCalledTimes(1);
  });

  it('should return empty-results error when no pokemon are provided', () => {
    pokemonListServiceSpy.getPokemonByType.and.returnValue(of([] as any));

    component.toggleTypeDropdown();

    expect(component.pokemonNames).toEqual([]);
    expect(component.pokemonLoadError).toBe('No pokemon were found for electric.');
  });

  it('should return load error when pokemon data request fails', () => {
    pokemonListServiceSpy.getPokemonByType.and.returnValue(throwError(() => new Error('failed')));

    component.toggleTypeDropdown();

    expect(component.pokemonNames).toEqual([]);
    expect(component.pokemonLoadError).toBe('Pokemon data could not be found for electric.');
  });

  it('should call getPokemonDetails when selecting valid pokemon name', () => {
    component.selectPokemon('pikachu');

    expect(pokemonListServiceSpy.getPokemonDetails).toHaveBeenCalledWith('pikachu');
  });

  it('should not call getPokemonDetails when selecting empty pokemon name', () => {
    component.selectPokemon('');

    expect(pokemonListServiceSpy.getPokemonDetails).not.toHaveBeenCalled();
  });

});
