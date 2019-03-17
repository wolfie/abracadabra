import * as React from 'react';
import { connect } from 'react-redux';
import {
  AnAmountOfMana,
  GameState,
  GameStateActions,
  ManaPool,
  ManaColor
} from '../../../redux/game-state/types';
import * as styles from './ManaPoolAdapter.scss';
import * as classnames from 'classnames/bind';
import { Dispatch } from 'redux';
import { requestPaySingleManaCostAction } from '../../../redux/game-state/actions';
const css = classnames.bind(styles);

type StateProps = {
  manaPool: AnAmountOfMana;
  owed: AnAmountOfMana;
};

type DispatchProps = {
  requestPaySingleManaCost: (mana: ManaColor) => GameStateActions;
};

type Props = StateProps & DispatchProps;

const ManaPoolAdapter: React.FunctionComponent<Props> = ({
  manaPool,
  owed,
  requestPaySingleManaCost
}) => {
  const colorIsClickable = (colorKey: ManaColor) =>
    (manaPool[colorKey] || 0) > 0 &&
    ((owed.c || 0) > 0 || (owed[colorKey] || 0) > 0);
  return (
    <div className={css('manapool', { highlighted: !ManaPool.IsEmpty(owed) })}>
      {Object.entries(manaPool).map(([key_, mana]) => {
        const key = key_ as ManaColor;
        const isClickable = colorIsClickable(key);
        const onClick = isClickable
          ? () => requestPaySingleManaCost(key)
          : undefined;

        return (
          <span
            key={key}
            className={css('color', {
              clickable: isClickable
            })}
            onClick={onClick}
          >
            {key.toUpperCase()}: {mana}
          </span>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state: GameState): StateProps => ({
  manaPool: state.manaPool,
  owed: state.owedMana
});

const mapDispatchToProps = (
  dispatch: Dispatch<GameStateActions>
): DispatchProps => ({
  requestPaySingleManaCost: mana =>
    dispatch(requestPaySingleManaCostAction(mana))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManaPoolAdapter);
