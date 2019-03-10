import * as React from 'react';
import { Card, GameStateActions } from '../../../redux/game-state/types';
import CardComponent from '../card-component/CardComponent';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { cast } from '../../../redux/game-state/actions';

type DispatchProps = { cast: (card: Card) => any };
type OwnProps = { card: Card };
type Props = DispatchProps & OwnProps;

const HandCardAdapter: React.FunctionComponent<Props> = ({ card, cast }) => (
  <CardComponent
    color={Card.getColor(card)}
    name={card.name}
    isClickable={true}
    onClick={cast(card)}
    typeInfo={card.typeInfo}
  />
);

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  cast: (card: Card) => () => dispatch(cast(card))
});

export default connect(
  null,
  mapDispatchToProps
)(HandCardAdapter);
