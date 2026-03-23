import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonSelectorComponent } from './pokemon-selector.component';

describe('PokemonSelectorComponent', () => {
  let component: PokemonSelectorComponent;
  let fixture: ComponentFixture<PokemonSelectorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ PokemonSelectorComponent ],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
