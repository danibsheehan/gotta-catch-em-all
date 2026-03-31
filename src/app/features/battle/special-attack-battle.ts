import { Pokemon, Stat } from 'src/app/shared/models/pokemon';

export const SPECIAL_ATTACK_STAT_NAME = 'special-attack';

export const SPECIAL_ATTACK_WIN_MESSAGE = 'yay!! you win 🎉 sheer star power ✨';
export const SPECIAL_ATTACK_LOSE_MESSAGE = 'oof not this time 💔 run it back?';

export interface SpecialAttackBattleOutcome {
  choiceStat: Stat;
  opponentStat: Stat;
  message: string;
  victor: Partial<Pokemon>;
}

/**
 * Compares the two Pokémon’s special-attack base stats. If either is missing that stat, returns null.
 * A tie goes to the opponent (same as strict `>` on the player’s stat).
 */
export function resolveSpecialAttackBattle(
  choice: Partial<Pokemon>,
  opponent: Partial<Pokemon>,
): SpecialAttackBattleOutcome | null {
  const choiceStat = choice.stats?.find((s) => s.stat.name === SPECIAL_ATTACK_STAT_NAME);
  const opponentStat = opponent.stats?.find((s) => s.stat.name === SPECIAL_ATTACK_STAT_NAME);
  if (!choiceStat || !opponentStat) {
    return null;
  }

  const playerWins = choiceStat.base_stat > opponentStat.base_stat;
  return {
    choiceStat,
    opponentStat,
    message: playerWins ? SPECIAL_ATTACK_WIN_MESSAGE : SPECIAL_ATTACK_LOSE_MESSAGE,
    victor: playerWins ? choice : opponent,
  };
}
