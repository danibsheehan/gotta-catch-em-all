import { AsyncPipe } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { PokemonCatalogService } from '../pokemon-catalog.service';
import { PokemonType } from 'src/app/shared/models/pokemon-type';

import { PokemonTypeComponent } from '../pokemon-type/pokemon-type.component';

@Component({
    selector: 'app-pokemon-selector',
    templateUrl: './pokemon-selector.component.html',
    styleUrls: ['./pokemon-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AsyncPipe, PokemonTypeComponent],
})
export class PokemonSelectorComponent {
  /** False until first paint; then true while the deferred type list request is in flight. */
  public isLoadingTypes = false;
  public pokemonTypesError = '';
  public pokemonTypes$: Observable<PokemonType[]> = EMPTY;

  constructor(
    private pokemonCatalog: PokemonCatalogService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.isLoadingTypes = true;
      this.pokemonTypes$ = this.pokemonCatalog.getPokemonTypes().pipe(
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
