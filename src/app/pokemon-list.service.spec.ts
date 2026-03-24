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

    const typeListReq = httpMock.expectOne('https://pokeapi.co/api/v2/type/');
    expect(typeListReq.request.method).toBe('GET');
    typeListReq.flush({
      count: 1,
      results: [{ name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' }]
    });

    expect(response.results.length).toBe(1);
    expect(response.results[0].name).toBe('electric');
    expect(response.results[0].pokemon).toBeUndefined();
  });

  it('should request pokemon names for a single type', () => {
    let response: any;

    service.getPokemonByType('electric').subscribe(data => {
      response = data;
    });

    const typeDetailsReq = httpMock.expectOne('https://pokeapi.co/api/v2/type/electric');
    expect(typeDetailsReq.request.method).toBe('GET');
    typeDetailsReq.flush({
      pokemon: [
        { pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' } }
      ]
    });

    expect(response).toEqual([
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ]);
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
