import { gameStateReducer, getPermanent, initialState } from './reducers';
import { tapPermanent } from './actions';
import { GameState, Permanent } from './types';
import 'jest';

const PERMANENT1: Permanent = { ...Permanent.NULL, name: 'Card1' };
const PERMANENT2: Permanent = { ...Permanent.NULL, name: 'Card2' };

const initialGameState = initialState;
const gameWithOneCard: GameState = {
  ...initialGameState,
  board: [PERMANENT1]
};

describe('getPermanent', () => {
  it('should not find a non-existent card', () => {
    expect(() => getPermanent(initialGameState, 0)).toThrowError();
  });

  it('should find an existent card from one board', () => {
    const permanent = getPermanent(gameWithOneCard, 0);
    expect(permanent).toBeDefined();
  });

  it('should find a card from the second board', () => {
    const gameWithTwoBoards: GameState = {
      ...initialGameState,
      board: [PERMANENT1, PERMANENT2]
    };
    const permanent = getPermanent(gameWithTwoBoards, 1);
    expect(permanent).toBeDefined();
  });
});

describe('gameStateReducer', () => {
  describe('tapAction', () => {
    it('should tap a car by id', () => {
      const action = tapPermanent(0);

      expect(gameWithOneCard.board[0].isTapped).toBeFalsy();
      const tappedGameState = gameStateReducer(gameWithOneCard, action);
      expect(tappedGameState.board[0].isTapped).toBeTruthy();
    });
  });
});
