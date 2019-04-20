import { Card, GameState, Zone } from '../types';
import { canProvideManaNow, isEmpty, isInstant, isLand } from '../../util';
import { map, pipe, reject, uniq } from 'ramda';
import getStepInfo, { StepInfo } from '../transformers/step-transformer';

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

const sorcerySpeedHandCards = (state: GameState, stepInfo: StepInfo): Card[] =>
  stepInfo.isMainPhase && state.stack.length === 0
    ? [...Zone.toCardArray('hand', state)]
    : [];

const whenManaOwed = (state: GameState): Card[] =>
  !isEmpty(state.owedMana) ? findManaSourcesIn('battlefield', state) : [];

const landHasBeenPlayedAndThisIsALand = (state: GameState) => (card: Card) =>
  state.landsPlayed > 0 && isLand(card);

const findActivatables = (state: GameState): Card[] => {
  const stepInfo = getStepInfo(state.currentStep);
  return reject(landHasBeenPlayedAndThisIsALand(state))([
    ...whenManaOwed(state),
    ...sorcerySpeedHandCards(state, stepInfo),
    ...whenStackIsPopulatedAndNothingIsOwed(state)
  ]);
};

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
