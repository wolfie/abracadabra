import { Ability, GameState, ManaPool, Permanent } from '../types';
import tapPermanentReducer from './tap-permanent';
import { findPermanent } from '../../util';

const payPossibleSelfTapReducer = (
  state: GameState,
  permanent: Permanent,
  ability: Ability
): GameState =>
  ability.cost.tapSelf ? tapPermanentReducer(state, permanent.id) : state;

const gainPossibleManaReducer = (
  state: GameState,
  ability: Ability
): GameState =>
  Ability.isManaAbility(ability)
    ? { ...state, manaPool: ManaPool.Add(state.manaPool, ability.effect()) }
    : state;

const activateAbilityReducer = (
  state: GameState,
  permanentId: number,
  abilityId: number
): GameState => {
  const activatedPermanent = findPermanent(state, permanentId);
  const activatedAbility = activatedPermanent.abilities[abilityId];

  if (!activatedAbility.usesStack) {
    state = payPossibleSelfTapReducer(
      state,
      activatedPermanent,
      activatedAbility
    );
    state = gainPossibleManaReducer(state, activatedAbility);
  } else {
    throw new Error('Stack abilities not supported');
  }

  return state;
};

export default activateAbilityReducer;
