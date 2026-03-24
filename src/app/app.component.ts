import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { PokemonBattleResultComponent } from './features/battle/pokemon-battle-result/pokemon-battle-result.component';
import { PokemonBattleService } from './features/battle/pokemon-battle.service';
import { PokemonDetailsComponent } from './features/pokemon-display/pokemon-details/pokemon-details.component';
import { PokemonSelectorComponent } from './features/pokemon-picker/pokemon-selector/pokemon-selector.component';

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
})
export class AppComponent {
  title = 'gotta-catch-em-all';

  constructor(public battle: PokemonBattleService) {}
}
