import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { filter, take } from 'rxjs/operators';

import { PokemonBattleService } from './pokemon-battle.service';
import { PokemonPlayerService } from './pokemon-player.service';

describe('PokemonBattleService', () => {
  let service: PokemonBattleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PokemonBattleService,
        PokemonPlayerService,
      ],
    });
    service = TestBed.inject(PokemonBattleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should load opponent on init and expose on vm', (done) => {
    service.vm$.pipe(
      filter((vm) => !vm.opponentLoading && vm.opponent.name === 'bulbasaur'),
      take(1),
    ).subscribe((vm) => {
      expect(vm.opponent.name).toBe('bulbasaur');
      done();
    });

    const req = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    req.flush({
      name: 'bulbasaur',
      sprites: { front_default: 'x' },
      stats: [],
    });
  });

  it('should merge player selection into vm', (done) => {
    service.selectPlayerPokemon('pikachu');

    service.vm$.pipe(
      filter((vm) => vm.player.name === 'pikachu'),
      take(1),
    ).subscribe((vm) => {
      expect(vm.player.name).toBe('pikachu');
      done();
    });

    const opponentReq = httpMock.expectOne((r) => r.url.includes('/pokemon/') && !r.url.endsWith('/pikachu'));
    opponentReq.flush({ name: 'foe', sprites: {}, stats: [] });

    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    playerReq.flush({
      name: 'pikachu',
      sprites: { front_default: 'x' },
      stats: [],
    });
  });
});
