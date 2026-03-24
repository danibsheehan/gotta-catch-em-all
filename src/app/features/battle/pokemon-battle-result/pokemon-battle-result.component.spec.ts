import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { PokemonBattleResultComponent } from './pokemon-battle-result.component';
import { PokemonBattleService } from '../pokemon-battle.service';
import { Pokemon } from 'src/app/shared/models/pokemon';

describe('PokemonBattleResultComponent', () => {
  let component: PokemonBattleResultComponent;
  let fixture: ComponentFixture<PokemonBattleResultComponent>;
  let battle: jasmine.SpyObj<PokemonBattleService>;
  const pokemonChoiceStub: Pokemon = {
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
    stats: [{ base_stat: 90, stat: { name: 'special-attack' } }]
  };
  const pokemonOpponentStub: Pokemon = {
    name: 'bulbasaur',
    sprites: { front_default: 'https://example.com/bulbasaur.png' },
    stats: [{ base_stat: 65, stat: { name: 'special-attack' } }]
  };

  beforeEach(async () => {
    battle = jasmine.createSpyObj('PokemonBattleService', ['playAgain']);
    TestBed.configureTestingModule({
      imports: [PokemonBattleResultComponent],
      providers: [{ provide: PokemonBattleService, useValue: battle }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonBattleResultComponent);
    component = fixture.componentInstance;
    component.pokemonChoice = pokemonChoiceStub;
    component.pokemonOpponent = pokemonOpponentStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not start battle when stats are missing', fakeAsync(() => {
    component.pokemonChoice = {} as any;
    component.pokemonOpponent = pokemonOpponentStub;

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(pokemonChoiceStub, component.pokemonChoice, false)
    });

    tick(5000);
    expect(component.battleResult).toBeFalsy();
    expect(component.choiceAttack).toBeUndefined();
  }));

  it('should clear existing timer before creating a new one', () => {
    const clearSpy = spyOn(window, 'clearTimeout').and.callThrough();

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(null, pokemonChoiceStub, true),
      pokemonOpponent: new SimpleChange(null, pokemonOpponentStub, true)
    });

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(pokemonChoiceStub, pokemonChoiceStub, false)
    });

    expect(clearSpy).toHaveBeenCalled();
  });

  it('should set win result when choice attack is greater', fakeAsync(() => {
    component.pokemonChoice = pokemonChoiceStub;
    component.pokemonOpponent = pokemonOpponentStub;

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(null, pokemonChoiceStub, true),
      pokemonOpponent: new SimpleChange(null, pokemonOpponentStub, true)
    });
    tick(2000);

    expect(component.battleResult).toBe('Congrats, you win!');
    expect(component.pokemonVictor).toEqual(pokemonChoiceStub);
  }));

  it('should set lose result when choice attack is not greater', fakeAsync(() => {
    component.pokemonChoice = {
      ...pokemonChoiceStub,
      stats: [{ base_stat: 50, stat: { name: 'special-attack' } }]
    };
    component.pokemonOpponent = pokemonOpponentStub;

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(null, component.pokemonChoice, true),
      pokemonOpponent: new SimpleChange(null, pokemonOpponentStub, true)
    });
    tick(2000);

    expect(component.battleResult).toBe('Uh oh, you lose this battle. Maybe next time!');
    expect(component.pokemonVictor).toEqual(pokemonOpponentStub);
  }));

  it('should clear timer on destroy', () => {
    const clearSpy = spyOn(window, 'clearTimeout').and.callThrough();
    (component as any).battleTimer = setTimeout(() => undefined, 5000);

    component.ngOnDestroy();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('should call battle.playAgain when Play again is clicked', fakeAsync(() => {
    component.ngOnChanges({
      pokemonChoice: new SimpleChange(null, pokemonChoiceStub, true),
      pokemonOpponent: new SimpleChange(null, pokemonOpponentStub, true)
    });
    tick(2000);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.play-again') as HTMLButtonElement;
    btn.click();

    expect(battle.playAgain).toHaveBeenCalled();
  }));
});
