import { ComponentFixture, TestBed } from '@angular/core/testing';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';

import { PokemonCatalogService } from '../pokemon-catalog.service';
import { PokemonTypeList } from 'src/app/shared/models/pokemon-type-list';
import { PokemonSelectorComponent } from './pokemon-selector.component';

describe('PokemonSelectorComponent', () => {
  let fixture: ComponentFixture<PokemonSelectorComponent>;
  let pokemonCatalogSpy: {
    getPokemonTypes: ReturnType<typeof vi.fn>;
    getPokemonByType: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    pokemonCatalogSpy = {
      getPokemonTypes: vi.fn(),
      getPokemonByType: vi.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [PokemonSelectorComponent],
      providers: [{ provide: PokemonCatalogService, useValue: pokemonCatalogSpy }],
    }).compileComponents();
  });

  it('should create', () => {
    pokemonCatalogSpy.getPokemonTypes.mockReturnValue(of({ count: 0, results: [] }));
    fixture = TestBed.createComponent(PokemonSelectorComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose loaded types and clear error on success', async () => {
    pokemonCatalogSpy.getPokemonTypes.mockReturnValue(
      of({ count: 1, results: [{ name: 'fire', url: '' }] } as PokemonTypeList),
    );
    fixture = TestBed.createComponent(PokemonSelectorComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.isLoadingTypes).toBe(false);
    expect(component.pokemonTypesError).toBe('');
    await expect(firstValueFrom(component.pokemonTypes$)).resolves.toEqual([
      { name: 'fire', url: '' },
    ]);
  });

  it('should set error message and empty types on failure', async () => {
    pokemonCatalogSpy.getPokemonTypes.mockReturnValue(throwError(() => new Error('boom')));
    fixture = TestBed.createComponent(PokemonSelectorComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.pokemonTypesError).toBe('😵 types went missing — refresh and try again?');
    await expect(firstValueFrom(component.pokemonTypes$)).resolves.toEqual([]);
  });

  it('should set isLoadingTypes true synchronously after render, before the request resolves', async () => {
    const pending$ = new Subject<PokemonTypeList>();
    pokemonCatalogSpy.getPokemonTypes.mockReturnValue(pending$);
    fixture = TestBed.createComponent(PokemonSelectorComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.isLoadingTypes).toBe(true);
  });
});
