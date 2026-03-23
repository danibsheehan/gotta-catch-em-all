import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { PokemonListComponent } from './pokemon-list.component';
import { PokemonListService } from 'src/app/pokemon-list.service';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonListServiceSpy: jasmine.SpyObj<PokemonListService>;

  beforeEach(async () => {
    pokemonListServiceSpy = jasmine.createSpyObj('PokemonListService', ['getPokemonDetails']);

    TestBed.configureTestingModule({
      declarations: [ PokemonListComponent ],
      providers: [
        { provide: PokemonListService, useValue: pokemonListServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set searchList when pokemonList has previous value in ngOnChanges', () => {
    const previousValue = { pokemon: [{ pokemon: { name: 'pikachu' } }] } as any;
    const currentValue = { pokemon: [{ pokemon: { name: 'charizard' } }] } as any;

    component.ngOnChanges({
      pokemonList: new SimpleChange(previousValue, currentValue, false)
    });

    expect(component.searchList).toEqual(currentValue);
  });

  it('should not set searchList on first pokemonList change', () => {
    const currentValue = { pokemon: [{ pokemon: { name: 'bulbasaur' } }] } as any;

    component.ngOnChanges({
      pokemonList: new SimpleChange(undefined, currentValue, true)
    });

    expect(component.searchList).toBeUndefined();
  });

  it('should call service getPokemonDetails', () => {
    component.getPokemonDetails('pikachu');

    expect(pokemonListServiceSpy.getPokemonDetails).toHaveBeenCalledWith('pikachu');
  });
});
