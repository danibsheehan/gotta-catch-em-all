import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonOpponentService } from './pokemon-opponent.service';

describe('PokemonOpponentService', () => {
  let service: PokemonOpponentService;
  let httpMock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  beforeEach(() => {
    service = TestBed.inject(PokemonOpponentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should request a random opponent pokemon ID', () => {
    spyOn(Math, 'random').and.returnValue(0.5);
    let response: any;
    service.getPokemonOpponent().subscribe((data) => { response = data; });
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/482');
    expect(req.request.method).toBe('GET');
    req.flush({
      name: 'azelf',
      sprites: { front_default: 'image' },
      stats: []
    });
    expect(response.name).toBe('azelf');
  });

  it('should build default front sprite url from environment base', () => {
    expect(service.defaultFrontSpriteUrl(25)).toContain('/25.png');
  });

  it('should GET pokemon by numeric id via getPokemonById', () => {
    let body: { name?: string } | undefined;
    service.getPokemonById(25).subscribe((p) => {
      body = p;
    });
    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/25');
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'pikachu', sprites: { front_default: 'x' }, stats: [] });
    expect(body?.name).toBe('pikachu');
  });

  it('should map random 0.5 to mid-range id via pickRandomOpponentId', () => {
    spyOn(Math, 'random').and.returnValue(0.5);
    const id = service.pickRandomOpponentId();
    expect(id).toBe(Math.ceil(0.5 * 964));
  });
});
