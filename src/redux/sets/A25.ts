import { CardPrototype, CardTypeInfo } from '../game-state/types';
import { add } from '../util';

export const darkRitual: CardPrototype = {
  ...CardPrototype.NULL,
  castingCost: { b: 1 },
  onResolve: state => ({
    ...state,
    manaPool: add(state.manaPool, { b: 3 })
  }),
  name: 'Dark Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};
