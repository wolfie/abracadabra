import { GameState, GameStateActions } from './types';
import {
  ACTIVATE_ABILITY,
  CAST,
  MOVE_CARD_BETWEEN_ZONES,
  POP_STACK,
  REQUEST_PAY_SINGLE_MANA_COST
} from './types';
import moveCardBetweenZonesReducer from './reducers/move-card-between-zones';
import activateAbilityReducer from './reducers/activate-ability';
import castReducer from './reducers/cast';
import popStackReducer from './reducers/pop-stack';
import requestPaySingleManaCostReducer from './reducers/request-pay-single-mana-cost';
import updateActivatableCardIdsReducer from './reducers/update-activatable-card-ids';

const gameStateReducer = (
  state = GameState.NULL,
  action: GameStateActions
): GameState => {
  if (action.type.startsWith('@@')) return state;

  switch (action.type) {
    case MOVE_CARD_BETWEEN_ZONES:
      return moveCardBetweenZonesReducer(
        state,
        action.card,
        action.from,
        action.to
      );

    case ACTIVATE_ABILITY: {
      return activateAbilityReducer(
        state,
        action.permanentId,
        action.abilityId
      );
    }

    case CAST: {
      return castReducer(state, action.card);
    }

    case POP_STACK: {
      return popStackReducer(state);
    }

    case REQUEST_PAY_SINGLE_MANA_COST: {
      return requestPaySingleManaCostReducer(state, action.mana);
    }

    default:
      throw new Error(
        'Reducer not returning on action ' + JSON.stringify(action)
      );
  }
};

export default (state = GameState.NULL, action: GameStateActions): GameState =>
  updateActivatableCardIdsReducer(gameStateReducer(state, action));
