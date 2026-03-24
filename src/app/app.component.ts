import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { PokemonBattleService } from './pokemon/pokemon-battle.service';
import { PokemonBattleResultComponent } from './components/pokemon-battle-result/pokemon-battle-result.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';
import { PokemonSelectorComponent } from './components/pokemon-selector/pokemon-selector.component';

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
