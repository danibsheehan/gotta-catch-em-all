import { PokemonBrief } from './pokemon';

export interface PokemonType {
    name: string;
    url: string;
    pokemon?: PokemonBrief[];
}
