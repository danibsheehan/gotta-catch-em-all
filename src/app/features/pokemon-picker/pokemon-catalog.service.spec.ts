import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonCatalogService } from './pokemon-catalog.service';

describe('PokemonCatalogService', () => {
  let service: PokemonCatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  beforeEach(() => {
    service = TestBed.inject(PokemonCatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request pokemon types from API', () => {
    let response: any;
    service.getPokemonTypes().subscribe((data) => { response = data; });
    const typeListReq = httpMock.expectOne('https://pokeapi.co/api/v2/type/');
    expect(typeListReq.request.method).toBe('GET');
    typeListReq.flush({
      count: 1,
      results: [{ name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' }]
    });
    expect(response.results.length).toBe(1);
    expect(response.results[0].name).toBe('electric');
  });

  it('should request pokemon names for a single type', () => {
    let response: any;
    service.getPokemonByType('electric').subscribe((data) => { response = data; });
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

  it('should not issue a second HTTP request when getPokemonTypes is subscribed again after the first completes', () => {
    const first: unknown[] = [];
    service.getPokemonTypes().subscribe((data) => first.push(data));
    const typeListReq = httpMock.expectOne('https://pokeapi.co/api/v2/type/');
    const payload = {
      count: 1,
      results: [{ name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' }],
    };
    typeListReq.flush(payload);

    let second: unknown;
    service.getPokemonTypes().subscribe((data) => {
      second = data;
    });
    expect(second).toEqual(payload);
    expect(first[0]).toEqual(payload);
  });

  it('should not issue a second HTTP request when getPokemonByType is called again for the same type', () => {
    let first: unknown;
    service.getPokemonByType('electric').subscribe((data) => {
      first = data;
    });
    const typeDetailsReq = httpMock.expectOne('https://pokeapi.co/api/v2/type/electric');
    const briefs = [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }];
    typeDetailsReq.flush({
      pokemon: [{ pokemon: briefs[0] }],
    });
    expect(first).toEqual(briefs);

    let second: unknown;
    service.getPokemonByType('electric').subscribe((data) => {
      second = data;
    });
    expect(second).toEqual(briefs);
  });
});
