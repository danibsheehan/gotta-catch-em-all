import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { PokemonBattleService } from './pokemon/pokemon-battle.service';
import { PokemonOpponentService } from './pokemon/pokemon-opponent.service';
import { PokemonPlayerService } from './pokemon/pokemon-player.service';

describe('AppComponent', () => {
  let pokemonPlayerSpy: jasmine.SpyObj<PokemonPlayerService>;
  let pokemonOpponentSpy: jasmine.SpyObj<PokemonOpponentService>;
  let detailsSubject: BehaviorSubject<any>;
  let detailsErrorSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    detailsSubject = new BehaviorSubject<any>({});
    detailsErrorSubject = new BehaviorSubject<string>('');
    pokemonPlayerSpy = jasmine.createSpyObj('PokemonPlayerService', ['getPokemonDetails']);
    (pokemonPlayerSpy as any).pokemonDetails = detailsSubject;
    (pokemonPlayerSpy as any).pokemonDetailsError = detailsErrorSubject;

    pokemonOpponentSpy = jasmine.createSpyObj('PokemonOpponentService', ['pickRandomOpponentId', 'getPokemonById', 'defaultFrontSpriteUrl']);
    pokemonOpponentSpy.pickRandomOpponentId.and.returnValue(25);
    pokemonOpponentSpy.defaultFrontSpriteUrl.and.returnValue('https://sprites.example/25.png');
    pokemonOpponentSpy.getPokemonById.and.returnValue(of({
      name: 'pikachu',
      sprites: { front_default: 'image' },
      stats: []
    } as any));

    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PokemonBattleService,
        { provide: PokemonPlayerService, useValue: pokemonPlayerSpy },
        { provide: PokemonOpponentService, useValue: pokemonOpponentSpy }
      ]
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

  it('should expose player details and errors on the battle view model', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const battle = fixture.componentInstance.battle;

    detailsSubject.next({ name: 'charizard' } as any);
    detailsErrorSubject.next('details error');

    battle.vm$.pipe(take(1)).subscribe((vm) => {
      expect((vm.player as any).name).toBe('charizard');
      expect(vm.playerError).toBe('details error');
      done();
    });
  });

  it('should set opponent on battle vm when opponent fetch succeeds', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const battle = fixture.componentInstance.battle;

    battle.vm$.pipe(
      filter((vm) => !vm.opponentLoading && !!vm.opponent.name),
      take(1),
    ).subscribe((vm) => {
      expect(vm.opponent.name).toBe('pikachu');
      done();
    });
  });

  it('should set fallback opponent on battle vm when opponent fetch fails', (done) => {
    pokemonOpponentSpy.getPokemonById.and.returnValue(throwError(() => new Error('failed')));

    detailsSubject = new BehaviorSubject<any>({});
    detailsErrorSubject = new BehaviorSubject<string>('');
    const playerSpy = jasmine.createSpyObj('PokemonPlayerService', ['getPokemonDetails']);
    (playerSpy as any).pokemonDetails = detailsSubject;
    (playerSpy as any).pokemonDetailsError = detailsErrorSubject;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PokemonBattleService,
        { provide: PokemonPlayerService, useValue: playerSpy },
        { provide: PokemonOpponentService, useValue: pokemonOpponentSpy }
      ]
    });

    const fixture = TestBed.createComponent(AppComponent);
    const battle = fixture.componentInstance.battle;

    battle.vm$.pipe(
      filter((vm) => !vm.opponentLoading),
      take(1),
    ).subscribe((vm) => {
      expect(vm.opponent).toEqual({} as any);
      done();
    });
  });
});
