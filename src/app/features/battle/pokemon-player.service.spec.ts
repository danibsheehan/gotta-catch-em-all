import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonPlayerService } from './pokemon-player.service';

describe('PokemonPlayerService', () => {
  let service: PokemonPlayerService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  beforeEach(() => {
    service = TestBed.inject(PokemonPlayerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

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

  it('should clear details and error on clearPlayerSelection', () => {
    service.getPokemonDetails('pikachu');
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    req.flush({
      name: 'pikachu',
      sprites: { front_default: 'image' },
      stats: []
    });
    service.clearPlayerSelection();
    expect(service.pokemonDetails.value).toEqual({});
    expect(service.pokemonDetailsError.value).toBe('');
  });
});
