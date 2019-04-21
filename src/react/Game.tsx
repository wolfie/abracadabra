import * as React from 'react';
import BattlefieldAdapter from './components/battlefield-adapter/BattlefieldAdapter';
import HandAdapter from './components/hand-adapter/HandAdapter';
import ManaPoolAdapter from './components/manapool-adapter/ManaPoolAdapter';
import PhaseAdapter from './components/phase-adapter/PhaseAdapter';
import * as styles from './Game.scss';
import { connect } from 'react-redux';
import { GameState } from '../redux/game-state/types';
import { stackIsPopulated } from '../redux/game-state/selectors';
import StackAdapter from './components/stack-adapter/StackAdapter';

type StateProps = {
  showStack: boolean;
};

type Props = StateProps;

const Game: React.FunctionComponent<Props> = ({ showStack }) => (
  <div className={styles.gameArea}>
    <div className={styles.board}>
      <div className={styles.battlefield}>
        <BattlefieldAdapter />
      </div>
      {showStack && (
        <div className={styles.stack}>
          <StackAdapter />
        </div>
      )}
    </div>
    <PhaseAdapter />
    <ManaPoolAdapter />

    <HandAdapter />
  </div>
);

const mapStateToProps = (state: GameState): StateProps => ({
  showStack: stackIsPopulated(state)
});

export default connect(mapStateToProps)(Game);
