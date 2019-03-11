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
import { Card, GameState, Permanent } from './types';
import 'jest';

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
    it('should tap a car by id', () => {
      const action = tapPermanentAction(0);

      expect(gameWithOneCard.board[0].isTapped).toBeFalsy();
      const tappedGameState = gameStateReducer(gameWithOneCard, action);
      expect(tappedGameState.board[0].isTapped).toBeTruthy();
    });
  });

  describe('castAction', () => {
    it.todo('should take mana costs');

    it("should call a card's onCast", () => {
      const onCast = jest.fn();
      const card = { ...Card.NULL, onCast };

      const action = castAction(card);
      gameStateReducer(GameState.NULL, action);
      expect(onCast).toHaveBeenCalled();
    });
  });

  describe('popStackAction', () => {
    it('should throw if the stack is empty', () => {
      const action = popStackAction();
      expect(() => gameStateReducer(GameState.NULL, action)).toThrow();
    });

    it("should call onResolve on a card that's on the stack", () => {
      const onResolve = jest.fn();
      const card = { ...Card.NULL, onResolve };
      const stateWithCardOnStack = gameStateReducer(
        GameState.NULL,
        moveCardsBetweenZonesAction(card, null, 'stack')
      );

      const action = popStackAction();
      gameStateReducer(stateWithCardOnStack, action);
      expect(onResolve).toHaveBeenCalled();
    });
  });
});
