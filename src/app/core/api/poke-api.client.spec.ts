import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PokeApiClient } from './poke-api.client';

describe('PokeApiClient', () => {
  let client: PokeApiClient;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  beforeEach(() => {
    client = TestBed.inject(PokeApiClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET type index', () => {
    let body: unknown;
    client.getTypeIndex().subscribe((b) => { body = b; });
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/');
    expect(req.request.method).toBe('GET');
    req.flush({ count: 0, results: [] });
    expect(body).toEqual({ count: 0, results: [] });
  });

  it('should encode path segments for type detail and pokemon', () => {
    let typeOk = false;
    client.getTypeDetail('a/b').subscribe(() => { typeOk = true; });
    httpMock.expectOne('https://pokeapi.co/api/v2/type/a%2Fb').flush({ pokemon: [] });
    expect(typeOk).toBe(true);

    let pokemonOk = false;
    client.getPokemon('x y').subscribe(() => { pokemonOk = true; });
    httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/x%20y').flush({ name: 'x y', sprites: {} as any, stats: [] });
    expect(pokemonOk).toBe(true);
  });
});
