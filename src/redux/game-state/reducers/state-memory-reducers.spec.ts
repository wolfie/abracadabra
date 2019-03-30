import { GameState } from '../types';
import {
  backupStateReducer,
  clearStateBackupReducer,
  restoreStateBackupRestore
} from './state-memory-reducers';
import { swamp } from '../../sets/M20';

const changeStateArbitrarily = (state: GameState): GameState => ({
  ...state,
  hand: [{ ...swamp, id: 0 }]
});

describe('state-memory-redurcers', () => {
  /* Using state instead of store because the backup reducer is a side-effect,
   * not primary effect, of an action. We want to test only the backup effect. */
  let state: GameState;
  beforeEach(() => {
    state = GameState.NULL;
  });

  it('should be able to store and recall a state', () => {
    const originalState = state;

    state = backupStateReducer(originalState);
    state = changeStateArbitrarily(state);
    expect(state).not.toMatchObject(originalState);

    const { stateBackup, ...stateEvenWithoutBackup } = state;
    expect(stateEvenWithoutBackup).not.toMatchObject(originalState);

    state = restoreStateBackupRestore(state);
    expect(state).toMatchObject(originalState);
  });

  it('should be able to remove the backup', () => {
    const originalState = state;

    state = backupStateReducer(originalState);
    expect(state.stateBackup).toBeDefined();

    state = clearStateBackupReducer(state);
    expect(state.stateBackup).toBeUndefined();
  });
});
