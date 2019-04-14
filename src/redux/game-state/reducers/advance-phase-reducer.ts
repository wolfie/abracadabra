import { GameState } from '../types';

const nextPhase = (phaseIndex: number) => (phaseIndex + 1) % 13;

const advancePhaseReducer = (state: GameState): GameState => ({
  ...state,
  currentPhase: nextPhase(state.currentPhase)
});

export default advancePhaseReducer;
