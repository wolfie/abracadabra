import * as React from 'react';
import { Card, GameStateActions } from '../../../redux/game-state/types';
import CardComponent from '../card-component/CardComponent';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { moveCardsBetweenZones } from '../../../redux/game-state/actions';

type DispatchProps = { cast: (card: Card) => any };
type OwnProps = { card: Card };
type Props = DispatchProps & OwnProps;

const HandCardAdapter: React.FunctionComponent<Props> = ({ card, cast }) => (
  <CardComponent
    color={Card.getColor(card)}
    name={card.name}
    isClickable={true}
    onClick={cast(card)}
  />
);

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  cast: (card: Card) => () =>
    dispatch(moveCardsBetweenZones(card, 'hand', 'battlefield'))
});

export default connect(
  null,
  mapDispatchToProps
)(HandCardAdapter);
