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
});
