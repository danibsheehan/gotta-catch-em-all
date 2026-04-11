import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
  let pokemonCatalogSpy: jasmine.SpyObj<PokemonCatalogService>;
  let battleSpy: Pick<PokemonBattleService, 'selectPlayerPokemon' | 'closeSelectorDropdowns$'>;
  let audioSpy: jasmine.SpyObj<Pick<AudioService, 'playUiTick'>>;
  let closeSelectorDropdowns$: Subject<void>;
  const pokemonTypeStub: PokemonType = {
    name: 'electric',
    url: 'https://pokeapi.co/api/v2/type/13/'
  };

  beforeEach(async () => {
    closeSelectorDropdowns$ = new Subject<void>();
    pokemonCatalogSpy = jasmine.createSpyObj('PokemonCatalogService', ['getPokemonByType']);
    audioSpy = jasmine.createSpyObj('AudioService', ['playUiTick']);
    battleSpy = {
      selectPlayerPokemon: jasmine.createSpy('selectPlayerPokemon'),
      closeSelectorDropdowns$: closeSelectorDropdowns$.asObservable(),
    };
    const catalogPage: PokemonBrief[] = [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' },
    ];
    pokemonCatalogSpy.getPokemonByType.and.returnValue(of(catalogPage));

    TestBed.configureTestingModule({
      imports: [PokemonTypeComponent],
      providers: [
        { provide: PokemonCatalogService, useValue: pokemonCatalogSpy },
        { provide: PokemonBattleService, useValue: battleSpy },
        { provide: AudioService, useValue: audioSpy },
      ]
    })
    .compileComponents();
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
      pokemonCatalogSpy.getPokemonByType.and.returnValue(of([]));
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
      pokemonCatalogSpy.getPokemonByType.and.returnValue(throwError(() => new Error('failed')));
      const errFixture = TestBed.createComponent(PokemonTypeComponent);
      const errComp = errFixture.componentInstance;
      errComp.pokemonType = pokemonTypeStub;
      errComp.ngOnChanges();
      errFixture.detectChanges();

      errComp.toggleTypeDropdown();

      expect(errComp.pokemonNames).toEqual([]);
      expect(errComp.pokemonLoadError).toBe("😵 couldn't fetch electric — tap refresh?");
    });

    it('should close dropdown on Escape', fakeAsync(() => {
      component.toggleTypeDropdown();
      expect(component.isOpen).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      tick();

      expect(component.isOpen).toBe(false);
    }));
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

});
