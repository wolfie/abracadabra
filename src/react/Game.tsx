import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  GameStateActions,
  Permanent,
  GameState,
  Ability,
  Card
} from "../redux/game-state/types";
import {
  enterPermanentToBattlefield,
  moveCardsBetweenZones
} from "../redux/game-state/actions";
import PermanentAdapter from "./components/permanent-adapter/PermanentAdapter";
import ManaPoolAdapter from "./components/manapool-adapter/ManaPoolAdapter";
import HandAdapter from "./components/hand-adapter/HandAdapter";

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
    <HandAdapter />
  </>
);

const swamp: Permanent = {
  castingCost: {},
  abilities: [Ability.TapForBlackMana],
  id: 0,
  isTapped: false,
  name: "Swamp"
};

const darkRitual: Card = {
  castingCost: { b: 1 },
  abilities: [],
  id: 1,
  name: "Dark Ritual"
};

const mapDispatchToProps: (...x: any) => DispatchProps = (
  dispatch: Dispatch<GameStateActions>
) => ({
  initBoard: () =>
    dispatch([
      enterPermanentToBattlefield(swamp),
      moveCardsBetweenZones(darkRitual, null, "hand")
    ])
});

const mapStateToProps: (...x: any) => StateProps = (state: GameState) => ({
  board: state.board
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
