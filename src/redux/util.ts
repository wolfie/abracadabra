import {
  AnAmountOfEachMana,
  AnAmountOfMana,
  Card,
  GameState,
  HasTypeInfo,
  ManaPool,
  Permanent
} from './game-state/types';
import { equals, pipe, sum, values } from 'ramda';

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

export const findPermanent = (state: GameState, id: number): Permanent => {
  const card = state.board.find(permanentOnBoard => permanentOnBoard.id === id);
  if (card) return card;
  throw new Error(`could not find permanent with id ${id}`);
};

export const manaExactly = (someMana: AnAmountOfMana): AnAmountOfEachMana => ({
  ...ManaPool.NULL,
  ...someMana
});

export const add = (
  mana1: AnAmountOfMana,
  mana2: AnAmountOfMana
): AnAmountOfEachMana => {
  const exact1 = manaExactly(mana1);
  const exact2 = manaExactly(mana2);
  return {
    g: exact1.g + exact2.g,
    r: exact1.r + exact2.r,
    b: exact1.b + exact2.b,
    u: exact1.u + exact2.u,
    w: exact1.w + exact2.w,
    c: exact1.c + exact2.c
  };
};

export const isEmpty = (mana: AnAmountOfMana) =>
  pipe(
    values,
    sum,
    equals(0)
  )(mana);
