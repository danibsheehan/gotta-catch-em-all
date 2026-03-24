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
});
