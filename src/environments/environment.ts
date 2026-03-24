// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  pokeApi: {
    /** PokeAPI v2 root (no trailing slash). */
    baseUrl: 'https://pokeapi.co/api/v2',
    /** Front sprite PNGs by national dex id: `{baseUrl}/{id}.png` */
    frontSpriteBaseUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
  },
  /** Upper bound for `GET /pokemon/{id}` when picking a random opponent (PokeAPI dex size). */
  maxPokemonSpeciesId: 964
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
