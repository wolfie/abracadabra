import {
  Ability,
  Card,
  CardLifetimeEventHandler,
  CardTypeInfo,
  GameState,
  Permanent,
  Zone
} from '../game-state/types';

export const swamp: Card = {
  castingCost: {},
  abilities: [Ability.TapForBlackMana],
  id: 0, // TODO replace with a given parameter
  name: 'Swamp',
  typeInfo: CardTypeInfo.Swamp,
  onResolve: CardLifetimeEventHandler.NULL,
  canProvideManaNow: (state: GameState) =>
    Zone.cardIsIn('battlefield', swamp, state) &&
    Permanent.matches(swamp) &&
    swamp.isTapped
};

export const mountain: Card = {
  castingCost: {},
  abilities: [Ability.TapForRedMana],
  id: 3, // TODO replace with a given parameter
  name: 'Mountain',
  typeInfo: CardTypeInfo.Mountain,
  onResolve: CardLifetimeEventHandler.NULL,
  canProvideManaNow: (state: GameState) =>
    Zone.cardIsIn('battlefield', mountain, state) &&
    Permanent.matches(mountain) &&
    mountain.isTapped
};
