import * as React from 'react';
import { connect } from 'react-redux';
import { GameState, ManaPool } from '../../../redux/game-state/types';
import * as styles from './ManaPoolAdapter.scss';
import * as classnames from 'classnames/bind';
const css = classnames.bind(styles);

interface StateProps {
  manaPool: ManaPool;
}
type Props = StateProps;

const ManaPoolAdapter: React.FunctionComponent<Props> = ({ manaPool }) => (
  <div className={css('manapool')}>
    {Object.entries(manaPool).map(([key, mana]) => (
      <span key={key} className={css('color')}>
        {key.toUpperCase()}: {mana}
      </span>
    ))}
  </div>
);

const mapStateToProps = (state: GameState): StateProps => ({
  manaPool: state.manaPool
});

export default connect(mapStateToProps)(ManaPoolAdapter);
