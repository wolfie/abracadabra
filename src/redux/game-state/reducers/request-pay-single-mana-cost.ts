import { AnAmountOfEachMana, GameState, ManaColor } from '../types';
import { mapObjIndexed } from 'ramda';
import { manaExactly } from '../../util';

const reduceColorByOne = (color: ManaColor) => (num: number, key: string) =>
  key === color ? num - 1 : num;

const requestPaySingleManaCostReducer = (
  state: GameState,
  color: ManaColor
) => {
  const owedExactly = manaExactly(state.owedMana);

  const currentOwedOfColor = owedExactly[color];
  const exactlyThisColorIsNeeded =
    currentOwedOfColor > 0 && owedExactly[color] > 0;
  const useThisColorForGenericMana =
    !exactlyThisColorIsNeeded && owedExactly.c > 0;
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
        reduceColorByOne(exactlyThisColorIsNeeded ? color : 'c'),
        state.owedMana
      )
    };
  } else return state;
};

export default requestPaySingleManaCostReducer;
