import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { PokemonListService } from './pokemon-list.service';

describe('AppComponent', () => {
  let pokemonListServiceSpy: jasmine.SpyObj<PokemonListService>;
  let detailsSubject: BehaviorSubject<any>;
  let detailsErrorSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    detailsSubject = new BehaviorSubject<any>({});
    detailsErrorSubject = new BehaviorSubject<string>('');
    pokemonListServiceSpy = jasmine.createSpyObj('PokemonListService', ['pickRandomOpponentId', 'getPokemonById']);
    (pokemonListServiceSpy as any).pokemonDetails = detailsSubject;
    (pokemonListServiceSpy as any).pokemonDetailsError = detailsErrorSubject;
    pokemonListServiceSpy.pickRandomOpponentId.and.returnValue(25);
    pokemonListServiceSpy.getPokemonById.and.returnValue(of({
      name: 'pikachu',
      sprites: { front_default: 'image' },
      stats: []
    } as any));

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: PokemonListService, useValue: pokemonListServiceSpy }
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

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Pokemon Battle Royale!');
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
    pokemonListServiceSpy.getPokemonById.and.returnValue(throwError(() => new Error('failed')));
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
