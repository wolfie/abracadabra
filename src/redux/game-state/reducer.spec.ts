import { __hackSetStateAction } from './actions';
import * as M11 from '../sets/M11';
import * as A25 from '../sets/A25';
import * as M20 from '../sets/M20';
import { Card, GameState, Zone } from './types';
import { isEmpty, isLand } from '../util';
import moveCardBetweenZonesReducer from './reducers/move-card-between-zones';
import castReducer from './reducers/cast';

describe('moveCardBetweenZonesReducer', () => {
  const card = Card.from(M20.swamp, 0);
  let state: GameState;

  beforeEach(() => {
    state = GameState.NULL;
  });

  it('should add to and remove from hand', () => {
    expect(() => Zone.find(card, state)).toThrow();

    state = moveCardBetweenZonesReducer(state, card, null, 'hand');
    expect(Zone.find(card, state)).toBe('hand');

    state = moveCardBetweenZonesReducer(state, card, 'hand', null);
    expect(() => Zone.find(card, state)).toThrow();
  });

  it('should add to and remove from battlefield', () => {
    expect(() => Zone.find(card, state)).toThrow();

    state = moveCardBetweenZonesReducer(state, card, null, 'battlefield');
    expect(Zone.find(card, state)).toBe('battlefield');

    state = moveCardBetweenZonesReducer(state, card, 'battlefield', null);
    expect(() => Zone.find(card, state)).toThrow();
  });

  it('should add to and remove from stack', () => {
    expect(() => Zone.find(card, state)).toThrow();

    state = moveCardBetweenZonesReducer(state, card, null, 'stack');
    expect(Zone.find(card, state)).toBe('stack');

    state = moveCardBetweenZonesReducer(state, card, 'stack', null);
    expect(() => Zone.find(card, state)).toThrow();
  });
});

describe('gameStateReducer', () => {
  describe('castAction', () => {
    let state: GameState;
    beforeEach(() => {
      state = GameState.NULL;
    });

    it('should cast a land directly on the battlefield', () => {
      const mountain = Card.from(M20.mountain, 0);
      expect(isLand(mountain)).toBeTruthy();
      state = moveCardBetweenZonesReducer(state, mountain, null, 'hand');

      state = castReducer(state, mountain);

      expect(Zone.find(mountain, state)).toBe('battlefield');
    });

    it('should place a zero-costing non-land card on the stack', () => {
      const ornithopter = Card.from(M11.ornithopter, 0);
      expect(isEmpty(ornithopter.castingCost)).toBeTruthy();
      state = moveCardBetweenZonesReducer(state, ornithopter, null, 'hand');

      state = castReducer(state, ornithopter);

      expect(Zone.find(ornithopter, state)).toBe('stack');
      expect(isEmpty(state.owedMana)).toBeTruthy();
    });

    it('should require payment for a non-free card', () => {
      const darkRitual = Card.from(A25.darkRitual, 0);
      expect(isEmpty(darkRitual.castingCost)).toBeFalsy();
      state = moveCardBetweenZonesReducer(state, darkRitual, null, 'hand');

      state = castReducer(state, darkRitual);

      expect(Zone.find(darkRitual, state)).toBe('stack');
      expect(isEmpty(state.owedMana)).toBeFalsy();
    });
  });
});
