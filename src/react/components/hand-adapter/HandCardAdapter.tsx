import * as React from 'react';
import {
  Card,
  GameState,
  GameStateActions
} from '../../../redux/game-state/types';
import CardComponent from '../card-component/CardComponent';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { castAction } from '../../../redux/game-state/actions';

type StateProps = { activatableIds: number[] };
type DispatchProps = { cast: (card: Card) => any };
type OwnProps = { card: Card };
type Props = StateProps & DispatchProps & OwnProps;

const HandCardAdapter: React.FunctionComponent<Props> = ({
  card,
  cast,
  activatableIds
}) => (
  <CardComponent
    color={Card.getColor(card)}
    name={card.name}
    isClickable={activatableIds.indexOf(card.id) >= 0}
    onClick={cast(card)}
    typeInfo={card.typeInfo}
  />
);

const mapStateToProps = (state: GameState): StateProps => ({
  activatableIds: state.activatableCardIds
});

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  cast: (card: Card) => () => dispatch(castAction(card))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HandCardAdapter);
