import { gameStateReducer, getPermanent, initialState } from './reducers';
import {
  tapPermanent,
  activateAbility,
  enterPermanentToBattlefield
} from './actions';
import { GameState, Permanent, Cost } from './types';
import 'jest';

const CARD1: Permanent = {
  name: 'Card1',
  isTapped: false,
  id: 0,
  abilities: []
};
const CARD2: Permanent = {
  name: 'Card2',
  isTapped: false,
  id: 1,
  abilities: []
};

const initialGameState = initialState;
const gameWithOneCard: GameState = {
  ...initialGameState,
  board: [CARD1]
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
      board: [CARD1, CARD2]
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

  describe('activateAbilityAction', () => {
    it('should add mana cost to costsOwed', () => {
      const card: Permanent = {
        ...CARD1,
        abilities: [{ cost: { ...Cost.Empty, b: 1 } }]
      };
      const gameStateWithCard = gameStateReducer(
        initialGameState,
        enterPermanentToBattlefield(card)
      );

      expect(gameStateWithCard.costsOwed.b).toBe(0);
      const owedGameState = gameStateReducer(
        gameStateWithCard,
        activateAbility(0, 0)
      );
      expect(owedGameState.costsOwed.b).toBe(1);
    });

    it('should add tap cost to costsOwed', () => {
      const card: Permanent = {
        ...CARD1,
        abilities: [{ cost: { ...Cost.Empty, taps: [0] } }]
      };
      const gameStateWithCard = gameStateReducer(
        initialGameState,
        enterPermanentToBattlefield(card)
      );

      expect(gameStateWithCard.costsOwed.taps).toHaveLength(0);
      const owedGameState = gameStateReducer(
        gameStateWithCard,
        activateAbility(0, 0)
      );
      expect(owedGameState.costsOwed.taps).toHaveLength(1);
    });
  });
});
