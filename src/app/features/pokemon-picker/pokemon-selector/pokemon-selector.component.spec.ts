import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PokemonSelectorComponent } from './pokemon-selector.component';

describe('PokemonSelectorComponent', () => {
  let component: PokemonSelectorComponent;
  let fixture: ComponentFixture<PokemonSelectorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [PokemonSelectorComponent],
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting()]
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
