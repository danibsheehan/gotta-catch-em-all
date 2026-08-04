import type { Mock } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { PokemonBattleService } from './pokemon-battle.service';
import { PokemonPlayerService } from './pokemon-player.service';

describe('PokemonBattleService', () => {
  let service: PokemonBattleService;
  let httpMock: HttpTestingController;
  let scrollIntoViewSpy: Mock;

  beforeEach(() => {
    scrollIntoViewSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(() => undefined);
    const arena = document.createElement('div');
    arena.id = 'battle-arena';
    document.body.appendChild(arena);

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

  afterEach(() => {
    document.getElementById('battle-arena')?.remove();
    httpMock.verify();
  });

  it('should load opponent on init and expose on vm', async () => {
    const vmPromise = firstValueFrom(
      service.vm$.pipe(
        filter((vm) => !vm.opponentLoading && vm.opponent.name === 'bulbasaur'),
        take(1),
      ),
    );

    const req = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    req.flush({
      name: 'bulbasaur',
      sprites: { front_default: 'x' },
      stats: [],
    });

    const vm = await vmPromise;
    expect(vm.opponent.name).toBe('bulbasaur');
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it('should set playerLoading true until player request completes', async () => {
    const initial = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    initial.flush({ name: 'foe', sprites: {}, stats: [] });

    service.selectPlayerPokemon('pikachu');
    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');

    const loadingVm = await firstValueFrom(
      service.vm$.pipe(
        filter((vm) => vm.playerLoading && !vm.player?.name),
        take(1),
      ),
    );
    expect(loadingVm.playerLoading).toBe(true);

    const loadedPromise = firstValueFrom(
      service.vm$.pipe(
        filter((vm) => !vm.playerLoading && vm.player.name === 'pikachu'),
        take(1),
      ),
    );
    playerReq.flush({
      name: 'pikachu',
      sprites: { front_default: 'x' },
      stats: [],
    });
    await loadedPromise;
  });

  it('should merge player selection into vm', async () => {
    service.selectPlayerPokemon('pikachu');

    const vmPromise = firstValueFrom(
      service.vm$.pipe(
        filter((vm) => vm.player.name === 'pikachu'),
        take(1),
      ),
    );

    const opponentReq = httpMock.expectOne(
      (r) => r.url.includes('/pokemon/') && !r.url.endsWith('/pikachu'),
    );
    opponentReq.flush({ name: 'foe', sprites: {}, stats: [] });

    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    playerReq.flush({
      name: 'pikachu',
      sprites: { front_default: 'x' },
      stats: [],
    });

    const vm = await vmPromise;
    expect(vm.player.name).toBe('pikachu');
    expect(vm.playerLoading).toBe(false);
  });

  it('should clear player and request a new opponent on playAgain', async () => {
    service.selectPlayerPokemon('pikachu');

    const initialOpponentReq = httpMock.expectOne(
      (r) => r.url.includes('/pokemon/') && !r.url.endsWith('/pikachu'),
    );
    initialOpponentReq.flush({ name: 'foe', sprites: {}, stats: [] });

    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    playerReq.flush({ name: 'pikachu', sprites: {}, stats: [] });

    service.playAgain();

    const nextOpponentReq = httpMock.expectOne(
      (r) => r.url.includes('/pokemon/') && !r.url.endsWith('/pikachu'),
    );
    nextOpponentReq.flush({ name: 'newfoe', sprites: {}, stats: [] });

    const vm = await firstValueFrom(
      service.vm$.pipe(
        filter((v) => !v.opponentLoading && v.opponent.name === 'newfoe'),
        take(1),
      ),
    );
    expect(vm.opponent.name).toBe('newfoe');
    expect(vm.player.name).toBeUndefined();
  });

  it('should emit closeSelectorDropdowns before reloading on playAgain', () => {
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
  });

  it('should expose empty opponent and stop loading when opponent request fails', async () => {
    const vmPromise = firstValueFrom(
      service.vm$.pipe(
        filter((vm) => !vm.opponentLoading),
        take(1),
      ),
    );

    const req = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    req.flush('error', { status: 500, statusText: 'Server Error' });

    const vm = await vmPromise;
    expect(vm.opponent).toEqual({});
  });

  it('should surface playerError on vm when player request fails', async () => {
    const initial = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    initial.flush({ name: 'foe', sprites: {}, stats: [] });

    service.selectPlayerPokemon('missingno');

    const vmPromise = firstValueFrom(
      service.vm$.pipe(
        filter((vm) => vm.playerError.length > 0),
        take(1),
      ),
    );

    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/missingno');
    playerReq.flush('not found', { status: 404, statusText: 'Not Found' });

    const vm = await vmPromise;
    expect(vm.playerError).toBe("couldn't load that pokémon — try another? 🔄");
    expect(vm.player).toEqual({});
  });

  it('should fetch another opponent when loadOpponent is called', async () => {
    const first = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    first.flush({ name: 'first', sprites: {}, stats: [] });

    service.loadOpponent();

    const second = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    second.flush({ name: 'second', sprites: {}, stats: [] });

    const vm = await firstValueFrom(
      service.vm$.pipe(
        filter((v) => !v.opponentLoading && v.opponent.name === 'second'),
        take(1),
      ),
    );
    expect(vm.opponent.name).toBe('second');
  });

  it('should scroll battle arena into view after selecting a player pokemon', async () => {
    const initial = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    initial.flush({ name: 'foe', sprites: {}, stats: [] });

    service.selectPlayerPokemon('pikachu');
    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    playerReq.flush({
      name: 'pikachu',
      sprites: { front_default: 'x' },
      stats: [],
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(scrollIntoViewSpy).toHaveBeenCalledWith(expect.objectContaining({ block: 'start' }));
  });

  it('should scroll battle arena into view on playAgain', async () => {
    const initialOpponentReq = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    initialOpponentReq.flush({ name: 'foe', sprites: {}, stats: [] });

    service.selectPlayerPokemon('pikachu');
    const playerReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    playerReq.flush({ name: 'pikachu', sprites: {}, stats: [] });

    scrollIntoViewSpy.mockClear();

    service.playAgain();

    const nextOpponentReq = httpMock.expectOne((r) => r.url.includes('/pokemon/'));
    nextOpponentReq.flush({ name: 'newfoe', sprites: {}, stats: [] });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(scrollIntoViewSpy).toHaveBeenCalledWith(expect.objectContaining({ block: 'start' }));
  });
});
