import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTypeComponent } from './pokemon-type.component';
import { PokemonType } from 'src/app/pokemon-type';
import { PokemonListService } from 'src/app/pokemon-list.service';

describe('PokemonTypeComponent', () => {
  let component: PokemonTypeComponent;
  let fixture: ComponentFixture<PokemonTypeComponent>;
  let pokemonListServiceSpy: jasmine.SpyObj<PokemonListService>;
  const pokemonTypeStub: PokemonType = {
    name: 'electric',
    url: 'https://pokeapi.co/api/v2/type/13/',
    pokemon: [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' }
    ]
  };

  beforeEach(async () => {
    pokemonListServiceSpy = jasmine.createSpyObj('PokemonListService', ['getPokemonDetails']);

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

  it('should provide pokemon names immediately from input type data', () => {
    expect(component.pokemonNames).toEqual(['pikachu', 'raichu']);
  });

  it('should return empty-results error when no pokemon are provided', () => {
    component.pokemonType = { ...pokemonTypeStub, pokemon: [] };
    expect(component.pokemonNames).toEqual([]);
    expect(component.pokemonLoadError).toBe('No pokemon were found for electric.');
  });

  it('should return load error when pokemon data is missing', () => {
    component.pokemonType = { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' };
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
