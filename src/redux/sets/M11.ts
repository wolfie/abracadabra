import { CardPrototype, CardTypeInfo, ManaPool } from '../game-state/types';

export const pyreticRitual: CardPrototype = {
  castingCost: { r: 1, c: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { r: 3 })
  }),
  name: 'Pyretic Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};

export const ornithopter: CardPrototype = {
  ...CardPrototype.NULL,
  name: 'Ornithopter'
};
