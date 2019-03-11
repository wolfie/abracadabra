import {
  ACTIVATE_ABILITY,
  Card,
  CAST,
  GameStateActions,
  MOVE_CARD_BETWEEN_ZONES,
  POP_STACK,
  TAP_PERMANENT,
  Zone
} from './types';

export const tapPermanentAction = (id: number): GameStateActions => ({
  type: TAP_PERMANENT,
  id
});

export const activateAbilityAction = (
  permanentId: number,
  abilityId: number
): GameStateActions => ({
  type: ACTIVATE_ABILITY,
  permanentId,
  abilityId
});

export const moveCardsBetweenZonesAction = (
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
