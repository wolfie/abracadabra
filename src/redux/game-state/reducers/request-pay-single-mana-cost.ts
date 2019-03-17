import { GameState, ManaPool } from '../types';
import { mapObjIndexed } from 'ramda';

const reduceColorByOne = (color: keyof ManaPool) => (
  num: number,
  key: string
) => (key === color ? num - 1 : num);

const requestPaySingleManaCostReducer = (
  state: GameState,
  color: keyof ManaPool
) => {
  const currentOwedOfColor = state.owedMana[color] || 0;
  const exactlyThisColorIsNeeded =
    currentOwedOfColor > 0 && state.manaPool[color] > 0;
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
      ) as ManaPool,
      owedMana: mapObjIndexed(
        reduceColorByOne(exactlyThisColorIsNeeded ? color : 'c'),
        state.owedMana
      )
    };
  } else return state;
};

export default requestPaySingleManaCostReducer;
