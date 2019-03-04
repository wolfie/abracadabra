import {
  GameState,
  GameStateActions,
  TAP_PERMANENT,
  ENTER_PERMANENT_TO_BATTLEFIELD,
  ACTIVATE_ABILITY,
  Permanent,
  ActivationCost,
  ManaPool,
  Ability
} from "./types";
import { sum, values, pipe } from "ramda";
import { tapPermanent, activateAbility } from "./actions";

const assert = (fn: (...args: any) => boolean): true => {
  if (!fn()) throw new Error("Assert error");
  return true;
};

const noDuplicateIds = (board: Permanent[], id: number) => (): boolean =>
  !board.find(permanent => permanent.id === id);

export const initialState: GameState = {
  manaPool: ManaPool.Empty,
  board: [],
  graveyard: [],
  hand: [],
  deck: [],
  health: 20,
  nextCardId: 0
};

export const getPermanent = (state: GameState, id: number): Permanent => {
  const card = state.board.find(permanentMaybe => !!permanentMaybe);
  if (card) return card;
  throw new Error(`could not find permanent with id ${id}`);
};

const payManaCost = (
  manaPool: ManaPool,
  cost: ActivationCost
): [ManaPool, ActivationCost] => {
  const deplete = (a: number, b: number): [number, number] => [
    Math.max(0, a - b),
    Math.abs(a - b)
  ];

  const getConvertedManaValue = pipe(
    values,
    sum
  );

  const [bManaLeft, bCostLeft] = deplete(manaPool.b, cost.b);
  const [rManaLeft, rCostLeft] = deplete(manaPool.r, cost.r);
  const [gManaLeft, gCostLeft] = deplete(manaPool.g, cost.g);
  const [uManaLeft, uCostLeft] = deplete(manaPool.u, cost.u);
  const [wManaLeft, wCostLeft] = deplete(manaPool.w, cost.w);
  const [cManaLeft, cCostLeft] = deplete(manaPool.c, cost.c);

  const naiveResult: [ManaPool, ActivationCost] = [
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
      tapSelf: cost.tapSelf
    }
  ];
  const convertedManaLeft = getConvertedManaValue(naiveResult[0]);
  const depleteRemainingManaPool = convertedManaLeft <= cCostLeft;
  return depleteRemainingManaPool
    ? [
        ManaPool.Empty,
        {
          b: bCostLeft,
          r: rCostLeft,
          g: gCostLeft,
          u: uCostLeft,
          w: wCostLeft,
          c: cCostLeft - convertedManaLeft,
          tapSelf: cost.tapSelf
        }
      ]
    : naiveResult;
};

const payPossibleSelfTapReducer = (
  state: GameState,
  permanent: Permanent,
  ability: Ability
): GameState =>
  ability.cost.tapSelf ? tapPermanentReducer(state, permanent.id) : state;

const tapPermanentReducer = (
  state: GameState,
  permanentIdToTap: number
): GameState => ({
  ...state,
  board: state.board.map(permanent =>
    permanent.id === permanentIdToTap
      ? { ...permanent, isTapped: true }
      : permanent
  )
});

const gainPossibleManaReducer = (
  state: GameState,
  ability: Ability
): GameState =>
  Ability.isManaAbility(ability)
    ? { ...state, manaPool: ManaPool.Add(state.manaPool, ability.effect()) }
    : state;

export const gameStateReducer = (
  state = initialState,
  action: GameStateActions
): GameState => {
  switch (action.type) {
    case TAP_PERMANENT: {
      return tapPermanentReducer(state, action.id);
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
      let activatedPermanent = getPermanent(state, action.permanentId);

      const activatedAbility = activatedPermanent.abilities[action.abilityId];

      if (!activatedAbility.usesStack) {
        state = payPossibleSelfTapReducer(
          state,
          activatedPermanent,
          activatedAbility
        );
        state = gainPossibleManaReducer(state, activatedAbility);
      } else {
        throw new Error("Stack abilities not supported");
      }

      return state;
    }

    default:
      return state;

      throw new Error(
        "Reducer not returning on action " + JSON.stringify(action)
      );
  }
};
