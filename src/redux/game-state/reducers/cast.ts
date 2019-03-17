import { Card, GameState, ManaPool, Zone } from '../types';
import { isLand } from '../../util';
import moveCardBetweenZonesReducer from './move-card-between-zones';

const castReducer = (state: GameState, card: Card) => {
  // Casting spells: https://www.yawgatog.com/resources/magic-rules/#R601

  const originZone = Zone.find(card, state);
  if (isLand(card)) {
    // Special action, playing a land: https://www.yawgatog.com/resources/magic-rules/#R1152a

    return moveCardBetweenZonesReducer(state, card, originZone, 'battlefield');
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
};

export default castReducer;
