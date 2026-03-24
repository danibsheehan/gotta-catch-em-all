import { Component, Input } from '@angular/core';
import { PokemonBrief } from 'src/app/shared/models/pokemon';

@Component({
    selector: 'app-pokemon',
    templateUrl: './pokemon.component.html',
    styleUrls: ['./pokemon.component.scss'],
    standalone: true,
})
export class PokemonComponent {

  @Input() pokemonBrief: PokemonBrief;

}
