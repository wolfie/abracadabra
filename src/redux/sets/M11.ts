import { Card, CardTypeInfo, ManaPool } from '../game-state/types';

export const pyreticRitual: Card = {
  castingCost: { r: 1, c: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { r: 3 })
  }),
  id: 2, // TODO replace with a given parameter
  name: 'Pyretic Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};

export const ornithopter: Card = {
  ...Card.NULL,
  id: 99, // TODO replace with a given parameter
  name: 'Ornithopter'
};
