import gameStateReducer from '../reducer';
import { createStore, Store as ReduxStore } from 'redux';
import { GameState, GameStateActions } from '../types';
import { requestPaySingleManaCostAction } from '../actions';
import { isEmpty } from '../../util';

type Store = ReduxStore<GameState, GameStateActions>;

describe('requestPaySingleManaCostReducer', () => {
  let store: Store;
  beforeEach(() => {
    store = createStore(gameStateReducer);
  });

  it('should pay off a black mana with a black mana', () => {
    store.getState().manaPool = { b: 1 };
    store.getState().owedMana = { b: 1 };

    expect(isEmpty(store.getState().manaPool)).toBeFalsy();
    expect(isEmpty(store.getState().owedMana)).toBeFalsy();

    store.dispatch(requestPaySingleManaCostAction('b'));

    expect(isEmpty(store.getState().manaPool)).toBeTruthy();
    expect(isEmpty(store.getState().owedMana)).toBeTruthy();
  });

  it('should pay off a generic mana with a black mana', () => {
    store.getState().manaPool = { b: 1 };
    store.getState().owedMana = { _: 1 };

    expect(isEmpty(store.getState().manaPool)).toBeFalsy();
    expect(isEmpty(store.getState().owedMana)).toBeFalsy();

    store.dispatch(requestPaySingleManaCostAction('b'));

    expect(isEmpty(store.getState().manaPool)).toBeTruthy();
    expect(isEmpty(store.getState().owedMana)).toBeTruthy();
  });

  it('should NOT pay off a colorless mana with a black mana', () => {
    store.getState().manaPool = { b: 1 };
    store.getState().owedMana = { c: 1 };

    expect(isEmpty(store.getState().manaPool)).toBeFalsy();
    expect(isEmpty(store.getState().owedMana)).toBeFalsy();

    store.dispatch(requestPaySingleManaCostAction('b'));

    expect(isEmpty(store.getState().manaPool)).toBeFalsy();
    expect(isEmpty(store.getState().owedMana)).toBeFalsy();
  });
});
