import { Card, GameState } from '../types';
import popStackReducer from './pop-stack';
import { identity } from 'ramda';

describe('popStackReducer', () => {
  let state: GameState;

  beforeEach(() => {
    state = GameState.NULL;
  });

  it('should fail assertion when stack is empty', () => {
    expect(() => popStackReducer(state)).toThrow();
  });

  it('should remove object from stack', () => {
    state = {
      ...state,
      stack: [Card.NULL],
      stateBackup: GameState.NULL // required
    };

    state = popStackReducer(state);

    expect(state.stack).toHaveLength(0);
  });

  it('should resolve popped object', () => {
    const onResolve = jest.fn(identity);
    const cardOnStack: Card = { ...Card.NULL, onResolve };
    state = {
      ...state,
      stack: [cardOnStack],
      stateBackup: GameState.NULL // required
    };

    popStackReducer(state);

    expect(onResolve).toHaveBeenCalled();
  });

  it('should clear the backup state (to cancel "undo" functionality)', () => {
    state = {
      ...state,
      stack: [Card.NULL],
      stateBackup: GameState.NULL // required
    };

    state = popStackReducer(state);

    expect(state.stateBackup).toBeUndefined();
  });
});
