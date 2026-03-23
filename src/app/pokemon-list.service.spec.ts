import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonListService } from './pokemon-list.service';

describe('PokemonListService', () => {
  let service: PokemonListService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  beforeEach(() => {
    service = TestBed.inject(PokemonListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request pokemon types from API', () => {
    let response: any;

    service.getPokemonTypes().subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/');
    expect(req.request.method).toBe('GET');
    req.flush({ results: [{ name: 'electric' }] });

    expect(response.results.length).toBe(1);
    expect(response.results[0].name).toBe('electric');
  });

  it('should request pokemon by type from API', () => {
    let response: any;

    service.getPokemonByType('fire').subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/fire');
    expect(req.request.method).toBe('GET');
    req.flush({ pokemon: [] });

    expect(response.pokemon).toEqual([]);
  });

  it('should update pokemonSearchResults when searching pokemon', () => {
    service.getPokemon('water');

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/water');
    req.flush({ pokemon: [{ pokemon: { name: 'squirtle' } }] });

    expect(service.pokemonSearchResults.value.pokemon[0].pokemon.name).toBe('squirtle');
  });

  it('should update pokemonDetails and clear error on getPokemonDetails success', () => {
    service.pokemonDetailsError.next('previous error');

    service.getPokemonDetails('pikachu');

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    req.flush({
      name: 'pikachu',
      sprites: { front_default: 'image' },
      stats: []
    });

    expect(service.pokemonDetails.value.name).toBe('pikachu');
    expect(service.pokemonDetailsError.value).toBe('');
  });

  it('should set fallback details and error on getPokemonDetails failure', () => {
    service.getPokemonDetails('missingno');

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/missingno');
    req.flush('not found', { status: 404, statusText: 'Not Found' });

    expect(service.pokemonDetails.value).toEqual({});
    expect(service.pokemonDetailsError.value).toBe('Pokemon data could not be found. Please choose another pokemon.');
  });

  it('should request a random opponent pokemon ID', () => {
    spyOn(Math, 'random').and.returnValue(0.5);
    let response: any;

    service.getPokemonOpponent().subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/482');
    expect(req.request.method).toBe('GET');
    req.flush({
      name: 'azelf',
      sprites: { front_default: 'image' },
      stats: []
    });

    expect(response.name).toBe('azelf');
  });
});
