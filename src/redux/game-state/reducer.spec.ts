import {
  castAction,
  moveCardBetweenZonesAction,
  popStackAction
} from './actions';
import * as M11 from '../sets/M11';
import * as A25 from '../sets/A25';
import * as M20 from '../sets/M20';
import { Card, GameState, GameStateActions, ManaPool, Zone } from './types';
import 'jest';
import { createStore, Store as ReduxStore } from 'redux';
import { isLand } from '../util';
import gameStateReducer from './reducer';

type Store = ReduxStore<GameState, GameStateActions>;

describe('moveCardBetweenZonesReducer', () => {
  const card = Card.from(M20.swamp, 0);
  let store: Store;

  beforeEach(() => {
    store = createStore(gameStateReducer);
  });

  it('should add to and remove from hand', () => {
    expect(() => Zone.find(card, store.getState())).toThrow();

    store.dispatch(moveCardBetweenZonesAction(card, null, 'hand'));
    expect(Zone.find(card, store.getState())).toBe('hand');

    store.dispatch(moveCardBetweenZonesAction(card, 'hand', null));
    expect(() => Zone.find(card, store.getState())).toThrow();
  });

  it('should add to and remove from battlefield', () => {
    expect(() => Zone.find(card, store.getState())).toThrow();

    store.dispatch(moveCardBetweenZonesAction(card, null, 'battlefield'));
    expect(Zone.find(card, store.getState())).toBe('battlefield');

    store.dispatch(moveCardBetweenZonesAction(card, 'battlefield', null));
    expect(() => Zone.find(card, store.getState())).toThrow();
  });

  it('should add to and remove from stack', () => {
    expect(() => Zone.find(card, store.getState())).toThrow();

    store.dispatch(moveCardBetweenZonesAction(card, null, 'stack'));
    expect(Zone.find(card, store.getState())).toBe('stack');

    store.dispatch(moveCardBetweenZonesAction(card, 'stack', null));
    expect(() => Zone.find(card, store.getState())).toThrow();
  });
});

describe('gameStateReducer', () => {
  describe('castAction', () => {
    let store: Store;
    beforeEach(() => {
      store = createStore(gameStateReducer);
    });

    it('should cast a land directly on the battlefield', () => {
      const mountain = Card.from(M20.mountain, 0);
      expect(isLand(mountain)).toBeTruthy();
      store.dispatch(moveCardBetweenZonesAction(mountain, null, 'hand'));

      store.dispatch(castAction(mountain));

      expect(Zone.find(mountain, store.getState())).toBe('battlefield');
    });

    it('should place a zero-costing non-land card on the stack', () => {
      const ornithopter = Card.from(M11.ornithopter, 0);
      expect(ManaPool.IsEmpty(ornithopter.castingCost)).toBeTruthy();
      store.dispatch(moveCardBetweenZonesAction(ornithopter, null, 'hand'));

      store.dispatch(castAction(ornithopter));

      expect(Zone.find(ornithopter, store.getState())).toBe('stack');
      expect(ManaPool.IsEmpty(store.getState().owedMana)).toBeTruthy();
    });

    it('should require payment for a non-free card', () => {
      const darkRitual = Card.from(A25.darkRitual, 0);
      expect(ManaPool.IsEmpty(darkRitual.castingCost)).toBeFalsy();
      store.dispatch(moveCardBetweenZonesAction(darkRitual, null, 'hand'));

      store.dispatch(castAction(darkRitual));

      expect(Zone.find(darkRitual, store.getState())).toBe('stack');
      expect(ManaPool.IsEmpty(store.getState().owedMana)).toBeFalsy();
    });
  });

  describe('popStackAction', () => {
    let store: Store;

    beforeEach(() => {
      store = createStore(gameStateReducer);
    });

    it('should throw if the stack is empty', () => {
      expect(store.getState().stack).toHaveLength(0);
      expect(() => store.dispatch(popStackAction())).toThrow();
    });

    it("should call onResolve on a card that's on the stack", () => {
      const onResolve = jest.fn();
      onResolve.mockImplementation(state => state);
      const card = { ...Card.NULL, onResolve };
      store.dispatch(moveCardBetweenZonesAction(card, null, 'stack'));

      store.dispatch(popStackAction());
      expect(onResolve).toHaveBeenCalled();
    });
  });
});
