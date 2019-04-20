import { Card, GameState } from '../types';
import { clearStateBackupReducer } from './state-memory-reducers';
import { init, last } from 'ramda';
import { assert } from '../../util';

const popStackReducer = (state: GameState) => {
  assert(() => state.stack.length > 0);

  const poppedStackObject = last(state.stack) as Card;
  const stackWithoutPoppedObject = init(state.stack);

  state = { ...state, stack: stackWithoutPoppedObject };
  state = poppedStackObject.onResolve(state, poppedStackObject);
  state = clearStateBackupReducer(state);
  return state;
};

export default popStackReducer;
