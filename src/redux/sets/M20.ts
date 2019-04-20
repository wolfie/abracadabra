import {
  Ability,
  Card,
  CardPrototype,
  CardTypeInfo,
  GameState,
  Permanent,
  Zone
} from '../game-state/types';

export const swamp: CardPrototype = {
  ...CardPrototype.NULL,
  castingCost: {},
  activatedAbilities: [Ability.TapForBlackMana],
  name: 'Swamp',
  typeInfo: CardTypeInfo.Swamp,
  canProvideManaNow: (state: GameState, self: Card) =>
    Zone.cardIsIn('battlefield', self, state) &&
    Permanent.matches(self) &&
    self.isTapped
};

export const mountain: CardPrototype = {
  ...CardPrototype.NULL,
  castingCost: {},
  activatedAbilities: [Ability.TapForRedMana],
  name: 'Mountain',
  typeInfo: CardTypeInfo.Mountain,
  canProvideManaNow: (state: GameState, self: Card) =>
    Zone.cardIsIn('battlefield', self, state) &&
    Permanent.matches(self) &&
    self.isTapped
};
