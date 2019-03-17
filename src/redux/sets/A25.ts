import { CardPrototype, CardTypeInfo } from '../game-state/types';
import { add } from '../util';

export const darkRitual: CardPrototype = {
  castingCost: { b: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: add(state.manaPool, { b: 3 })
  }),
  name: 'Dark Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};
