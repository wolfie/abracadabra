import { GameState } from '../types';

export const hasCreaturesToAttackWith = (state: GameState): boolean =>
  state.board.find(
    card => !card.isTapped && !card.wasCastSinceLastStartOfTurn
  ) !== undefined;

export const hasCreaturesDeclaredToAttach = (state: GameState): boolean =>
  false;

export const stackIsPopulated = (state: GameState): boolean =>
  state.stack.length > 0;
