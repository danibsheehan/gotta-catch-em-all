import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PokemonTypeComponent } from './pokemon-type.component';
import { PokemonType } from 'src/app/pokemon-type';
import { PokemonListService } from 'src/app/pokemon-list.service';

describe('PokemonTypeComponent', () => {
  let component: PokemonTypeComponent;
  let fixture: ComponentFixture<PokemonTypeComponent>;
  let pokemonListServiceSpy: jasmine.SpyObj<PokemonListService>;
  const pokemonTypeStub: PokemonType = {
    name: 'electric',
    url: 'https://pokeapi.co/api/v2/type/13/'
  };

  beforeEach(async () => {
    pokemonListServiceSpy = jasmine.createSpyObj('PokemonListService', ['getPokemonByType', 'getPokemonDetails']);
    pokemonListServiceSpy.getPokemonByType.and.returnValue(of({ pokemon: [] } as any));

    TestBed.configureTestingModule({
      declarations: [ PokemonTypeComponent ],
      providers: [
        { provide: PokemonListService, useValue: pokemonListServiceSpy }
      ]
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
