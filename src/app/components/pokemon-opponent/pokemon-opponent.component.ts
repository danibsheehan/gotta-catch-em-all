import { Component, OnInit, Input } from '@angular/core';
import { Pokemon } from 'src/app/pokemon';

@Component({
  selector: 'app-pokemon-opponent',
  templateUrl: './pokemon-opponent.component.html',
  styleUrls: ['./pokemon-opponent.component.scss']
})
export class PokemonOpponentComponent implements OnInit {

  @Input() pokemon: Pokemon;

  constructor() { }

  ngOnInit() {
  }
}
