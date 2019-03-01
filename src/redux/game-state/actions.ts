import {
  TAP_PERMANENT,
  ENTER_PERMANENT_TO_BATTLEFIELD,
  Permanent,
  ACTIVATE_ABILITY,
  GameStateActions
} from './types';

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
