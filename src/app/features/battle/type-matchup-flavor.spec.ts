import { sessionBattleQuip, typeMatchupMicrocopy } from './type-matchup-flavor';

describe('typeMatchupMicrocopy', () => {
  it('returns a line for a known pair regardless of argument order', () => {
    const a = typeMatchupMicrocopy('fire', 'grass');
    const b = typeMatchupMicrocopy('grass', 'fire');
    expect(a).toBeTruthy();
    expect(a).toBe(b);
  });

  it('returns mirror line for identical types', () => {
    expect(typeMatchupMicrocopy('water', 'water')).toContain('mirror match');
  });

  it('returns null when a type is missing', () => {
    expect(typeMatchupMicrocopy(undefined, 'fire')).toBeNull();
    expect(typeMatchupMicrocopy('fire', undefined)).toBeNull();
  });

  it('returns null for a known, non-mirror pair with no authored line', () => {
    expect(typeMatchupMicrocopy('normal', 'fire')).toBeNull();
  });
});

describe('sessionBattleQuip', () => {
  it('is stable for the same names', () => {
    expect(sessionBattleQuip('a', 'b')).toBe(sessionBattleQuip('a', 'b'));
  });

  it('returns a non-empty string', () => {
    expect(sessionBattleQuip('x', 'y').length).toBeGreaterThan(0);
  });

  it('falls back to empty strings when names are missing', () => {
    expect(sessionBattleQuip(undefined, undefined).length).toBeGreaterThan(0);
  });
});
