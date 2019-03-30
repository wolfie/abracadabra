import { GameState } from '../types';
import { assert } from '../../util';

export const backupStateReducer = (state: GameState): GameState => {
  assert(() => state.stateBackup === undefined);
  return {
    ...state,
    stateBackup: state
  };
};

export const restoreStateBackupRestore = (state: GameState): GameState => {
  assert(() => state.stateBackup !== undefined);
  return state.stateBackup as GameState;
};

export const clearStateBackupReducer = (state: GameState): GameState => {
  assert(() => state.stateBackup !== undefined);
  const { stateBackup, ...stateWithoutBackup } = state;
  return stateWithoutBackup;
};
