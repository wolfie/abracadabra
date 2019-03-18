import {
  AnAmountOfEachMana,
  GameState,
  ManaColor,
  ManaColorOrGeneric
} from '../types';
import { mapObjIndexed } from 'ramda';
import { fillManaObject } from '../../util';

const reduceColorByOne = (color: ManaColorOrGeneric) => (
  num: number,
  key: string
) => (key === color ? num - 1 : num);

const requestPaySingleManaCostReducer = (
  state: GameState,
  color: ManaColor
): GameState => {
  const owedExactly = fillManaObject(state.owedMana);

  const currentOwedOfColor = owedExactly[color];
  const exactlyThisColorIsNeeded =
    currentOwedOfColor > 0 && owedExactly[color] > 0;
  const useThisColorForGenericMana =
    !exactlyThisColorIsNeeded && owedExactly._ > 0;
  const isValidManaPayment =
    exactlyThisColorIsNeeded || useThisColorForGenericMana;

  if (isValidManaPayment) {
    return {
      ...state,
      manaPool: mapObjIndexed(
        reduceColorByOne(color),
        state.manaPool
      ) as AnAmountOfEachMana,
      owedMana: mapObjIndexed(
        reduceColorByOne(exactlyThisColorIsNeeded ? color : '_'),
        state.owedMana
      )
    };
  } else return state;
};

export default requestPaySingleManaCostReducer;
