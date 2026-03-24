import { Component, Input } from '@angular/core';
import { PokemonBrief } from 'src/app/pokemon';

@Component({
    selector: 'app-pokemon',
    templateUrl: './pokemon.component.html',
    styleUrls: ['./pokemon.component.scss'],
    standalone: false
})
export class PokemonComponent {

  @Input() pokemonBrief: PokemonBrief;

}
