import * as React from "react";
import { connect } from "react-redux";
import { Card, GameState } from "../../../redux/game-state/types";
import PermanentAdapter from "../permanent-adapter/PermanentAdapter";

type StateProps = {
  hand: Card[];
};

type Props = StateProps;

const HandAdapter: React.FunctionComponent<Props> = ({ hand }) => (
  <>
    <div>Hand</div>
    {hand.map(card => (
      // this needs to change to a "hand card adapter" or whatever.
      <PermanentAdapter permanent={card} />
    ))}
  </>
);

const mapStateToProps = (state: GameState): StateProps => ({
  hand: state.hand
});

export default connect(mapStateToProps)(HandAdapter);
