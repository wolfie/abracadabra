import { GameState, ManaPool } from '../types';
import getStepInfo, { StepInfo } from '../transformers/step-transformer';
import {
  hasCreaturesDeclaredToAttach,
  hasCreaturesToAttackWith
} from '../selectors';
import { assert } from '../../util';

const END_STEP = 11;

const nextStep = (currentStepInfo: StepInfo, state: GameState) => {
  const creaturesCanAttack = hasCreaturesToAttackWith(state);
  const noCombatCanHappen =
    currentStepInfo.isPreCombatMain && !creaturesCanAttack;

  const creaturesWereDeclaredToAttack = hasCreaturesDeclaredToAttach(state);
  const noCombatDidHappen =
    currentStepInfo.isCombatDeclareAttackersStep &&
    !creaturesWereDeclaredToAttack;

  const normallyNextStep = (currentStepInfo.stepIndex + 1) % 13;

  if (noCombatCanHappen || noCombatDidHappen) return END_STEP;
  return normallyNextStep;
};

const untapPermanentsReducer = (state: GameState): GameState => ({
  ...state,
  board: state.board.map(permanent => ({ ...permanent, isTapped: false }))
});

const emptyManaPoolReducer = (state: GameState): GameState => ({
  ...state,
  manaPool: ManaPool.NULL
});

const resetLandsPlayedReducer = (state: GameState): GameState => ({
  ...state,
  landsPlayed: 0
});

const removeSummoningSicknessReducer = (state: GameState): GameState => ({
  ...state,
  board: state.board.map(card => ({
    ...card,
    wasCastSinceLastStartOfTurn: false
  }))
});

const advanceStepReducer = (prevState: GameState): GameState => {
  assert(() => prevState.stack.length === 0);

  const stepInfo = getStepInfo(prevState.currentStep);

  const nextState: GameState = {
    ...prevState,
    currentStep: nextStep(stepInfo, prevState)
  };

  const prevPhaseInfo = getStepInfo(prevState.currentStep);
  const nextPhaseInfo = getStepInfo(nextState.currentStep);

  let reducers: Array<(state: GameState) => GameState> = [];

  const phaseHasChanged = prevPhaseInfo.phaseIndex !== nextPhaseInfo.phaseIndex;
  if (phaseHasChanged) reducers = [...reducers, emptyManaPoolReducer];
  if (nextPhaseInfo.isUntapStep) {
    reducers = [
      ...reducers,
      removeSummoningSicknessReducer,
      resetLandsPlayedReducer,
      untapPermanentsReducer
    ];
  }

  return reducers.reduce((state, reducer) => reducer(state), nextState);
};

export default advanceStepReducer;
