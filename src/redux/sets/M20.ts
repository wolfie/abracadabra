import {
  Ability,
  Card,
  CardLifetimeEventHandler,
  CardPrototype,
  CardTypeInfo,
  GameState,
  Permanent,
  Zone
} from '../game-state/types';

export const swamp: CardPrototype = {
  castingCost: {},
  abilities: [Ability.TapForBlackMana],
  name: 'Swamp',
  typeInfo: CardTypeInfo.Swamp,
  onResolve: CardLifetimeEventHandler.NULL,
  canProvideManaNow: (state: GameState, self: Card) =>
    Zone.cardIsIn('battlefield', self, state) &&
    Permanent.matches(self) &&
    self.isTapped
};

export const mountain: CardPrototype = {
  castingCost: {},
  abilities: [Ability.TapForRedMana],
  name: 'Mountain',
  typeInfo: CardTypeInfo.Mountain,
  onResolve: CardLifetimeEventHandler.NULL,
  canProvideManaNow: (state: GameState, self: Card) =>
    Zone.cardIsIn('battlefield', self, state) &&
    Permanent.matches(self) &&
    self.isTapped
};
