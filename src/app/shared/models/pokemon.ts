export interface PokemonBrief {
    name: string;
    url: string;
}

/** PokeAPI `NamedAPIResource` shape (subset). */
export interface NamedApiResource {
    name: string;
    url: string;
}

/** Slot + type entry from `GET /pokemon/{id}` — first slot is primary. */
export interface PokemonTypeSlot {
    slot: number;
    type: NamedApiResource;
}

export interface Pokemon {
    name: string;
    sprites: SpritesObj;
    stats: Stat[];
    /** Present on full API responses — used for arena tint, etc. */
    types?: PokemonTypeSlot[];
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
