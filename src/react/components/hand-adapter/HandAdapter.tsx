import * as React from 'react';
import { connect } from 'react-redux';
import { Card, GameState } from '../../../redux/game-state/types';
import HandCardAdapter from './HandCardAdapter';
import * as styles from './HandAdapter.scss';

type StateProps = { hand: Card[] };
type Props = StateProps;

const HandAdapter: React.FunctionComponent<Props> = ({ hand }) => (
  <div className={styles.handAdapter}>
    {hand.map(card => (
      <HandCardAdapter key={card.id} card={card} />
    ))}
  </div>
);

const mapStateToProps = (state: GameState): StateProps => ({
  hand: state.hand
});

export default connect(mapStateToProps)(HandAdapter);
