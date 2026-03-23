import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonListService } from './pokemon-list.service';

describe('PokemonListService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  it('should be created', () => {
    const service: PokemonListService = TestBed.inject(PokemonListService);
    expect(service).toBeTruthy();
  });
});
