import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { BehaviorSubject, firstValueFrom, of, throwError } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { PokemonBattleService, PokemonBattleVm } from './features/battle/pokemon-battle.service';
import { PokemonOpponentService } from './features/battle/pokemon-opponent.service';
import { PokemonPlayerService } from './features/battle/pokemon-player.service';

describe('AppComponent', () => {
  let pokemonPlayerSpy: {
    getPokemonDetails: ReturnType<typeof vi.fn>;
    pokemonDetails?: BehaviorSubject<any>;
    pokemonDetailsError?: BehaviorSubject<string>;
    playerDetailsLoading?: BehaviorSubject<boolean>;
  };
  let pokemonOpponentSpy: {
    pickRandomOpponentId: ReturnType<typeof vi.fn>;
    getPokemonById: ReturnType<typeof vi.fn>;
    defaultFrontSpriteUrl: ReturnType<typeof vi.fn>;
  };
  let detailsSubject: BehaviorSubject<any>;
  let detailsErrorSubject: BehaviorSubject<string>;
  let playerLoadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    detailsSubject = new BehaviorSubject<any>({});
    detailsErrorSubject = new BehaviorSubject<string>('');
    playerLoadingSubject = new BehaviorSubject<boolean>(false);
    pokemonPlayerSpy = {
      getPokemonDetails: vi.fn(),
      pokemonDetails: detailsSubject,
      pokemonDetailsError: detailsErrorSubject,
      playerDetailsLoading: playerLoadingSubject,
    };

    pokemonOpponentSpy = {
      pickRandomOpponentId: vi.fn(),
      getPokemonById: vi.fn(),
      defaultFrontSpriteUrl: vi.fn(),
    };
    pokemonOpponentSpy.pickRandomOpponentId.mockReturnValue(25);
    pokemonOpponentSpy.defaultFrontSpriteUrl.mockReturnValue('https://sprites.example/25.png');
    pokemonOpponentSpy.getPokemonById.mockReturnValue(of({
      name: 'pikachu',
      sprites: { front_default: 'image' },
      stats: [],
    } as any));

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        PokemonBattleService,
        { provide: PokemonPlayerService, useValue: pokemonPlayerSpy },
        { provide: PokemonOpponentService, useValue: pokemonOpponentSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'gotta-catch-em-all'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('gotta-catch-em-all');
  });

  it('should render battle shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.battle-container')).toBeTruthy();
  });

  it('arenaAmbientType should prefer player primary type over opponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const vm: PokemonBattleVm = {
      opponentLoading: false,
      opponent: {
        types: [{ slot: 1, type: { name: 'water', url: '' } }],
      } as any,
      player: {
        types: [
          { slot: 2, type: { name: 'flying', url: '' } },
          { slot: 1, type: { name: 'fire', url: '' } },
        ],
      } as any,
      playerError: '',
      playerLoading: false,
    };
    expect(app.arenaAmbientType(vm)).toBe('fire');
  });

  it('should expose player details and errors on the battle view model', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const battle = fixture.componentInstance.battle;

    detailsSubject.next({ name: 'charizard' } as any);
    detailsErrorSubject.next('details error');

    const vm = await firstValueFrom(battle.vm$.pipe(take(1)));
    expect((vm.player as any).name).toBe('charizard');
    expect(vm.playerError).toBe('details error');
    expect(vm.playerLoading).toBe(false);
  });

  it('should set opponent on battle vm when opponent fetch succeeds', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const battle = fixture.componentInstance.battle;

    const vm = await firstValueFrom(
      battle.vm$.pipe(
        filter((v) => !v.opponentLoading && !!v.opponent.name),
        take(1),
      ),
    );
    expect(vm.opponent.name).toBe('pikachu');
  });

  it('should set fallback opponent on battle vm when opponent fetch fails', async () => {
    pokemonOpponentSpy.getPokemonById.mockReturnValue(throwError(() => new Error('failed')));

    detailsSubject = new BehaviorSubject<any>({});
    detailsErrorSubject = new BehaviorSubject<string>('');
    const playerLoadingSubjectFallback = new BehaviorSubject<boolean>(false);
    const playerSpy = {
      getPokemonDetails: vi.fn(),
      pokemonDetails: detailsSubject,
      pokemonDetailsError: detailsErrorSubject,
      playerDetailsLoading: playerLoadingSubjectFallback,
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        PokemonBattleService,
        { provide: PokemonPlayerService, useValue: playerSpy },
        { provide: PokemonOpponentService, useValue: pokemonOpponentSpy },
      ],
    });

    const fixture = TestBed.createComponent(AppComponent);
    const battle = fixture.componentInstance.battle;

    const vm = await firstValueFrom(
      battle.vm$.pipe(
        filter((v) => !v.opponentLoading),
        take(1),
      ),
    );
    expect(vm.opponent).toEqual({} as any);
  });
});
