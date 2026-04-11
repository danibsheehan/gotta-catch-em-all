import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { AudioService } from 'src/app/core/audio/audio.service';
import { PokemonBattleResultComponent } from './pokemon-battle-result.component';
import { BattleHistoryService } from '../battle-history.service';
import { PokemonBattleService } from '../pokemon-battle.service';
import { SPECIAL_ATTACK_LOSE_MESSAGE, SPECIAL_ATTACK_WIN_MESSAGE } from '../special-attack-battle';
import { Pokemon } from 'src/app/shared/models/pokemon';

describe('PokemonBattleResultComponent', () => {
  let component: PokemonBattleResultComponent;
  let fixture: ComponentFixture<PokemonBattleResultComponent>;
  let battle: jasmine.SpyObj<PokemonBattleService>;
  let battleHistory: jasmine.SpyObj<BattleHistoryService>;
  let audio: jasmine.SpyObj<Pick<AudioService, 'playBattleResult'>>;
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
    battleHistory = jasmine.createSpyObj('BattleHistoryService', ['recordMatch']);
    audio = jasmine.createSpyObj('AudioService', ['playBattleResult']);
    TestBed.configureTestingModule({
      imports: [PokemonBattleResultComponent],
      providers: [
        { provide: PokemonBattleService, useValue: battle },
        { provide: BattleHistoryService, useValue: battleHistory },
        { provide: AudioService, useValue: audio },
        provideNoopAnimations(),
      ],
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
    component.pokemonChoice = {} as Partial<Pokemon>;
    component.pokemonOpponent = pokemonOpponentStub;

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(pokemonChoiceStub, component.pokemonChoice, false)
    });

    tick(0);
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

  it('should show resolving state until outcome is ready', fakeAsync(() => {
    component.ngOnChanges({
      pokemonChoice: new SimpleChange(null, pokemonChoiceStub, true),
      pokemonOpponent: new SimpleChange(null, pokemonOpponentStub, true)
    });
    expect(component.isResolvingBattle).toBe(true);
    tick(2000);
    expect(component.isResolvingBattle).toBe(false);
  }));

  it('should set win result when choice attack is greater', fakeAsync(() => {
    component.pokemonChoice = pokemonChoiceStub;
    component.pokemonOpponent = pokemonOpponentStub;

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(null, pokemonChoiceStub, true),
      pokemonOpponent: new SimpleChange(null, pokemonOpponentStub, true)
    });
    tick(2000);

    expect(component.battleResult).toBe(SPECIAL_ATTACK_WIN_MESSAGE);
    expect(component.pokemonVictor).toEqual(pokemonChoiceStub);
    expect(battleHistory.recordMatch).toHaveBeenCalledWith({
      opponentName: 'bulbasaur',
      playerName: 'pikachu',
      playerWon: true,
    });
    expect(audio.playBattleResult).toHaveBeenCalledWith(true);
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

    expect(component.battleResult).toBe(SPECIAL_ATTACK_LOSE_MESSAGE);
    expect(component.pokemonVictor).toEqual(pokemonOpponentStub);
    expect(battleHistory.recordMatch).toHaveBeenCalledWith({
      opponentName: 'bulbasaur',
      playerName: 'pikachu',
      playerWon: false,
    });
    expect(audio.playBattleResult).toHaveBeenCalledWith(false);
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

  it('should leave result empty when special-attack stat is missing from both', fakeAsync(() => {
    const noSpAtk: Pokemon = {
      name: 'a',
      sprites: { front_default: '' },
      stats: [{ base_stat: 10, stat: { name: 'hp' } }],
    };
    component.pokemonChoice = noSpAtk;
    component.pokemonOpponent = { ...noSpAtk, name: 'b' };

    component.ngOnChanges({
      pokemonChoice: new SimpleChange(pokemonChoiceStub, noSpAtk, false),
      pokemonOpponent: new SimpleChange(pokemonOpponentStub, component.pokemonOpponent, false),
    });
    tick(2000);

    expect(component.battleResult).toBe('');
    expect(component.pokemonVictor).toBeUndefined();
    expect(component.choiceAttack).toBeUndefined();
    expect(component.opponentAttack).toBeUndefined();
    expect(component.isResolvingBattle).toBe(false);
    expect(battleHistory.recordMatch).not.toHaveBeenCalled();
  }));
});
