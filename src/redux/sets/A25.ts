import { CardPrototype, CardTypeInfo, ManaPool } from '../game-state/types';

export const darkRitual: CardPrototype = {
  castingCost: { b: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { b: 3 })
  }),
  name: 'Dark Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};
