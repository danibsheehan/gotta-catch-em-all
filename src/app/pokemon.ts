export interface PokemonBrief {
    name: string;
    url: string;
}

export interface Pokemon {
    name: string;
    sprites: SpritesObj;
    stats: Stat[];
}

export interface SpritesObj {
    front_default: string;
}

export interface Stat {
    base_stat: number;
    stat: StatObj;
}

export interface StatObj {
    name: string;
}
