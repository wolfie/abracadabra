import { GameState } from '../types';
import requestPaySingleManaCostReducer from './request-pay-single-mana-cost';
import { isEmpty } from '../../util';

describe('requestPaySingleManaCostReducer', () => {
  let state: GameState;
  beforeEach(() => {
    state = GameState.NULL;
  });

  it('should pay off a black mana with a black mana', () => {
    state = {
      ...state,
      manaPool: { b: 1 },
      owedMana: { b: 1 }
    };

    expect(isEmpty(state.manaPool)).toBeFalsy();
    expect(isEmpty(state.owedMana)).toBeFalsy();

    state = requestPaySingleManaCostReducer(state, 'b');

    expect(isEmpty(state.manaPool)).toBeTruthy();
    expect(isEmpty(state.owedMana)).toBeTruthy();
  });

  it('should pay off a generic mana with a black mana', () => {
    state = {
      ...state,
      manaPool: { b: 1 },
      owedMana: { _: 1 }
    };

    expect(isEmpty(state.manaPool)).toBeFalsy();
    expect(isEmpty(state.owedMana)).toBeFalsy();

    state = requestPaySingleManaCostReducer(state, 'b');

    expect(isEmpty(state.manaPool)).toBeTruthy();
    expect(isEmpty(state.owedMana)).toBeTruthy();
  });

  it('should NOT pay off a colorless mana with a black mana', () => {
    state = {
      ...state,
      manaPool: { b: 1 },
      owedMana: { c: 1 }
    };

    expect(isEmpty(state.manaPool)).toBeFalsy();
    expect(isEmpty(state.owedMana)).toBeFalsy();

    state = requestPaySingleManaCostReducer(state, 'b');

    expect(isEmpty(state.manaPool)).toBeFalsy();
    expect(isEmpty(state.owedMana)).toBeFalsy();
  });
});
