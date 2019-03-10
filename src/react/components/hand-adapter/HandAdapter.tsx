import * as React from 'react';
import { connect } from 'react-redux';
import { Card, GameState } from '../../../redux/game-state/types';
import HandCardAdapter from './HandCardAdapter';
import CardstackComponent from '../card-stack-component/CardstackComponent';

type StateProps = { hand: Card[] };
type Props = StateProps;

const HandAdapter: React.FunctionComponent<Props> = ({ hand }) => (
  <>
    <h1>Hand:</h1>
    <CardstackComponent>
      {hand.map(card => (
        <HandCardAdapter key={card.id} card={card} />
      ))}
    </CardstackComponent>
  </>
);

const mapStateToProps = (state: GameState): StateProps => ({
  hand: state.hand
});

export default connect(mapStateToProps)(HandAdapter);
