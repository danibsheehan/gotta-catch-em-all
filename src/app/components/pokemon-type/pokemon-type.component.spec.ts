import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PokemonTypeComponent } from './pokemon-type.component';

describe('PokemonTypeComponent', () => {
  let component: PokemonTypeComponent;
  let fixture: ComponentFixture<PokemonTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PokemonTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
