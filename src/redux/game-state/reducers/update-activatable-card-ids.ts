import { Card, GameState, Zone } from '../types';
import { canProvideManaNow, isEmpty, isInstant } from '../../util';
import { map, pipe, uniq } from 'ramda';

const cardToId = (card: Card) => card.id;

const findInstantsIn = (zone: Zone, state: GameState) =>
  Zone.toCardArray(zone, state).filter(isInstant);

const findManaSourcesIn = (zone: Zone, state: GameState) =>
  Zone.toCardArray(zone, state).filter(canProvideManaNow(state));

const whenStackIsPopulatedAndNothingIsOwed = (state: GameState): Card[] =>
  state.stack.length > 0 && isEmpty(state.owedMana)
    ? [
        ...findInstantsIn('hand', state),
        ...findManaSourcesIn('battlefield', state)
      ]
    : [];

const whenStackIsEmpty = (state: GameState): Card[] =>
  state.stack.length === 0 ? [...Zone.toCardArray('hand', state)] : [];

const whenManaOwed = (state: GameState): Card[] =>
  !isEmpty(state.owedMana) ? findManaSourcesIn('battlefield', state) : [];

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

export default updateActivatableCardIdsReducer;
