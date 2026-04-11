import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { BattleHistoryEntry, BattleHistoryService } from '../battle-history.service';
import { BattleRecentMatchupsComponent } from './battle-recent-matchups.component';

describe('BattleRecentMatchupsComponent', () => {
  let fixture: ComponentFixture<BattleRecentMatchupsComponent>;
  let entries$$: BehaviorSubject<BattleHistoryEntry[]>;

  beforeEach(async () => {
    entries$$ = new BehaviorSubject<BattleHistoryEntry[]>([]);
    const battleHistoryStub = {
      entries$: entries$$.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [BattleRecentMatchupsComponent],
      providers: [{ provide: BattleHistoryService, useValue: battleHistoryStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(BattleRecentMatchupsComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render rows when history has entries', () => {
    entries$$.next([
      { playerName: 'pikachu', opponentName: 'onix', playerWon: true, at: 1 },
    ]);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.recent-matchups-item')?.textContent).toContain('Pikachu');
    expect(el.textContent).toContain('out-sp.atk');
  });
});
