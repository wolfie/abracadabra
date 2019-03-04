import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  GameStateActions,
  Permanent,
  GameState,
  Ability
} from "../redux/game-state/types";
import { enterPermanentToBattlefield } from "../redux/game-state/actions";
import PermanentAdapter from "./components/permanent-adapter/PermanentAdapter";
import ManaPoolAdapter from "./components/manapool-adapter/ManaPoolAdapter";

type DispatchProps = { initBoard: () => unknown };
type StateProps = { board: Permanent[] };
type OwnProps = {};
type Props = DispatchProps & StateProps & OwnProps;

const Game: React.FunctionComponent<Props> = ({ initBoard, board }) => (
  <>
    <ManaPoolAdapter />
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
  abilities: [Ability.TapForBlackMana],
  id: -1,
  isTapped: false,
  name: "Swamp"
};

const mapDispatchToProps: (...x: any) => DispatchProps = (
  dispatch: Dispatch<GameStateActions>
) => ({
  initBoard: () => dispatch(enterPermanentToBattlefield(swamp))
});

const mapStateToProps: (...x: any) => StateProps = (state: GameState) => ({
  board: state.board
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
