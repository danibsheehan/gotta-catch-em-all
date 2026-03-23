import { Component, Input, OnInit } from '@angular/core';
import { PokemonType } from 'src/app/pokemon-type';

@Component({
    selector: 'app-pokemon-type',
    templateUrl: './pokemon-type.component.html',
    styleUrls: ['./pokemon-type.component.scss'],
    standalone: false
})
export class PokemonTypeComponent implements OnInit {
  @Input() pokemonType: PokemonType;

  constructor() { }

  ngOnInit() {

  }
}
