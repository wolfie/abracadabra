import { Card, GameState, Zone } from '../types';
import { add, isLand } from '../../util';
import moveCardBetweenZonesReducer from './move-card-between-zones';
import { backupStateReducer } from './state-memory-reducers';

const incrementLandsPlayedCounter = (state: GameState): GameState => ({
  ...state,
  landsPlayed: state.landsPlayed + 1
});

const castReducer = (state: GameState, card: Card) => {
  // Casting spells: https://www.yawgatog.com/resources/magic-rules/#R601

  const originZone = Zone.find(card, state);
  if (isLand(card)) {
    // Special action, playing a land: https://www.yawgatog.com/resources/magic-rules/#R1152a

    state = moveCardBetweenZonesReducer(state, card, originZone, 'battlefield');
    state = incrementLandsPlayedCounter(state);
    return state;
  } else {
    // prepare for undo action
    state = backupStateReducer(state);

    // Put card on stack https://www.yawgatog.com/resources/magic-rules/#R6012a
    state = moveCardBetweenZonesReducer(state, card, originZone, 'stack');

    // TODO: 601.2b-e

    // Require casting cost https://www.yawgatog.com/resources/magic-rules/#R6012f
    state = {
      ...state,
      owedMana: add(state.owedMana, card.castingCost)
    };

    return state;
  }
};

export default castReducer;
