import { GameState, ManaPool } from '../types';
import getStepInfo, { StepInfo } from '../transformers/step-transformer';
import { hasCreaturesToAttackWith } from '../selectors';

const END_STEP = 11;

const nextStep = (currentStepInfo: StepInfo, shouldGoToCombat: boolean) =>
  currentStepInfo.isPreCombatMain && !shouldGoToCombat
    ? END_STEP
    : (currentStepInfo.stepIndex + 1) % 13;

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

const advanceStepReducer = (prevState: GameState): GameState => {
  const stepInfo = getStepInfo(prevState.currentStep);
  const shouldGoToCombat = hasCreaturesToAttackWith(prevState);

  let nextState: GameState = {
    ...prevState,
    currentStep: nextStep(stepInfo, shouldGoToCombat)
  };

  const prevPhaseInfo = getStepInfo(prevState.currentStep);
  const nextPhaseInfo = getStepInfo(nextState.currentStep);
  const phaseHasChanged = prevPhaseInfo.phaseIndex !== nextPhaseInfo.phaseIndex;
  if (phaseHasChanged) nextState = emptyManaPoolReducer(nextState);
  if (nextPhaseInfo.isUntapStep) nextState = resetLandsPlayedReducer(nextState);
  if (nextPhaseInfo.isUntapStep) nextState = untapPermanentsReducer(nextState);

  return nextState;
};

export default advanceStepReducer;
