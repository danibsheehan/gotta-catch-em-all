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
    entries$$.next([{ playerName: 'pikachu', opponentName: 'onix', playerWon: true, at: 1 }]);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.polaroid-vs')?.textContent).toContain('Pikachu');
    expect(el.textContent).toContain('×');
  });

  it('should render a loss row correctly', () => {
    entries$$.next([{ playerName: 'pikachu', opponentName: 'onix', playerWon: false, at: 1 }]);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('their sp.atk edged · loss');
  });

  it('titleCase should return the name unchanged when it is empty', () => {
    const versus = fixture.componentInstance.versusLine({
      playerName: '',
      opponentName: 'onix',
      playerWon: true,
      at: 1,
    });
    expect(versus).toBe(' × Onix');
  });
});
