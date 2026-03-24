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
      imports: [PokemonDetailsComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pokemonDetails', pokemonStub);
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
    expect(image.loading).toBe('lazy');
    expect(image.getAttribute('fetchpriority')).toBeNull();
  });

  it('should prioritize LCP image when prioritizeLcp is true', () => {
    fixture.componentRef.setInput('prioritizeLcp', true);
    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector('.pokemon-image') as HTMLImageElement;
    expect(image.loading).toBe('eager');
    expect(image.getAttribute('fetchpriority')).toBe('high');
  });

  it('should render placeholder when sprite is missing', () => {
    fixture.componentRef.setInput('pokemonDetails', {
      name: 'ditto',
      sprites: {} as any,
      stats: []
    });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const placeholder = compiled.querySelector('.pokemon-image-placeholder');
    expect(placeholder).toBeTruthy();
  });
});
