import * as React from 'react';
import PermanentComponent from './PermanentComponent';
import {
  Permanent,
  GameStateActions,
  GameState,
  Cost
} from '../../../redux/game-state/types';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { activateAbility } from '../../../redux/game-state/actions';

interface Props {
  permanent: Permanent;
  costsOwed: Cost;
  activateAbility: (id: number, ability: number) => any;
}

const clickHandler = (
  permanent: Permanent,
  activateAbility: (id: number, ability: number) => any
) => () => {
  switch (permanent.abilities.length) {
    case 0:
      return;
    case 1:
      return activateAbility(permanent.id, 0);
    default:
      return window.alert('too many actions to handle!');
  }
};

const PermanentAdapter: React.FunctionComponent<Props> = ({
  activateAbility,
  costsOwed,
  permanent
}) => {
  const hasActions = permanent.abilities.length > 0;
  const isValidTarget = costsOwed.taps.indexOf(permanent.id) !== -1;
  const isClickable = hasActions || isValidTarget;
  return (
    <PermanentComponent
      isClickable={isClickable}
      name={permanent.name}
      isTapped={permanent.isTapped}
      onClick={clickHandler(permanent, activateAbility)}
      highlight={isValidTarget}
    />
  );
};

const mapStateToProps = (state: GameState) => ({
  costsOwed: state.costsOwed
});

const mapDispatchToProps = (dispatch: Dispatch<GameStateActions>) => ({
  activateAbility: (id: number, ability: number) =>
    dispatch(activateAbility(id, ability))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermanentAdapter);
