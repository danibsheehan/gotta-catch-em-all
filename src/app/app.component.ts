import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

import { AudioService } from './core/audio/audio.service';
import { BattleRecentMatchupsComponent } from './features/battle/battle-recent-matchups/battle-recent-matchups.component';
import { PokemonBattleResultComponent } from './features/battle/pokemon-battle-result/pokemon-battle-result.component';
import { PokemonBattleService, PokemonBattleVm } from './features/battle/pokemon-battle.service';
import { PokemonDetailsComponent } from './features/pokemon-display/pokemon-details/pokemon-details.component';
import { PokemonSelectorComponent } from './features/pokemon-picker/pokemon-selector/pokemon-selector.component';

const ARENA_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const ARENA_DURATION = '520ms';
const ARENA_STAGGER = 95;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
      AsyncPipe,
      BattleRecentMatchupsComponent,
      PokemonBattleResultComponent,
      PokemonDetailsComponent,
      PokemonSelectorComponent,
    ],
    animations: [
        trigger('arenaOpponentEnter', [
            transition(':enter', [
                query(
                    'header .battle-micro-label, header .battle-section-heading',
                    [
                        style({
                            opacity: 0,
                            transform: 'translateX(-2.25rem) scale(0.96)',
                        }),
                        stagger(ARENA_STAGGER, [
                            animate(
                                `${ARENA_DURATION} ${ARENA_EASE}`,
                                style({ opacity: 1, transform: 'translateX(0) scale(1)' }),
                            ),
                        ]),
                    ],
                    { optional: true },
                ),
            ]),
        ]),
    ],
})
export class AppComponent {
  title = 'gotta-catch-em-all';

  constructor(
    public battle: PokemonBattleService,
    public audio: AudioService,
  ) {}

  onSoundSettingsChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) {
      return;
    }
    this.audio.setSoundEnabled(input.checked, true);
  }

  /**
   * Primary type from the player’s Pokémon when set; otherwise the opponent’s — drives arena wash tint.
   */
  arenaAmbientType(vm: PokemonBattleVm): string | null {
    const slots = vm.player?.types?.length ? vm.player.types : vm.opponent?.types;
    if (!slots?.length) {
      return null;
    }
    const primary = [...slots].sort((a, b) => a.slot - b.slot)[0];
    return primary?.type?.name ?? null;
  }
}
