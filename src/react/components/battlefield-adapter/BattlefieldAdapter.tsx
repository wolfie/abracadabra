import * as React from 'react';
import { connect } from 'react-redux';
import { GameState, Permanent } from '../../../redux/game-state/types';
import CardstackComponent from '../card-stack-component/CardstackComponent';
import PermanentAdapter from '../permanent-adapter/PermanentAdapter';

type StateProps = {
  board: Permanent[];
};

type Props = StateProps;

const BattlefieldAdapter: React.FunctionComponent<Props> = ({ board }) => (
  <>
    <h1>Battlefield:</h1>
    <CardstackComponent>
      {board.map(permanent => (
        <PermanentAdapter key={permanent.id} permanent={permanent} />
      ))}
    </CardstackComponent>
  </>
);

const mapStateToProps = (state: GameState): StateProps => ({
  board: state.board
});

export default connect(mapStateToProps)(BattlefieldAdapter);
