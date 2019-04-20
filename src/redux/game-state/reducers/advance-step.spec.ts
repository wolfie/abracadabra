import { Card, GameState, Permanent } from '../types';
import advanceStepReducer from './advance-step';
import { ornithopter } from '../../sets/M11';

const UNTAP_STEP = 0;
const PRE_COMBAT_MAIN_STEP = 3;
const BEGIN_COMBAT_STEP = 4;
const DECLARE_ATTACKERS_STEP = 5;
const END_STEP = 11;
const CLEANUP_STEP = 12;

const ornithopterPermanent = Permanent.from(Card.from(ornithopter, 0));

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

  it('should skip combat steps if there are only summoning sick creatures on the battlefield', () => {
    state = {
      ...state,
      board: [{ ...ornithopterPermanent, wasCastSinceLastStartOfTurn: true }],
      currentStep: PRE_COMBAT_MAIN_STEP
    };
    state = advanceStepReducer(state);
    expect(state.currentStep).toBe(END_STEP);
  });

  it('should not skip combat steps if there are only summoning sick creatures on the battlefield', () => {
    state = {
      ...state,
      board: [{ ...ornithopterPermanent, wasCastSinceLastStartOfTurn: false }],
      currentStep: PRE_COMBAT_MAIN_STEP
    };
    state = advanceStepReducer(state);
    expect(state.currentStep).toBe(BEGIN_COMBAT_STEP);
  });

  it('should skip declare blockers if no attackers were declared', () => {
    state = {
      ...state,
      board: [{ ...ornithopterPermanent, wasCastSinceLastStartOfTurn: false }],
      currentStep: DECLARE_ATTACKERS_STEP
    };
    state = advanceStepReducer(state);
    expect(state.currentStep).toBe(END_STEP);
  });

  it.todo('should not skip declare blockers if attackers were declared');
});
