import { GameState } from '../types';
import { clearStateBackupReducer } from './state-memory-reducers';

const popStackReducer = (state: GameState) => {
  const isNotLastelement = (_: unknown, i: number) =>
    i !== state.stack.length - 1;

  if (state.stack.length === 0) {
    throw new Error("Stack is empty, can't pop it");
  }

  const poppedStackObject = state.stack[state.stack.length - 1];
  const stackWithoutPoppedObject = state.stack.filter(isNotLastelement);
  state = { ...state, stack: stackWithoutPoppedObject };
  state = poppedStackObject.onResolve(state);
  state = clearStateBackupReducer(state);
  return state;
};

export default popStackReducer;
