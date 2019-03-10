import {
  ACTIVATE_ABILITY,
  CAST,
  MOVE_CARD_BETWEEN_ZONES,
  POP_STACK,
  TAP_PERMANENT,
  GameStateActions,
  Card,
  Zone
} from './types';

export const tapPermanent = (id: number): GameStateActions => ({
  type: TAP_PERMANENT,
  id
});

export const activateAbility = (
  permanentId: number,
  abilityId: number
): GameStateActions => ({
  type: ACTIVATE_ABILITY,
  permanentId,
  abilityId
});

export const moveCardsBetweenZones = (
  card: Card,
  from: Zone,
  to: Zone
): GameStateActions => ({
  type: MOVE_CARD_BETWEEN_ZONES,
  card,
  from,
  to
});

export const cast = (card: Card): GameStateActions => ({
  type: CAST,
  card
});

export const popStack = (): GameStateActions => ({
  type: POP_STACK
});
