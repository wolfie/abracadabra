import {
  Ability,
  ActivatedAbility,
  GameState,
  ManaAbility,
  Permanent
} from '../types';
import { add, findPermanent } from '../../util';

const tapPermanent = (
  state: GameState,
  permanentIdToTap: number
): GameState => ({
  ...state,
  board: state.board.map(permanent =>
    permanent.id === permanentIdToTap
      ? { ...permanent, isTapped: true }
      : permanent
  )
});

function gainMana(state: GameState, ability: ManaAbility): GameState {
  return { ...state, manaPool: add(state.manaPool, ability.effect()) };
}

const payPossibleSelfTapReducer = (
  state: GameState,
  permanent: Permanent,
  ability: ActivatedAbility
): GameState =>
  ability.cost.tapSelf ? tapPermanent(state, permanent.id) : state;

const possiblyGainMana = (
  state: GameState,
  ability: ActivatedAbility
): GameState =>
  Ability.isManaAbility(ability) ? gainMana(state, ability) : state;

const activateAbilityReducer = (
  state: GameState,
  permanentId: number,
  abilityId: number
): GameState => {
  const activatedPermanent = findPermanent(state, permanentId);
  const activatedAbility = activatedPermanent.activatedAbilities[abilityId];

  if (!activatedAbility.usesStack) {
    state = payPossibleSelfTapReducer(
      state,
      activatedPermanent,
      activatedAbility
    );
    state = possiblyGainMana(state, activatedAbility);
  } else {
    throw new Error('Stack abilities not supported');
  }

  return state;
};

export default activateAbilityReducer;
