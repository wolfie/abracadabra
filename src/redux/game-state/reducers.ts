import {
  Ability,
  ActivationCost,
  Card,
  GameState,
  GameStateActions,
  ManaPool,
  Permanent,
  Zone
} from './types';
import {
  ACTIVATE_ABILITY,
  CAST,
  MOVE_CARD_BETWEEN_ZONES,
  POP_STACK,
  REQUEST_PAY_SINGLE_MANA_COST,
  TAP_PERMANENT
} from './types';
import { map, mapObjIndexed, pipe, sum, uniq, values } from 'ramda';
import { assert } from '../util';

export const getPermanent = (state: GameState, id: number): Permanent => {
  const card = state.board.find(permanentOnBoard => permanentOnBoard.id === id);
  if (card) return card;
  throw new Error(`could not find permanent with id ${id}`);
};

// @ts-ignore
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
        ManaPool.NULL,
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

export const moveCardBetweenZonesReducer = (
  state: GameState,
  card: Card,
  from: Zone,
  to: Zone
): GameState => {
  assert(() => from !== to);
  const thisCard = (card_: Card) => card_.id === card.id;
  const notThisCard = (card_: Card) => card_.id !== card.id;

  switch (from) {
    case null:
      break;
    case 'hand':
      assert(() => state.hand.find(thisCard) !== undefined);
      state = {
        ...state,
        hand: state.hand.filter(notThisCard)
      };
      break;
    case 'battlefield':
      assert(() => state.board.find(thisCard) !== undefined);
      state = { ...state, board: state.board.filter(notThisCard) };
      break;
    case 'stack':
      assert(() => state.stack.find(thisCard) !== undefined);
      state = { ...state, stack: state.stack.filter(notThisCard) };
      break;
    default:
      throw new Error('unsupported from-zone: ' + from);
  }

  switch (to) {
    case null:
      break;
    case 'hand':
      state = { ...state, hand: [...state.hand, card] };
      break;
    case 'battlefield':
      state = {
        ...state,
        board: [...state.board, { ...card, isTapped: false }]
      };
      break;
    case 'stack':
      state = { ...state, stack: [...state.stack, card] };
      break;
    default:
      throw new Error('unsupported to-zone: ' + to);
  }

  return state;
};

const cardToId = (card: Card) => card.id;

const findInstantsIn = (zone: Zone, state: GameState) =>
  Zone.toCardArray(zone, state).filter(Card.isInstant);

const findManaSourcesIn = (zone: Zone, state: GameState) =>
  Zone.toCardArray(zone, state).filter(card => card.canProvideManaNow(state));

const whenStackIsPopulatedAndNothingIsOwed = (state: GameState): Card[] =>
  state.stack.length > 0 && ManaPool.IsEmpty(state.owedMana)
    ? [
        ...findInstantsIn('hand', state),
        ...findManaSourcesIn('battlefield', state)
      ]
    : [];

const whenStackIsEmpty = (state: GameState): Card[] =>
  state.stack.length === 0 ? [...Zone.toCardArray('hand', state)] : [];

const whenManaOwed = (state: GameState): Card[] =>
  !ManaPool.IsEmpty(state.owedMana)
    ? findManaSourcesIn('battlefield', state)
    : [];

const findActivatables = (state: GameState): Card[] => [
  ...whenManaOwed(state),
  ...whenStackIsEmpty(state),
  ...whenStackIsPopulatedAndNothingIsOwed(state)
];

const findActivatableCardIdsDuringState = pipe(
  findActivatables,
  map(cardToId),
  uniq
);

const updateActivatableCardIdsReducer = (state: GameState) => ({
  ...state,
  activatableCardIds: findActivatableCardIdsDuringState(state)
});

const reduceColorByOne = (color: keyof ManaPool) => (
  num: number,
  key: string
) => (key === color ? num - 1 : num);

const gameStateReducer_ = (
  state = GameState.NULL,
  action: GameStateActions
): GameState => {
  if (action.type.startsWith('@@')) return state;

  switch (action.type) {
    case TAP_PERMANENT: {
      return tapPermanentReducer(state, action.id);
    }

    case MOVE_CARD_BETWEEN_ZONES:
      return moveCardBetweenZonesReducer(
        state,
        action.card,
        action.from,
        action.to
      );

    case ACTIVATE_ABILITY: {
      const activatedPermanent = getPermanent(state, action.permanentId);
      const activatedAbility = activatedPermanent.abilities[action.abilityId];

      if (!activatedAbility.usesStack) {
        state = payPossibleSelfTapReducer(
          state,
          activatedPermanent,
          activatedAbility
        );
        state = gainPossibleManaReducer(state, activatedAbility);
      } else {
        throw new Error('Stack abilities not supported');
      }

      return state;
    }

    case CAST: {
      // Casting spells: https://www.yawgatog.com/resources/magic-rules/#R601

      const card = action.card;
      const originZone = Zone.find(card, state);
      if (Card.isLand(card)) {
        // Special action, playing a land: https://www.yawgatog.com/resources/magic-rules/#R1152a

        return moveCardBetweenZonesReducer(
          state,
          card,
          originZone,
          'battlefield'
        );
      } else {
        // Put card on stack https://www.yawgatog.com/resources/magic-rules/#R6012a
        state = moveCardBetweenZonesReducer(state, card, originZone, 'stack');

        // TODO: 601.2b-e

        // Require casting cost https://www.yawgatog.com/resources/magic-rules/#R6012f
        state = {
          ...state,
          owedMana: ManaPool.Add(state.owedMana, card.castingCost)
        };

        return state;
      }
    }

    case POP_STACK: {
      const isNotLastelement = (_: unknown, i: number) =>
        i !== state.stack.length - 1;

      const poppedStackObject = state.stack[state.stack.length - 1];
      const stackWithoutPoppedObject = state.stack.filter(isNotLastelement);
      state = { ...state, stack: stackWithoutPoppedObject };
      state = poppedStackObject.onResolve(state);
      return state;
    }

    case REQUEST_PAY_SINGLE_MANA_COST: {
      const color = action.mana;
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
    }

    default:
      throw new Error(
        'Reducer not returning on action ' + JSON.stringify(action)
      );
  }
};

export const gameStateReducer = (
  state = GameState.NULL,
  action: GameStateActions
): GameState =>
  updateActivatableCardIdsReducer(gameStateReducer_(state, action));
