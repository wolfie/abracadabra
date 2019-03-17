import {
  gameStateReducer,
  getPermanent,
  moveCardBetweenZonesReducer
} from './reducers';
import {
  castAction,
  moveCardsBetweenZonesAction,
  popStackAction,
  tapPermanentAction
} from './actions';
import * as M11 from '../sets/M11';
import * as A25 from '../sets/A25';
import * as M20 from '../sets/M20';
import {
  Card,
  GameState,
  GameStateActions,
  ManaPool,
  Permanent,
  Zone
} from './types';
import 'jest';
import { createStore, Store as ReduxStore } from 'redux';

type Store = ReduxStore<GameState, GameStateActions>;

const PERMANENT_ID = 0;
const PERMANENT1: Permanent = {
  ...Permanent.NULL,
  id: PERMANENT_ID,
  name: 'Card1'
};

const gameWithOneCard: GameState = {
  ...GameState.NULL,
  board: [PERMANENT1]
};

describe('getPermanent', () => {
  it('should not find a non-existent card', () => {
    expect(() => getPermanent(GameState.NULL, PERMANENT_ID)).toThrowError();
  });

  it('should find an existent card', () => {
    const permanent = getPermanent(gameWithOneCard, PERMANENT_ID);
    expect(permanent).toBeDefined();
  });
});

describe('moveCardBetweenZonesReducer', () => {
  const card = { ...Card.NULL, id: PERMANENT_ID };
  const permanent = { ...card, isTapped: false };
  const cardIsFoundIn = (cardToFind: Card, cardArray: Card[]): boolean =>
    cardArray.find(card_ => cardToFind.id === card_.id) !== undefined;

  it('should remove from hand', () => {
    // TODO remove state use, and use store instead
    const startState = { ...GameState.NULL, hand: [card] };

    expect(cardIsFoundIn(card, startState.hand)).toBeTruthy();

    const movedState = moveCardBetweenZonesReducer(
      startState,
      card,
      'hand',
      null
    );

    expect(cardIsFoundIn(card, movedState.hand)).toBeFalsy();
  });

  it('should add to hand', () => {
    // TODO remove state use, and use store instead
    const startState = GameState.NULL;

    expect(cardIsFoundIn(card, startState.hand)).toBeFalsy();

    const movedState = moveCardBetweenZonesReducer(
      startState,
      card,
      null,
      'hand'
    );

    expect(cardIsFoundIn(card, movedState.hand)).toBeTruthy();
  });

  it('should remove from battlefield', () => {
    // TODO remove state use, and use store instead
    const startState = { ...GameState.NULL, board: [permanent] };

    expect(cardIsFoundIn(permanent, startState.board)).toBeTruthy();

    const movedState = moveCardBetweenZonesReducer(
      startState,
      card,
      'battlefield',
      null
    );

    expect(cardIsFoundIn(permanent, movedState.board)).toBeFalsy();
  });

  it('should add to battlefield', () => {
    // TODO remove state use, and use store instead
    const startState = GameState.NULL;

    expect(cardIsFoundIn(permanent, startState.board)).toBeFalsy();

    const movedState = moveCardBetweenZonesReducer(
      startState,
      card,
      null,
      'battlefield'
    );

    expect(cardIsFoundIn(permanent, movedState.board)).toBeTruthy();
  });

  it('should remove from stack', () => {
    // TODO remove state use, and use store instead
    const startState = { ...GameState.NULL, stack: [card] };

    expect(cardIsFoundIn(permanent, startState.stack)).toBeTruthy();

    const movedState = moveCardBetweenZonesReducer(
      startState,
      card,
      'stack',
      null
    );

    expect(cardIsFoundIn(permanent, movedState.stack)).toBeFalsy();
  });

  it('should add to stack', () => {
    // TODO remove state use, and use store instead
    const startState = GameState.NULL;

    expect(cardIsFoundIn(permanent, startState.stack)).toBeFalsy();

    const movedState = moveCardBetweenZonesReducer(
      startState,
      card,
      null,
      'stack'
    );

    expect(cardIsFoundIn(permanent, movedState.stack)).toBeTruthy();
  });
});

describe('gameStateReducer', () => {
  describe('tapAction', () => {
    it('should tap a card by id', () => {
      // TODO remove state use, and use store instead
      const action = tapPermanentAction(0);

      expect(gameWithOneCard.board[0].isTapped).toBeFalsy();
      const tappedGameState = gameStateReducer(gameWithOneCard, action);
      expect(tappedGameState.board[0].isTapped).toBeTruthy();
    });
  });

  describe('castAction', () => {
    let store: Store;
    beforeEach(() => {
      store = createStore(gameStateReducer);
    });

    it('should cast a land directly on the battlefield', () => {
      const mountain = M20.mountain;
      expect(Card.isLand(mountain)).toBeTruthy();
      store.dispatch(moveCardsBetweenZonesAction(mountain, null, 'hand'));

      store.dispatch(castAction(mountain));

      expect(Zone.find(mountain, store.getState())).toBe('battlefield');
    });

    it('should place a zero-costing non-land card on the stack', () => {
      const ornithopter = M11.ornithopter;
      expect(ManaPool.IsEmpty(ornithopter.castingCost)).toBeTruthy();
      store.dispatch(moveCardsBetweenZonesAction(ornithopter, null, 'hand'));

      store.dispatch(castAction(ornithopter));

      expect(Zone.find(ornithopter, store.getState())).toBe('stack');
      expect(ManaPool.IsEmpty(store.getState().owedMana)).toBeTruthy();
    });

    it('should require payment for a non-free card', () => {
      const darkRitual = A25.darkRitual;
      expect(ManaPool.IsEmpty(darkRitual.castingCost)).toBeFalsy();
      store.dispatch(moveCardsBetweenZonesAction(darkRitual, null, 'hand'));

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
      store.dispatch(moveCardsBetweenZonesAction(card, null, 'stack'));

      store.dispatch(popStackAction());
      expect(onResolve).toHaveBeenCalled();
    });
  });
});
