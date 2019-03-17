import { Card, CardTypeInfo, ManaPool } from '../game-state/types';

export const darkRitual: Card = {
  castingCost: { b: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { b: 3 })
  }),
  id: 1, // TODO replace with a given parameter
  name: 'Dark Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};
