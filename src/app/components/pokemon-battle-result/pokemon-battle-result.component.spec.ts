import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonBattleResultComponent } from './pokemon-battle-result.component';
import { Pokemon } from 'src/app/pokemon';

describe('PokemonBattleResultComponent', () => {
  let component: PokemonBattleResultComponent;
  let fixture: ComponentFixture<PokemonBattleResultComponent>;
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
    TestBed.configureTestingModule({
      declarations: [ PokemonBattleResultComponent ]
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
});
