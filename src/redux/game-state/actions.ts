import {
  TAP_PERMANENT,
  ENTER_PERMANENT_TO_BATTLEFIELD,
  MOVE_CARD_BETWEEN_ZONES,
  ACTIVATE_ABILITY,
  Permanent,
  GameStateActions,
  Card,
  Zone
} from "./types";

export const tapPermanent = (id: number): GameStateActions => ({
  type: TAP_PERMANENT,
  id
});

export const enterPermanentToBattlefield = (
  permanent: Permanent
): GameStateActions => ({
  type: ENTER_PERMANENT_TO_BATTLEFIELD,
  permanent
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
