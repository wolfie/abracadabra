import { Card, GameState, GameStateActions, ManaColor, Zone } from './types';
import {
  __HACK_SET_STATE_ACTION,
  ACTIVATE_ABILITY,
  ADVANCE_STEP_ACTION,
  CANCEL_LAST_ACTION,
  CAST,
  MOVE_CARD_BETWEEN_ZONES,
  POP_STACK,
  REQUEST_PAY_SINGLE_MANA_COST
} from './types';

export const activateAbilityAction = (
  permanentId: number,
  abilityId: number
): GameStateActions => ({
  type: ACTIVATE_ABILITY,
  permanentId,
  abilityId
});

export const moveCardBetweenZonesAction = (
  card: Card,
  from: Zone,
  to: Zone
): GameStateActions => ({
  type: MOVE_CARD_BETWEEN_ZONES,
  card,
  from,
  to
});

export const castAction = (card: Card): GameStateActions => ({
  type: CAST,
  card
});

export const popStackAction = (): GameStateActions => ({
  type: POP_STACK
});

export const requestPaySingleManaCostAction = (
  mana: ManaColor
): GameStateActions => ({
  type: REQUEST_PAY_SINGLE_MANA_COST,
  mana
});

export const cancelLastActionAction = (): GameStateActions => ({
  type: CANCEL_LAST_ACTION
});

export const advancePhaseAction = (): GameStateActions => ({
  type: ADVANCE_STEP_ACTION
});

export const __hackSetStateAction = (state: GameState): GameStateActions => ({
  type: __HACK_SET_STATE_ACTION,
  state
});
