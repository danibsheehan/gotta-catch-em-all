export interface PokemonBrief {
    name: string;
    url: string;
}

export interface Pokemon {
    name: string;
    sprites: SpritesObj;
}

export interface SpritesObj {
    front_default: string;
}
