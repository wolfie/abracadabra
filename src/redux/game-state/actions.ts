import { Card, GameStateActions, ManaColor, Zone } from './types';
import {
  ACTIVATE_ABILITY,
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
