import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonBattleResultComponent } from './pokemon-battle-result.component';

describe('PokemonBattleResultComponent', () => {
  let component: PokemonBattleResultComponent;
  let fixture: ComponentFixture<PokemonBattleResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokemonBattleResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonBattleResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
