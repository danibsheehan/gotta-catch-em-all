#!/usr/bin/env node
// Recurring audit detection script for sandbox-backlog.md's "PokeAPI contract-drift sweep".
// Checks the live PokeAPI against the exact fields/shapes this repo depends on:
// - src/app/core/api/poke-api.client.ts (PokeApiTypeDetailResponse)
// - src/app/shared/models/pokemon.ts, pokemon-type.ts, pokemon-type-list.ts
// - src/app/features/battle/special-attack-battle.ts (the "special-attack" stat lookup)
// - src/environments/environment.ts (maxPokemonSpeciesId)
//
// Deliberately does NOT report fields the live API has that this app doesn't model — this
// app intentionally types only the fields it reads (see poke-api.client.ts's "only the field
// we read" comment), so an unmodeled field is normal, not drift. Only two finding classes are
// reported, printed with a machine-checkable prefix so the routine can branch on them:
//   CONTRACT-BREAK: <detail>   — a relied-upon field is missing/renamed/retyped upstream
//   MAXID-DRIFT: <detail>      — environment.ts's maxPokemonSpeciesId is behind the live count

const BASE = 'https://pokeapi.co/api/v2';
const MAX_POKEMON_SPECIES_ID = 964; // environment.ts's current hardcoded upper bound
const SPECIAL_ATTACK_STAT_NAME = 'special-attack';

const contractBreaks = [];
const maxIdDrift = [];

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`GET ${path} -> HTTP ${res.status}`);
  }
  return res.json();
}

function requireField(obj, key, area) {
  if (obj == null || obj[key] === undefined) {
    contractBreaks.push(`${area}: missing expected field "${key}"`);
    return undefined;
  }
  return obj[key];
}

async function checkPokemonDetail(nameOrId) {
  const area = `GET /pokemon/${nameOrId}`;
  let body;
  try {
    body = await getJson(`/pokemon/${nameOrId}`);
  } catch (err) {
    contractBreaks.push(`${area}: request failed: ${err.message}`);
    return;
  }

  requireField(body, 'name', area);
  const sprites = requireField(body, 'sprites', area);
  if (sprites) requireField(sprites, 'front_default', area);

  const stats = requireField(body, 'stats', area);
  if (Array.isArray(stats)) {
    const statNames = stats.map((s) => s?.stat?.name);
    if (!statNames.includes(SPECIAL_ATTACK_STAT_NAME)) {
      contractBreaks.push(
        `${area}: no stats entry with stat.name === "${SPECIAL_ATTACK_STAT_NAME}" — this is the core battle-resolution stat (resolveSpecialAttackBattle); its absence silently resolves battles via the missing-stat/opponent-wins path`,
      );
    }
    const sample = stats[0];
    if (sample) {
      requireField(sample, 'base_stat', area);
      const stat = requireField(sample, 'stat', area);
      if (stat) requireField(stat, 'name', area);
    }
  } else if (stats !== undefined) {
    contractBreaks.push(`${area}: "stats" is not an array`);
  }

  if (body.types !== undefined) {
    if (!Array.isArray(body.types)) {
      contractBreaks.push(`${area}: "types" is present but not an array`);
    } else if (body.types[0]) {
      requireField(body.types[0], 'slot', area);
      const type = requireField(body.types[0], 'type', area);
      if (type) {
        requireField(type, 'name', area);
        requireField(type, 'url', area);
      }
    }
  }
}

async function checkTypeDetail(typeName) {
  const area = `GET /type/${typeName}`;
  let body;
  try {
    body = await getJson(`/type/${typeName}`);
  } catch (err) {
    contractBreaks.push(`${area}: request failed: ${err.message}`);
    return;
  }

  const pokemon = requireField(body, 'pokemon', area);
  if (!Array.isArray(pokemon)) {
    contractBreaks.push(`${area}: "pokemon" is not an array`);
    return;
  }
  const sample = pokemon[0];
  if (sample) {
    const entry = requireField(sample, 'pokemon', area);
    if (entry) {
      requireField(entry, 'name', area);
      requireField(entry, 'url', area);
    }
  }
}

async function checkTypeIndex() {
  const area = `GET /type/`;
  let body;
  try {
    body = await getJson(`/type/`);
  } catch (err) {
    contractBreaks.push(`${area}: request failed: ${err.message}`);
    return;
  }
  requireField(body, 'count', area);
  const results = requireField(body, 'results', area);
  if (Array.isArray(results) && results[0]) {
    requireField(results[0], 'name', area);
    requireField(results[0], 'url', area);
  }
}

async function checkMaxPokemonSpeciesId() {
  const area = 'maxPokemonSpeciesId (environment.ts)';
  let body;
  try {
    body = await getJson(`/pokemon-species/?limit=1`);
  } catch (err) {
    contractBreaks.push(`${area}: request failed: ${err.message}`);
    return;
  }
  const liveCount = body.count;
  if (typeof liveCount !== 'number') {
    contractBreaks.push(
      `${area}: unexpected /pokemon-species/ response shape (no numeric "count")`,
    );
    return;
  }
  if (liveCount > MAX_POKEMON_SPECIES_ID) {
    maxIdDrift.push(
      `live species count is ${liveCount}, hardcoded maxPokemonSpeciesId is ${MAX_POKEMON_SPECIES_ID} (${liveCount - MAX_POKEMON_SPECIES_ID} species never selectable as a random opponent)`,
    );
  } else if (liveCount < MAX_POKEMON_SPECIES_ID) {
    contractBreaks.push(
      `${area}: live species count is ${liveCount}, LOWER than hardcoded maxPokemonSpeciesId ${MAX_POKEMON_SPECIES_ID} — random ids above ${liveCount} would 404`,
    );
  }
}

async function main() {
  await checkPokemonDetail('pikachu');
  await checkPokemonDetail(1);
  await checkTypeDetail('electric');
  await checkTypeIndex();
  await checkMaxPokemonSpeciesId();

  for (const detail of contractBreaks) {
    console.log(`CONTRACT-BREAK: ${detail}`);
  }
  for (const detail of maxIdDrift) {
    console.log(`MAXID-DRIFT: ${detail}`);
  }
  if (contractBreaks.length === 0 && maxIdDrift.length === 0) {
    console.log('No drift detected — live API matches every field/shape this repo depends on.');
  }

  process.exit(contractBreaks.length > 0 ? 2 : 0);
}

main().catch((err) => {
  console.error('CONTRACT-BREAK: sweep run failed:', err);
  process.exit(2);
});
