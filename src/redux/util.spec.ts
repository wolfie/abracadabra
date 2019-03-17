import { GameState, GameStateActions } from './game-state/types';
import { findPermanent } from './util';
import { createStore, Store as ReduxStore } from 'redux';
import gameStateReducer from './game-state/reducer';
import { swamp } from './sets/M20';
import { Card } from './game-state/types';
import { moveCardBetweenZonesAction } from './game-state/actions';

type Store = ReduxStore<GameState, GameStateActions>;

describe('findPermanent', () => {
  let store: Store;
  beforeEach(() => {
    store = createStore(gameStateReducer);
  });

  it('should not find a non-existent card', () => {
    expect(() => findPermanent(store.getState(), 0)).toThrowError();
  });

  it('should find an existent card', () => {
    const PERMANENT_ID = 0;
    const card = Card.from(swamp, PERMANENT_ID);
    store.dispatch(moveCardBetweenZonesAction(card, null, 'battlefield'));
    const permanent = findPermanent(store.getState(), PERMANENT_ID);
    expect(permanent).toBeDefined();
  });
});
