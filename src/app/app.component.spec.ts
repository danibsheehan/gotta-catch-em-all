import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { PokemonListService } from './pokemon-list.service';

describe('AppComponent', () => {
  let pokemonListServiceSpy: jasmine.SpyObj<PokemonListService>;
  let detailsSubject: BehaviorSubject<any>;
  let detailsErrorSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    detailsSubject = new BehaviorSubject<any>({});
    detailsErrorSubject = new BehaviorSubject<string>('');
    pokemonListServiceSpy = jasmine.createSpyObj('PokemonListService', ['getPokemonOpponent'], {
      pokemonDetails: detailsSubject,
      pokemonDetailsError: detailsErrorSubject
    });
    pokemonListServiceSpy.getPokemonOpponent.and.returnValue(of({
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

  it('should subscribe to details and detail errors on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();
    detailsSubject.next({ name: 'charizard' });
    detailsErrorSubject.next('details error');

    expect(app.pokemonDetails.name).toBe('charizard');
    expect(app.pokemonDetailsError).toBe('details error');
  });

  it('should set opponent and selected flag on opponent success', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.getPokemonOpponent();

    expect(app.pokemonOpponent.name).toBe('pikachu');
    expect(app.pokemonOpponentSelected).toBe(true);
  });

  it('should set fallback opponent and selected flag on opponent failure', () => {
    pokemonListServiceSpy.getPokemonOpponent.and.returnValue(throwError(() => new Error('failed')));
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.getPokemonOpponent();

    expect(app.pokemonOpponent).toEqual({});
    expect(app.pokemonOpponentSelected).toBe(true);
  });

  it('should unsubscribe aggregated subscriptions on destroy', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const unsubscribeSpy = spyOn((app as any).subscriptions, 'unsubscribe');

    app.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
