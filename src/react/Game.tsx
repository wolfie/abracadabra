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
import { moveCardsBetweenZones } from "../redux/game-state/actions";
import PermanentAdapter from "./components/permanent-adapter/PermanentAdapter";
import ManaPoolAdapter from "./components/manapool-adapter/ManaPoolAdapter";
import HandAdapter from "./components/hand-adapter/HandAdapter";
import CardstackComponent from "./components/card-stack-component/CardstackComponent";

type DispatchProps = { initBoard: () => unknown };
type StateProps = { board: Permanent[] };
type OwnProps = {};
type Props = DispatchProps & StateProps & OwnProps;

const Game: React.FunctionComponent<Props> = ({ initBoard, board }) => (
  <>
    <ManaPoolAdapter />
    {board.length > 0 ? (
      <CardstackComponent>
        {board.map(permanent => (
          <PermanentAdapter key={permanent.id} permanent={permanent} />
        ))}
      </CardstackComponent>
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

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  initBoard: () =>
    dispatch([
      moveCardsBetweenZones(swamp, null, "battlefield"),
      moveCardsBetweenZones(darkRitual, null, "hand")
    ])
});

const mapStateToProps = (state: GameState): StateProps => ({
  board: state.board
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
