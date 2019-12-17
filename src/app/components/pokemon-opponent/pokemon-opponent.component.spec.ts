import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonOpponentComponent } from './pokemon-opponent.component';

describe('PokemonOpponentComponent', () => {
  let component: PokemonOpponentComponent;
  let fixture: ComponentFixture<PokemonOpponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokemonOpponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonOpponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
