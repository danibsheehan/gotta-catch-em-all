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

  afterEach(() => httpMock.verify({ ignoreCancelled: true }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getPokemonDetails()', () => {
    it('should update pokemonDetails and clear error on success', () => {
      service.pokemonDetailsError.next('previous error');
      service.getPokemonDetails('pikachu');
      expect(service.playerDetailsLoading.value).toBe(true);
      expect(service.pokemonDetails.value).toEqual({});
      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
      req.flush({
        name: 'pikachu',
        sprites: { front_default: 'image' },
        stats: []
      });
      expect(service.pokemonDetails.value.name).toBe('pikachu');
      expect(service.pokemonDetailsError.value).toBe('');
      expect(service.playerDetailsLoading.value).toBe(false);
    });

    it('should set fallback details and error on failure', () => {
      service.getPokemonDetails('missingno');
      expect(service.playerDetailsLoading.value).toBe(true);
      const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/missingno');
      req.flush('not found', { status: 404, statusText: 'Not Found' });
      expect(service.pokemonDetails.value).toEqual({});
      expect(service.pokemonDetailsError.value).toBe("couldn't load that pokémon — try another? 🔄");
      expect(service.playerDetailsLoading.value).toBe(false);
    });

    it('should not issue HTTP when name is empty', () => {
      service.getPokemonDetails('');
      expect(httpMock.match(() => true).length).toBe(0);
    });

    it('should only apply the latest request when selection changes quickly', () => {
      service.getPokemonDetails('eevee');
      service.getPokemonDetails('pikachu');
      httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu').flush({
        name: 'pikachu',
        sprites: { front_default: 'image' },
        stats: [],
      });
      expect(service.pokemonDetails.value.name).toBe('pikachu');
    });
  });

  describe('clearPlayerSelection()', () => {
    it('should clear details and error after a successful fetch', () => {
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
      expect(service.playerDetailsLoading.value).toBe(false);
    });
  });
});
