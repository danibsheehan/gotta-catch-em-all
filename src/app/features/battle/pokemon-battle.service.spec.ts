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

  it('should set playerLoading true until player request completes', (done) => {
    const initial = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    initial.flush({ name: 'foe', sprites: {}, stats: [] });

    service.selectPlayerPokemon('pikachu');
    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');

    service.vm$.pipe(
      filter((vm) => vm.playerLoading && !vm.player?.name),
      take(1),
    ).subscribe((vm) => {
      expect(vm.playerLoading).toBe(true);
      playerReq.flush({
        name: 'pikachu',
        sprites: { front_default: 'x' },
        stats: [],
      });
    });

    service.vm$.pipe(
      filter((vm) => !vm.playerLoading && vm.player.name === 'pikachu'),
      take(1),
    ).subscribe(() => done());
  });

  it('should merge player selection into vm', (done) => {
    service.selectPlayerPokemon('pikachu');

    service.vm$.pipe(
      filter((vm) => vm.player.name === 'pikachu'),
      take(1),
    ).subscribe((vm) => {
      expect(vm.player.name).toBe('pikachu');
      expect(vm.playerLoading).toBe(false);
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

  it('should clear player and request a new opponent on playAgain', (done) => {
    service.selectPlayerPokemon('pikachu');

    const initialOpponentReq = httpMock.expectOne((r) => r.url.includes('/pokemon/') && !r.url.endsWith('/pikachu'));
    initialOpponentReq.flush({ name: 'foe', sprites: {}, stats: [] });

    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    playerReq.flush({ name: 'pikachu', sprites: {}, stats: [] });

    service.playAgain();

    const nextOpponentReq = httpMock.expectOne((r) => r.url.includes('/pokemon/') && !r.url.endsWith('/pikachu'));
    nextOpponentReq.flush({ name: 'newfoe', sprites: {}, stats: [] });

    service.vm$.pipe(
      filter((vm) => !vm.opponentLoading && vm.opponent.name === 'newfoe'),
      take(1),
    ).subscribe((vm) => {
      expect(vm.opponent.name).toBe('newfoe');
      expect(vm.player.name).toBeUndefined();
      done();
    });
  });

  it('should emit closeSelectorDropdowns before reloading on playAgain', (done) => {
    const initial = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    initial.flush({ name: 'foe', sprites: {}, stats: [] });

    let sawClose = false;
    service.closeSelectorDropdowns$.pipe(take(1)).subscribe(() => {
      sawClose = true;
    });

    service.playAgain();

    expect(sawClose).toBe(true);

    const next = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    next.flush({ name: 'foe2', sprites: {}, stats: [] });
    done();
  });

  it('should expose empty opponent and stop loading when opponent request fails', (done) => {
    service.vm$.pipe(
      filter((vm) => !vm.opponentLoading),
      take(1),
    ).subscribe((vm) => {
      expect(vm.opponent).toEqual({});
      done();
    });

    const req = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('should surface playerError on vm when player request fails', (done) => {
    const initial = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    initial.flush({ name: 'foe', sprites: {}, stats: [] });

    service.selectPlayerPokemon('missingno');

    service.vm$.pipe(
      filter((vm) => vm.playerError.length > 0),
      take(1),
    ).subscribe((vm) => {
      expect(vm.playerError).toBe(
        'Pokemon data could not be found. Please choose another pokemon.',
      );
      expect(vm.player).toEqual({});
      done();
    });

    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/missingno');
    playerReq.flush('not found', { status: 404, statusText: 'Not Found' });
  });

  it('should fetch another opponent when loadOpponent is called', (done) => {
    const first = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    first.flush({ name: 'first', sprites: {}, stats: [] });

    service.loadOpponent();

    const second = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    second.flush({ name: 'second', sprites: {}, stats: [] });

    service.vm$.pipe(
      filter((vm) => !vm.opponentLoading && vm.opponent.name === 'second'),
      take(1),
    ).subscribe((vm) => {
      expect(vm.opponent.name).toBe('second');
      done();
    });
  });
});
