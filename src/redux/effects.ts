import { ManaPool } from './game-state/types';

export const MANA_EFFECT = 'MANA_EFFECT';
interface ManaEffect {
  type: typeof MANA_EFFECT;
  mana: Partial<ManaPool>;
}

export type Effect = ManaEffect;
