import { Pokemon } from 'src/app/shared/models/pokemon';

import {
  SPECIAL_ATTACK_LOSE_MESSAGE,
  SPECIAL_ATTACK_WIN_MESSAGE,
  resolveSpecialAttackBattle,
} from './special-attack-battle';

describe('resolveSpecialAttackBattle', () => {
  const choice: Pokemon = {
    name: 'pikachu',
    sprites: { front_default: '' },
    stats: [{ base_stat: 90, stat: { name: 'special-attack' } }],
  };
  const opponent: Pokemon = {
    name: 'bulbasaur',
    sprites: { front_default: '' },
    stats: [{ base_stat: 65, stat: { name: 'special-attack' } }],
  };

  it('returns null when choice has no special-attack stat', () => {
    expect(
      resolveSpecialAttackBattle({ ...choice, stats: [] }, opponent),
    ).toBeNull();
  });

  it('returns null when opponent has no special-attack stat', () => {
    expect(
      resolveSpecialAttackBattle(choice, { ...opponent, stats: [] }),
    ).toBeNull();
  });

  it('declares the player the victor when special attack is higher', () => {
    const out = resolveSpecialAttackBattle(choice, opponent);
    expect(out?.message).toBe(SPECIAL_ATTACK_WIN_MESSAGE);
    expect(out?.victor).toBe(choice);
    expect(out?.choiceStat.base_stat).toBe(90);
    expect(out?.opponentStat.base_stat).toBe(65);
  });

  it('declares the opponent the victor when special attack is lower', () => {
    const out = resolveSpecialAttackBattle(
      { ...choice, stats: [{ base_stat: 50, stat: { name: 'special-attack' } }] },
      opponent,
    );
    expect(out?.message).toBe(SPECIAL_ATTACK_LOSE_MESSAGE);
    expect(out?.victor).toBe(opponent);
  });

  it('declares the opponent the victor when special attack ties', () => {
    const tied: Pokemon = {
      ...choice,
      stats: [{ base_stat: 65, stat: { name: 'special-attack' } }],
    };
    const out = resolveSpecialAttackBattle(tied, opponent);
    expect(out?.message).toBe(SPECIAL_ATTACK_LOSE_MESSAGE);
    expect(out?.victor).toBe(opponent);
  });
});
