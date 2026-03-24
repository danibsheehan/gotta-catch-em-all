import { Component } from '@angular/core';

import { PokemonBattleService } from './pokemon/pokemon-battle.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'gotta-catch-em-all';

  constructor(public battle: PokemonBattleService) {}
}
