import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

import { PokemonBattleResultComponent } from './features/battle/pokemon-battle-result/pokemon-battle-result.component';
import { PokemonBattleService } from './features/battle/pokemon-battle.service';
import { PokemonDetailsComponent } from './features/pokemon-display/pokemon-details/pokemon-details.component';
import { PokemonSelectorComponent } from './features/pokemon-picker/pokemon-selector/pokemon-selector.component';

const ARENA_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const ARENA_DURATION = '560ms';
const ARENA_STAGGER = 110;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
      AsyncPipe,
      PokemonBattleResultComponent,
      PokemonDetailsComponent,
      PokemonSelectorComponent,
    ],
    animations: [
        trigger('arenaOpponentEnter', [
            transition(':enter', [
                query(
                    'h2, app-pokemon-details',
                    [
                        style({
                            opacity: 0,
                            transform: 'translateX(-3rem) scale(0.94)',
                        }),
                        stagger(ARENA_STAGGER, [
                            animate(
                                `${ARENA_DURATION} ${ARENA_EASE}`,
                                style({ opacity: 1, transform: 'translateX(0) scale(1)' })
                            ),
                        ]),
                    ],
                    { optional: true }
                ),
            ]),
        ]),
        trigger('arenaChoiceEnter', [
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'translateX(3rem) scale(0.94)',
                }),
                animate(
                    `${ARENA_DURATION} ${ARENA_EASE}`,
                    style({ opacity: 1, transform: 'translateX(0) scale(1)' })
                ),
            ]),
        ]),
    ],
})
export class AppComponent {
  title = 'gotta-catch-em-all';

  constructor(public battle: PokemonBattleService) {}
}
