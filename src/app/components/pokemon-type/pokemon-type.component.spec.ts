import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTypeComponent } from './pokemon-type.component';
import { PokemonType } from 'src/app/pokemon-type';

describe('PokemonTypeComponent', () => {
  let component: PokemonTypeComponent;
  let fixture: ComponentFixture<PokemonTypeComponent>;
  const pokemonTypeStub: PokemonType = {
    name: 'electric',
    url: 'https://pokeapi.co/api/v2/type/13/'
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ PokemonTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonTypeComponent);
    component = fixture.componentInstance;
    component.pokemonType = pokemonTypeStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
