import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppComponent } from './app.component';
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
      declarations: [
        AppComponent
      ],
      providers: [
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

  it('should expose details and detail errors as observables from the service', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    detailsSubject.next({ name: 'charizard' } as any);
    detailsErrorSubject.next('details error');

    app.pokemonDetails$.pipe(take(1)).subscribe((details) => {
      expect((details as any).name).toBe('charizard');
      app.pokemonDetailsError$.pipe(take(1)).subscribe((error) => {
        expect(error).toBe('details error');
        done();
      });
    });
  });

  it('should set opponent and selected flag on opponent success', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.getPokemonOpponent();

    expect(app.pokemonOpponent.name).toBe('pikachu');
    expect(app.pokemonOpponentSelected).toBe(true);
  });

  it('should set fallback opponent and selected flag on opponent failure', () => {
    pokemonOpponentSpy.getPokemonById.and.returnValue(throwError(() => new Error('failed')));
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.getPokemonOpponent();

    expect(app.pokemonOpponent).toEqual({} as any);
    expect(app.pokemonOpponentSelected).toBe(true);
  });

  it('should unsubscribe opponent request on destroy', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.getPokemonOpponent();
    const unsubscribeSpy = spyOn((app as any).opponentSub, 'unsubscribe');

    app.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
