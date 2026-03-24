import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { PokemonListService } from '../../pokemon-list.service';
import { PokemonType } from 'src/app/pokemon-type';

@Component({
    selector: 'app-pokemon-selector',
    templateUrl: './pokemon-selector.component.html',
    styleUrls: ['./pokemon-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PokemonSelectorComponent {
  /** False until first paint; then true while the deferred type list request is in flight. */
  public isLoadingTypes = false;
  public pokemonTypesError = '';
  public pokemonTypes$: Observable<PokemonType[]> = EMPTY;

  constructor(
    private pokemonListService: PokemonListService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.isLoadingTypes = true;
      this.pokemonTypes$ = this.pokemonListService.getPokemonTypes().pipe(
        tap(() => {
          this.isLoadingTypes = false;
          this.pokemonTypesError = '';
        }),
        map((data) => data.results),
        catchError(() => {
          this.pokemonTypesError = 'Pokemon type data could not be found. Please refresh and try again.';
          return of([]);
        }),
        finalize(() => {
          this.isLoadingTypes = false;
        })
      );
      this.cdr.markForCheck();
    });
  }
}
