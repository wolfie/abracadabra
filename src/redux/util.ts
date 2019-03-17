import { Card, GameState, HasTypeInfo } from './game-state/types';

// TODO: add support for optional message
// TODO: conditionally replace with a noop function in production builds
export const assert = (fn: (...args: any) => boolean): true => {
  if (!fn()) throw new Error('Assert error');
  return true;
};

export const isLand = (card: HasTypeInfo): boolean =>
  card.typeInfo.types.indexOf('land') >= 0;

export const isInstant = (card: HasTypeInfo): boolean =>
  card.typeInfo.types.indexOf('instant') >= 0;

export const canProvideManaNow = (state: GameState) => (
  card: Card
): boolean => {
  return card.canProvideManaNow ? card.canProvideManaNow(state, card) : false;
};
