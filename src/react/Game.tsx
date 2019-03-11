import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  GameState,
  GameStateActions,
  Permanent
} from '../redux/game-state/types';
import BattlefieldAdapter from './components/battlefield-adapter/BattlefieldAdapter';
import HandAdapter from './components/hand-adapter/HandAdapter';
import ManaPoolAdapter from './components/manapool-adapter/ManaPoolAdapter';
import StackAdapter from './components/stack-adapter/StackAdapter';

type DispatchProps = { initBoard: () => unknown };
type StateProps = { board: Permanent[] };
type OwnProps = {};
type Props = DispatchProps & StateProps & OwnProps;

const Game: React.FunctionComponent<Props> = ({ initBoard, board }) => (
  <>
    <ManaPoolAdapter />
    <BattlefieldAdapter />
    <StackAdapter />
    <HandAdapter />
  </>
);

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  initBoard: () => {}
});

const mapStateToProps = (state: GameState): StateProps => ({
  board: state.board
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
