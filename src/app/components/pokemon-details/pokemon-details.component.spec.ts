import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsComponent } from './pokemon-details.component';
import { Pokemon } from 'src/app/pokemon';

describe('PokemonDetailsComponent', () => {
  let component: PokemonDetailsComponent;
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  const pokemonStub: Pokemon = {
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
    stats: []
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ PokemonDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonDetailsComponent);
    component = fixture.componentInstance;
    component.pokemonDetails = pokemonStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
