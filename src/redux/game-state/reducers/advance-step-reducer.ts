import { GameState, ManaPool } from '../types';
import getStepInfo from '../transformers/phase-transformer';

const nextStep = (phaseIndex: number) => (phaseIndex + 1) % 13;

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
  let nextState: GameState = {
    ...prevState,
    currentStep: nextStep(prevState.currentStep)
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
