import { GameState } from '../types';
import advanceStepReducer from './advance-step-reducer';

const UNTAP_STEP = 0;
const PRE_COMBAT_MAIN_STEP = 3;
const END_STEP = 11;
const CLEANUP_STEP = 12;

describe('advance-step-reducer', () => {
  let state: GameState;

  beforeEach(() => {
    state = GameState.NULL;
  });

  it('should advance the step by one', () => {
    const startStep = state.currentStep;
    state = advanceStepReducer(state);
    expect(state.currentStep).toBe(startStep + 1);
  });

  it('should go to untap phase after the cleanup step', () => {
    state = { ...state, currentStep: CLEANUP_STEP };
    state = advanceStepReducer(state);
    expect(state.currentStep).toBe(UNTAP_STEP);
  });

  it('should skip combat steps if there are no creatures on the battlefield', () => {
    state = { ...state, board: [], currentStep: PRE_COMBAT_MAIN_STEP };
    state = advanceStepReducer(state);
    expect(state.currentStep).toBe(END_STEP);
  });

  it.todo(
    'should not skip combat steps if there are combat-ready creatures on the battlefield'
  );
});
