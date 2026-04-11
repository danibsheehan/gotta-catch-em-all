import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pokemon } from 'src/app/shared/models/pokemon';

@Component({
    selector: 'app-pokemon-details',
    templateUrl: './pokemon-details.component.html',
    styleUrls: ['./pokemon-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass],
})
export class PokemonDetailsComponent {

  @Input() pokemonDetails: Partial<Pokemon>;
  /** When true, image loads eagerly with high fetch priority (use for above-the-fold LCP candidates). */
  @Input() prioritizeLcp = false;
  /** Sequential name → stat → sprite entrance (CSS; disabled when `prefers-reduced-motion: reduce`). */
  @Input() staggerEntrance = false;

  /** `null` when stats are missing or there is no special-attack entry. */
  get specialAttackStat(): number | null {
    const row = this.pokemonDetails?.stats?.find((s) => s.stat.name === 'special-attack');
    return row !== undefined ? row.base_stat : null;
  }
}
