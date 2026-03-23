import { TestBed } from '@angular/core/testing';

import { PokemonListService } from './pokemon-list.service';

describe('PokemonListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PokemonListService = TestBed.inject(PokemonListService);
    expect(service).toBeTruthy();
  });
});
