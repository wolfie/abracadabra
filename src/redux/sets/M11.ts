import { CardPrototype, CardTypeInfo } from '../game-state/types';
import { add } from '../util';

export const pyreticRitual: CardPrototype = {
  ...CardPrototype.NULL,
  castingCost: { r: 1, _: 1 },
  onResolve: state => ({
    ...state,
    manaPool: add(state.manaPool, { r: 3 })
  }),
  name: 'Pyretic Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};

export const ornithopter: CardPrototype = {
  ...CardPrototype.NULL_PERMANENT,
  castingCost: { _: 0 },
  name: 'Ornithopter',
  typeInfo: {
    types: ['artifact', 'creature'],
    subTypes: ['thopter']
  },
  staticAbilities: ['flying'],
  power: 0,
  toughness: 2
};
