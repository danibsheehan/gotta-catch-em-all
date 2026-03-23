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

  it('should render pokemon name and image when provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.pokemon-name')?.textContent).toContain('pikachu');
    const image = compiled.querySelector('.pokemon-image') as HTMLImageElement;
    expect(image).toBeTruthy();
    expect(image.src).toContain('https://example.com/pikachu.png');
  });

  it('should render placeholder when sprite is missing', () => {
    component.pokemonDetails = {
      name: 'ditto',
      sprites: {} as any,
      stats: []
    };
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const placeholder = compiled.querySelector('.pokemon-image-placeholder');
    expect(placeholder).toBeTruthy();
  });
});
