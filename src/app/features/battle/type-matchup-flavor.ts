/**
 * Playful type-pair lines for the battle shell — not a damage calculator; sp.atk still decides.
 * Keys are `typeA:typeB` (alphabetical order) for symmetric lookup.
 */
const PAIR_LINES: Record<string, string> = {
  'bug:dark': '🐛 × 🌑 — tricky typings, still a stat shootout.',
  'bug:fire': '🔥 melts 🐛 lore — here, numbers don’t care.',
  'bug:flying': '🐛 × ✈️ — classic coverage talk, one stat only today.',
  'bug:grass': '🐛 × 🌿 — garden-variety duel.',
  'dark:ghost': '🌑 × 👻 — spooky mirror vibes.',
  'dark:psychic': '🌑 × 🔮 — mind games on the type chart; we only read sp.atk.',
  'dragon:ice': '🐉 × ❄️ — legendary matchup energy, spreadsheet edition.',
  'electric:water': '⚡ × 💧 — splash vs spark — flavor only; stats pick the hero.',
  'electric:flying': '⚡ × ✈️ — route 1 nostalgia, stadium math.',
  'fairy:fighting': '🧚 × 🥊 — fairy-tale brawl, one number wins.',
  'dragon:fairy': '🧚 × 🐉 — tale says advantage; this app says base stat.',
  'fighting:rock': '🥊 × 🗿 — rocky road, single-stat rules.',
  'fire:grass': '🔥 × 🌿 — textbook super-effective lore — sp.atk still king.',
  'fire:ice': '🔥 × ❄️ — thaw vs toast, stats referee.',
  'fire:steel': '🔥 × ⚙️ — forge fight, one column on the spreadsheet.',
  'fire:water': '🔥 × 💧 — steamy typing, cold hard integers.',
  'flying:grass': '✈️ × 🌿 — sky vs turf; outcome is pure sp.atk.',
  'ghost:normal': '👻 × ⬜ — immune in the games — not here, we compare stats.',
  'ghost:psychic': '👻 × 🔮 — spooky mind games; winner is bigger sp.atk.',
  'grass:ground': '🌿 × 🟤 — roots vs dirt, digits decide.',
  'grass:poison': '🌿 × ☠️ — overgrown lab accident, stat lab only.',
  'grass:water': '🌿 × 💧 — hydrate the garden; irrigate with base stats.',
  'electric:ground': '🟤 × ⚡ — usually immune — today? just sp.atk.',
  'ground:water': '🟤 × 💧 — mud season — we’re only soaking numbers.',
  'ice:water': '❄️ × 💧 — chilly splash; warmest sp.atk wins.',
  'normal:ghost': '⬜ × 👻 — spooky mismatch lore — neutral in this arena.',
  'poison:steel': '☠️ × ⚙️ — resist fantasy; reality is two integers.',
  'fighting:psychic': '🔮 × 🥊 — focus blast of flavor; verdict is sp.atk.',
  'rock:water': '🗿 × 💧 — erosion role-play, calculator truth.',
  'steel:water': '⚙️ × 💧 — rust anxiety, clean stat compare.',
};

function sortedPairKey(a: string, b: string): string {
  return a <= b ? `${a}:${b}` : `${b}:${a}`;
}

/** Primary type name from PokeAPI (`types` sorted by slot). */
export function typeMatchupMicrocopy(
  playerPrimary: string | undefined,
  opponentPrimary: string | undefined,
): string | null {
  const p = playerPrimary?.toLowerCase().trim();
  const o = opponentPrimary?.toLowerCase().trim();
  if (!p || !o) {
    return null;
  }
  if (p === o) {
    return `${p} mirror match — same vibe, sp.atk breaks the tie.`;
  }
  const key = sortedPairKey(p, o);
  return PAIR_LINES[key] ?? null;
}

const SESSION_QUIPS = [
  'the type chart took the day off — special attack clocked in overtime.',
  'no STAB sympathy: if your number’s bigger, you’re the headline.',
  'this gym only grades one column; the rest is cosplay.',
  'effective? resisted? irrelevant — we’re doing math homework in a stadium.',
  'your rival didn’t bring type coverage; they brought a bigger integer.',
  'ties go to the house — and the house is always the other trainer.',
  'nature? ability? held item? cute. we brought a ruler.',
  'hot take: both of you are “special” — one of you is just more special-attack.',
] as const;

/** Deterministic quip from names so it doesn’t flicker on re-render. */
export function sessionBattleQuip(playerName: string | undefined, opponentName: string | undefined): string {
  const s = `${playerName ?? ''}:${opponentName ?? ''}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(h) % SESSION_QUIPS.length;
  return SESSION_QUIPS[idx];
}
