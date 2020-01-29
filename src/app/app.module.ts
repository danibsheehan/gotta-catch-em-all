import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PokemonSelectorComponent } from './components/pokemon-selector/pokemon-selector.component';
import { PokemonTypeComponent } from './components/pokemon-type/pokemon-type.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';
import { PokemonOpponentComponent } from './components/pokemon-opponent/pokemon-opponent.component';
import { PokemonBattleResultComponent } from './components/pokemon-battle-result/pokemon-battle-result.component';

@NgModule({
  declarations: [
    AppComponent,
    PokemonSelectorComponent,
    PokemonTypeComponent,
    PokemonListComponent,
    PokemonComponent,
    PokemonDetailsComponent,
    PokemonOpponentComponent,
    PokemonBattleResultComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
