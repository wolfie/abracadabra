import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  GameStateActions,
  Permanent,
  GameState,
  Cost
} from '../redux/game-state/types';
import { enterPermanentToBattlefield } from '../redux/game-state/actions';
import PermanentAdapter from './components/card-component';

interface Props {
  initBoard: () => any;
  board: Permanent[];
  costsOwed: Cost;
}

const Game: React.FunctionComponent<Props> = ({
  initBoard,
  board,
  costsOwed
}) => (
  <>
    {!Cost.isEmpty(costsOwed) && <div>Pay up!</div>}
    {board.length > 0 ? (
      <>
        {board.map(permanent => (
          <PermanentAdapter key={permanent.id} permanent={permanent} />
        ))}
      </>
    ) : (
      <button onClick={initBoard}>Init board</button>
    )}
  </>
);

const swamp: Permanent = {
  abilities: [{ cost: { ...Cost.Empty, taps: [-1] } }],
  id: -1,
  isTapped: false,
  name: 'Swamp'
};

const mapDispatchToProps = (dispatch: Dispatch<GameStateActions>) => ({
  initBoard: () => dispatch(enterPermanentToBattlefield(swamp))
});

const mapStateToProps = (state: GameState) => ({
  board: state.board,
  costsOwed: state.costsOwed
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
