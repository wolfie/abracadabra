import { AnAmountOfMana, GameState, ManaColor } from '../types';
import { mapObjIndexed } from 'ramda';

const reduceColorByOne = (color: ManaColor) => (num: number, key: string) =>
  key === color ? num - 1 : num;

const requestPaySingleManaCostReducer = (
  state: GameState,
  color: ManaColor
) => {
  const currentOwedOfColor = state.owedMana[color] || 0;
  const exactlyThisColorIsNeeded =
    currentOwedOfColor > 0 && (state.manaPool[color] || 0) > 0;
  const useThisColorForGenericMana =
    !exactlyThisColorIsNeeded && (state.owedMana.c || 0) > 0;
  const isValidManaPayment =
    exactlyThisColorIsNeeded || useThisColorForGenericMana;

  if (isValidManaPayment) {
    return {
      ...state,
      manaPool: mapObjIndexed(
        reduceColorByOne(color),
        state.manaPool
      ) as AnAmountOfMana,
      owedMana: mapObjIndexed(
        reduceColorByOne(exactlyThisColorIsNeeded ? color : 'c'),
        state.owedMana
      )
    };
  } else return state;
};

export default requestPaySingleManaCostReducer;
