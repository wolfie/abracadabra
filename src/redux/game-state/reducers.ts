import {
  GameState,
  GameStateActions,
  TAP_PERMANENT,
  ENTER_PERMANENT_TO_BATTLEFIELD,
  ACTIVATE_ABILITY,
  Permanent,
  Cost,
  ManaPool
} from './types';
import { sum, values, pipe } from 'ramda';

const assert = (fn: (...args: any) => boolean): true => {
  if (!fn()) throw new Error('Assert error');
  return true;
};

const noDuplicateIds = (board: Permanent[], id: number) => (): boolean =>
  !board.find(permanent => permanent.id === id);

const emptyManaPool: ManaPool = {
  r: 0,
  g: 0,
  b: 0,
  u: 0,
  w: 0,
  c: 0
};

export const initialState: GameState = {
  manaPool: emptyManaPool,
  board: [],
  graveyard: [],
  hand: [],
  deck: [],
  health: 20,
  nextCardId: 0,
  costsOwed: Cost.Empty
};

export const getPermanent = (state: GameState, id: number): Permanent => {
  const card = state.board.find(permanentMaybe => !!permanentMaybe);
  if (card) return card;
  throw new Error(`could not find permanent with id ${id}`);
};

const payCost = (manaPool: ManaPool, abilityCost: Cost): [ManaPool, Cost] => {
  const deplete = (a: number, b: number): [number, number] => [
    Math.max(0, a - b),
    Math.abs(a - b)
  ];

  const getConvertedManaValue = pipe(
    values,
    sum
  );

  const [bManaLeft, bCostLeft] = deplete(manaPool.b, abilityCost.b);
  const [rManaLeft, rCostLeft] = deplete(manaPool.r, abilityCost.r);
  const [gManaLeft, gCostLeft] = deplete(manaPool.g, abilityCost.g);
  const [uManaLeft, uCostLeft] = deplete(manaPool.u, abilityCost.u);
  const [wManaLeft, wCostLeft] = deplete(manaPool.w, abilityCost.w);
  const [cManaLeft, cCostLeft] = deplete(manaPool.c, abilityCost.c);

  const naiveResult: [ManaPool, Cost] = [
    {
      b: bManaLeft,
      r: rManaLeft,
      g: gManaLeft,
      u: uManaLeft,
      w: wManaLeft,
      c: cManaLeft
    },
    {
      b: bCostLeft,
      r: rCostLeft,
      g: gCostLeft,
      u: uCostLeft,
      w: wCostLeft,
      c: cCostLeft,
      taps: abilityCost.taps
    }
  ];
  const convertedManaLeft = getConvertedManaValue(naiveResult[0]);
  const depleteRemainingManaPool = convertedManaLeft <= cCostLeft;
  return depleteRemainingManaPool
    ? [
        emptyManaPool,
        {
          b: bCostLeft,
          r: rCostLeft,
          g: gCostLeft,
          u: uCostLeft,
          w: wCostLeft,
          c: cCostLeft - convertedManaLeft,
          taps: abilityCost.taps
        }
      ]
    : naiveResult;
};

export const gameStateReducer = (
  state = initialState,
  action: GameStateActions
): GameState => {
  switch (action.type) {
    case TAP_PERMANENT: {
      return {
        ...state,
        board: state.board.map(permanent =>
          permanent.id === action.id
            ? { ...permanent, isTapped: true }
            : permanent
        )
      };
    }

    case ENTER_PERMANENT_TO_BATTLEFIELD: {
      return (
        assert(noDuplicateIds(state.board, action.permanent.id)) && {
          ...state,
          board: [...state.board, action.permanent]
        }
      );
    }

    case ACTIVATE_ABILITY: {
      const permanent = getPermanent(state, action.permanentId);
      const abilityCost = permanent.abilities[action.abilityId].cost;

      const [newManaPool, remainingCost] = payCost(state.manaPool, abilityCost);

      return {
        ...state,
        manaPool: newManaPool,
        costsOwed: remainingCost
      };
    }

    default:
      return state;
  }
};
