import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonComponent } from './pokemon.component';
import { PokemonBrief } from 'src/app/shared/models/pokemon';

describe('PokemonComponent', () => {
  let component: PokemonComponent;
  let fixture: ComponentFixture<PokemonComponent>;
  const pokemonBriefStub: PokemonBrief = {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25/'
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [PokemonComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonComponent);
    component = fixture.componentInstance;
    component.pokemonBrief = pokemonBriefStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render pokemon name when provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('pikachu');
  });

  it('should not render name text when pokemonBrief name is missing', () => {
    component.pokemonBrief = {} as PokemonBrief;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent?.trim()).toBe('');
  });
});
