import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/pokemon';

@Component({
    selector: 'app-pokemon-details',
    templateUrl: './pokemon-details.component.html',
    styleUrls: ['./pokemon-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PokemonDetailsComponent {

  @Input() pokemonDetails: Pokemon;
  /** When true, image loads eagerly with high fetch priority (use for above-the-fold LCP candidates). */
  @Input() prioritizeLcp = false;

  constructor() { }
}
