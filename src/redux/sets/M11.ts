import { CardPrototype, CardTypeInfo } from '../game-state/types';
import { add } from '../util';

export const pyreticRitual: CardPrototype = {
  castingCost: { r: 1, _: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: add(state.manaPool, { r: 3 })
  }),
  name: 'Pyretic Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};

export const ornithopter: CardPrototype = {
  ...CardPrototype.NULL,
  name: 'Ornithopter'
};
