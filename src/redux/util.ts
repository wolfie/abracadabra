import {
  AnAmountOfEachMana,
  AnAmountOfEachManaAndGeneric,
  AnAmountOfMana,
  AnAmountOfManaOrGeneric,
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

interface ManaFiller {
  (someMana: AnAmountOfManaOrGeneric): AnAmountOfEachManaAndGeneric;
  (someMana: AnAmountOfMana): AnAmountOfEachMana;
}
export const fillManaObject: ManaFiller = (someMana: any): any => ({
  ...ManaPool.NULL,
  _: 0,
  ...someMana
});

export const add = (
  mana1: AnAmountOfMana,
  mana2: AnAmountOfMana
): AnAmountOfEachMana => {
  const filledMana1 = fillManaObject(mana1);
  const filledMana2 = fillManaObject(mana2);
  return {
    g: filledMana1.g + filledMana2.g,
    r: filledMana1.r + filledMana2.r,
    b: filledMana1.b + filledMana2.b,
    u: filledMana1.u + filledMana2.u,
    w: filledMana1.w + filledMana2.w,
    c: filledMana1.c + filledMana2.c
  };
};

export const isEmpty = (mana: AnAmountOfManaOrGeneric): boolean =>
  pipe(
    values,
    sum,
    equals(0)
  )(mana);
