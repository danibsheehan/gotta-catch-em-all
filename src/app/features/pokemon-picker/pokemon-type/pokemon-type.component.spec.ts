import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { AudioService } from 'src/app/core/audio/audio.service';
import { PokemonTypeComponent } from './pokemon-type.component';
import { PokemonType } from 'src/app/shared/models/pokemon-type';
import { PokemonBrief } from 'src/app/shared/models/pokemon';
import { PokemonBattleService } from 'src/app/features/battle/pokemon-battle.service';
import { PokemonCatalogService } from '../pokemon-catalog.service';

describe('PokemonTypeComponent', () => {
  let component: PokemonTypeComponent;
  let fixture: ComponentFixture<PokemonTypeComponent>;
  let pokemonCatalogSpy: { getPokemonByType: ReturnType<typeof vi.fn> };
  let battleSpy: Pick<PokemonBattleService, 'selectPlayerPokemon' | 'closeSelectorDropdowns$'>;
  let audioSpy: { playUiTick: ReturnType<typeof vi.fn> };
  let closeSelectorDropdowns$: Subject<void>;
  const pokemonTypeStub: PokemonType = {
    name: 'electric',
    url: 'https://pokeapi.co/api/v2/type/13/',
  };

  beforeEach(async () => {
    closeSelectorDropdowns$ = new Subject<void>();
    pokemonCatalogSpy = {
      getPokemonByType: vi.fn().mockName('PokemonCatalogService.getPokemonByType'),
    };
    audioSpy = {
      playUiTick: vi.fn().mockName('AudioService.playUiTick'),
    };
    battleSpy = {
      selectPlayerPokemon: vi.fn().mockName('selectPlayerPokemon'),
      closeSelectorDropdowns$: closeSelectorDropdowns$.asObservable(),
    };
    const catalogPage: PokemonBrief[] = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' },
    ];
    pokemonCatalogSpy.getPokemonByType.mockReturnValue(of(catalogPage));

    TestBed.configureTestingModule({
      imports: [PokemonTypeComponent],
      providers: [
        { provide: PokemonCatalogService, useValue: pokemonCatalogSpy },
        { provide: PokemonBattleService, useValue: battleSpy },
        { provide: AudioService, useValue: audioSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonTypeComponent);
    component = fixture.componentInstance;
    component.pokemonType = pokemonTypeStub;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleTypeDropdown()', () => {
    it('should open dropdown using prefetched pokemon names without a second catalog call', () => {
      expect(component.pokemonNames).toEqual(['pikachu', 'raichu']);
      expect(pokemonCatalogSpy.getPokemonByType).toHaveBeenCalledTimes(1);

      component.toggleTypeDropdown();

      expect(pokemonCatalogSpy.getPokemonByType).toHaveBeenCalledTimes(1);
      expect(component.pokemonNames).toEqual(['pikachu', 'raichu']);
      expect(component.isOpen).toBe(true);
    });

    it('should toggle closed without loading on second click', () => {
      component.toggleTypeDropdown();
      component.toggleTypeDropdown();

      expect(component.isOpen).toBe(false);
      expect(pokemonCatalogSpy.getPokemonByType).toHaveBeenCalledTimes(1);
    });

    it('should disable the type when prefetch finds no pokemon', () => {
      pokemonCatalogSpy.getPokemonByType.mockReturnValue(of([]));
      const emptyFixture = TestBed.createComponent(PokemonTypeComponent);
      const emptyComp = emptyFixture.componentInstance;
      emptyComp.pokemonType = pokemonTypeStub;
      emptyComp.ngOnChanges();
      emptyFixture.detectChanges();

      const btn = emptyFixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
      expect(emptyComp.typeHasNoPokemon).toBe(true);

      emptyComp.toggleTypeDropdown();
      expect(emptyComp.isOpen).toBe(false);
    });

    it('should set load error when catalog request fails after prefetch error', () => {
      pokemonCatalogSpy.getPokemonByType.mockReturnValue(throwError(() => new Error('failed')));
      const errFixture = TestBed.createComponent(PokemonTypeComponent);
      const errComp = errFixture.componentInstance;
      errComp.pokemonType = pokemonTypeStub;
      errComp.ngOnChanges();
      errFixture.detectChanges();

      errComp.toggleTypeDropdown();

      expect(errComp.pokemonNames).toEqual([]);
      expect(errComp.pokemonLoadError).toBe("😵 couldn't fetch electric — tap refresh?");
    });

    it('should close dropdown on Escape', () => {
      component.toggleTypeDropdown();
      expect(component.isOpen).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(component.isOpen).toBe(false);
    });
  });

  describe('selectPokemon()', () => {
    it('should call battle.selectPlayerPokemon when name is non-empty', () => {
      component.selectPokemon('pikachu');

      expect(audioSpy.playUiTick).toHaveBeenCalled();
      expect(battleSpy.selectPlayerPokemon).toHaveBeenCalledWith('pikachu');
    });

    it('should not call selectPlayerPokemon when name is empty', () => {
      component.selectPokemon('');

      expect(battleSpy.selectPlayerPokemon).not.toHaveBeenCalled();
    });
  });

  describe('closeSelectorDropdowns$', () => {
    it('should close and clear dropdown state when battle emits', () => {
      component.toggleTypeDropdown();
      expect(component.isOpen).toBe(true);
      expect(component.pokemonNames.length).toBeGreaterThan(0);

      closeSelectorDropdowns$.next();
      fixture.detectChanges();

      expect(component.isOpen).toBe(false);
      expect(component.pokemonNames).toEqual(['pikachu', 'raichu']);
      expect(component.pokemonLoadError).toBe('');
      expect(component.isLoadingPokemonNames).toBe(false);
    });
  });

  describe('onDocumentKeydown()', () => {
    it('should not close the dropdown for a non-Escape key while open', () => {
      component.toggleTypeDropdown();
      expect(component.isOpen).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(component.isOpen).toBe(true);
    });

    it('should be a no-op for Escape when the dropdown is already closed', () => {
      expect(component.isOpen).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(component.isOpen).toBe(false);
    });
  });

  describe('typeGlyph', () => {
    it('should fall back to the default glyph when there is no pokemon type', () => {
      component.pokemonType = undefined as unknown as PokemonType;
      expect(component.typeGlyph).toBe('◆');
    });

    it('should fall back to the default glyph for a type without a mapped glyph', () => {
      component.pokemonType = { name: 'unmapped-type', url: pokemonTypeStub.url };
      expect(component.typeGlyph).toBe('◆');
    });
  });

  describe('dataTypeAttr', () => {
    it('should be empty when there is no pokemon type', () => {
      component.pokemonType = undefined as unknown as PokemonType;
      expect(component.dataTypeAttr).toBe('');
    });
  });

  describe('prefetch with no type name', () => {
    it('should skip the catalog call and stop checking when the pokemon type has no name', () => {
      pokemonCatalogSpy.getPokemonByType.mockClear();
      const noNameFixture = TestBed.createComponent(PokemonTypeComponent);
      const noNameComp = noNameFixture.componentInstance;
      noNameComp.pokemonType = { name: '', url: pokemonTypeStub.url };
      noNameComp.ngOnChanges();
      noNameFixture.detectChanges();

      expect(noNameComp.isCheckingTypePokemon).toBe(false);
      expect(pokemonCatalogSpy.getPokemonByType).not.toHaveBeenCalled();
    });
  });

  describe('loadPokemonNames() after a prefetch error', () => {
    it('should populate pokemon and clear the error when the retried load succeeds', () => {
      pokemonCatalogSpy.getPokemonByType.mockReturnValueOnce(throwError(() => new Error('failed')));
      const retryFixture = TestBed.createComponent(PokemonTypeComponent);
      const retryComp = retryFixture.componentInstance;
      retryComp.pokemonType = pokemonTypeStub;
      retryComp.ngOnChanges();
      retryFixture.detectChanges();

      expect(retryComp.pokemonNames).toEqual([]);
      expect(retryComp.typeHasNoPokemon).toBe(false);

      retryComp.toggleTypeDropdown();

      expect(retryComp.pokemonNames).toEqual(['pikachu', 'raichu']);
      expect(retryComp.pokemonLoadError).toBe('');
      expect(retryComp.isLoadingPokemonNames).toBe(false);
    });

    it('should show a no-pokemon message when the retried load succeeds with an empty list', () => {
      pokemonCatalogSpy.getPokemonByType.mockReturnValueOnce(throwError(() => new Error('failed')));
      pokemonCatalogSpy.getPokemonByType.mockReturnValueOnce(of([]));
      const retryFixture = TestBed.createComponent(PokemonTypeComponent);
      const retryComp = retryFixture.componentInstance;
      retryComp.pokemonType = pokemonTypeStub;
      retryComp.ngOnChanges();
      retryFixture.detectChanges();

      retryComp.toggleTypeDropdown();

      expect(retryComp.pokemonNames).toEqual([]);
      expect(retryComp.pokemonLoadError).toBe('👀 no electric crew in the dex rn');
    });
  });

  describe('private no-op guards', () => {
    it('closeDropdown() should no-op when already closed', () => {
      expect(component.isOpen).toBe(false);

      expect(() => (component as any).closeDropdown()).not.toThrow();

      expect(component.isOpen).toBe(false);
    });

    it('queueFocusPokemonSelect() should no-op when the dropdown is closed', () => {
      expect(component.isOpen).toBe(false);

      expect(() => (component as any).queueFocusPokemonSelect()).not.toThrow();
    });
  });
});
